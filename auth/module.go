/*
 *  BitMonster - A Monster handling your Bits
 *  Copyright (C) 2015  Roland Singer <roland.singer[at]desertbit.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package auth

import (
	"crypto/subtle"
	"fmt"
	"time"

	"github.com/desertbit/bitmonster"
	"github.com/desertbit/bitmonster/log"
	"github.com/desertbit/bitmonster/settings"
	"github.com/desertbit/bitmonster/utils"

	"github.com/Sirupsen/logrus"
)

const (
	// ModuleName specifies the BitMonster module name.
	ModuleName = "auth"
)

const (
	maxAuthSessions        = 20
	authSessionKeyLength   = 20
	authSessionTokenLength = 30

	authSessionTokenLifetime = time.Minute
)

var (
	module      *bitmonster.Module
	eventReauth *bitmonster.Event

	authSessionMaxAge time.Duration
)

//###############//
//### Private ###//
//###############//

func init() {
	var err error

	// On init hook for BitMonster.
	bitmonster.OnInit(func() {
		// Set the maximum session age.
		authSessionMaxAge = time.Duration(int64(time.Second) * int64(settings.Settings.AuthSessionMaxAge))
	})

	// Create the authentication module.
	module, err = bitmonster.NewModule(ModuleName)
	bitmonster.Fatal(err)

	// Add events.
	eventReauth = module.AddEvent("reauthenticate")

	// Add module methods.
	module.AddMethods(bitmonster.MethodMap{
		"login":        login,
		"logout":       logout,
		"authenticate": authenticate,
	})

	// Module methods which require admin rights.
	module.AddMethods(bitmonster.MethodMap{
		"admin.getGroups":         getGroups,
		"admin.getUser":           getUser,
		"admin.getUsers":          getUsers,
		"admin.addUser":           addUser,
		"admin.deleteUser":        deleteUser,
		"admin.editUser":          editUser,
		"admin.changeUsername":    changeUsername,
		"admin.changePassword":    changePassword,
		"admin.clearAuthSessions": clearAuthSessions,
	}, MustAdminGroup())

	// Module methods which require only an authenticated session.
	module.AddMethods(bitmonster.MethodMap{
		"user.getUser":           getCurrentUser,
		"user.editUser":          editCurrentUser,
		"user.changePassword":    changePasswordOfCurrentUser,
		"user.clearAuthSessions": clearAuthSessionsOfCurrentUser,
	}, MustIsAuth())
}

//######################//
//### Module Methods ###//
//######################//

func login(c *bitmonster.Context) error {
	// Obtain the authentication data from the context.
	loginData := struct {
		Username    string `json:"username"`
		Password    string `json:"password"`
		Fingerprint string `json:"fingerprint"`
	}{}

	err := c.Decode(&loginData)
	if err != nil {
		return err
	}

	if len(loginData.Username) == 0 || len(loginData.Password) == 0 || len(loginData.Fingerprint) == 0 {
		c.Error("invalid login credentials")
		return nil
	}

	// Get the user by the username.
	user, err := GetUserByUsername(loginData.Username)
	if err != nil {
		c.Error("invalid login credentials")
		return nil
	}

	// Compare the password.
	if match := user.ComparePasswords(loginData.Password); !match {
		c.Error("invalid login credentials")
		return nil
	}

	// Update the last login timestamp.
	timeNow := time.Now()
	user.LastLogin = timeNow

	// Handle the fingerprint like a password.
	fingerprint, err := hashPassword(loginData.Fingerprint)
	if err != nil {
		return err
	}

	// Create the map if nil.
	if user.AuthSessions == nil {
		user.AuthSessions = make(AuthSessions)
	}

	// Remove the oldest sessions if the maximum count of sessions is reached.
	// Included endless-loop prevention. Just to be sure.
	for i := 0; i < 100 && len(user.AuthSessions) >= maxAuthSessions; i++ {
		minTime := timeNow
		var minKey string
		for key, as := range user.AuthSessions {
			if as.LastAuth.Before(minTime) {
				minTime = as.LastAuth
				minKey = key
			}
		}
		delete(user.AuthSessions, minKey)
	}

	// Create a new authenticated session.
	as := &AuthSession{
		Fingerprint:  fingerprint,
		Token:        utils.RandomString(authSessionTokenLength),
		TokenCreated: timeNow,
		Created:      timeNow,
		LastAuth:     timeNow,
	}

	// Create a new unique key for it.
	key := utils.RandomString(authSessionKeyLength)
	for {
		if _, ok := user.AuthSessions[key]; !ok {
			break
		}
		key = utils.RandomString(authSessionKeyLength)
	}

	// Add it to the map with the key.
	user.AuthSessions[key] = as

	// Create a new encrypted authentication token.
	authToken, err := newAuthToken(user.ID, key, as.Token)
	if err != nil {
		return err
	}

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	// Create the respond data.
	data := struct {
		Token string `json:"token"`
	}{
		Token: authToken,
	}

	// Set it.
	c.Data(data)

	return nil
}

func logout(c *bitmonster.Context) error {
	// Get the socket.
	s := c.Socket()

	// Get the current authenticated user.
	user, err := CurrentUser(s)
	if err != nil {
		if err == ErrNotAuth {
			// Not authenticated.
			return nil
		}
		return err
	}

	// Debug log.
	log.L.WithFields(logrus.Fields{
		"remoteAddress": s.RemoteAddr(),
		"user":          user.Username,
		"userID":        user.ID,
	}).Debugf("auth: logout")

	// Get the current socket value.
	av := getAuthSocketValue(s)
	if av == nil {
		return fmt.Errorf("failed to obtain auth socket value")
	}

	// Reset the socket authentication values.
	resetAuthSocketValue(s)

	// Remove the authenticated session specified by the key.
	if user.AuthSessions != nil {
		delete(user.AuthSessions, av.authSessionKey)
	}

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	return nil
}

func authenticate(c *bitmonster.Context) (err error) {
	// Get the socket.
	s := c.Socket()

	// Reset the session authentication values if an error occurs.
	defer func() {
		if err == nil {
			return
		}

		// Reset the socket authentication values.
		resetAuthSocketValue(s)
	}()

	// Obtain the authentication data from the context.
	authData := struct {
		Token       string `json:"token"`
		Fingerprint string `json:"fingerprint"`
	}{}

	err = c.Decode(&authData)
	if err != nil {
		return err
	}

	if len(authData.Token) == 0 || len(authData.Fingerprint) == 0 {
		return fmt.Errorf("invalid authentication data")
	}

	// Parse the authentication data.
	userID, key, token, err := parseAuthToken(authData.Token)
	if err != nil {
		return err
	}

	// Obtain the user.
	user, err := GetUser(userID)
	if err != nil {
		return err
	}

	// Debug log.
	log.L.WithFields(logrus.Fields{
		"remoteAddress": s.RemoteAddr(),
		"user":          user.Username,
		"userID":        user.ID,
	}).Debugf("auth: authentication request")

	// Check if the authenticated sessions map is nil.
	if user.AuthSessions == nil {
		return fmt.Errorf("invalid authentication data")
	}

	// Obtain the authenticated session value.
	as, ok := user.AuthSessions[key]
	if !ok {
		return fmt.Errorf("invalid authentication data")
	}

	// Get the current time.
	timeNow := time.Now()

	// Check if the maximum age is reached.
	if as.Created.Add(authSessionMaxAge).Before(timeNow) {
		return fmt.Errorf("authenticated user session expired: max age reached")
	}

	// Compare the tokens in a constant time span.
	if subtle.ConstantTimeCompare([]byte(as.Token), []byte(token)) != 1 {
		return fmt.Errorf("invalid authentication token")
	}

	// Compare the fingerprints.
	err = comparePasswordHash(as.Fingerprint, authData.Fingerprint)
	if err != nil {
		return fmt.Errorf("invalid fingerprint: %v", err)
	}

	// Hint: Authentication success.
	// -----------------------------

	// Update the timestamps.
	user.LastLogin = timeNow
	as.LastAuth = timeNow

	// If the token is expired, then create a new token.
	// This ensures an authentication token rotation.
	var authToken string
	if as.TokenCreated.Add(authSessionTokenLifetime).Before(timeNow) {
		// Create a new random token.
		as.Token = utils.RandomString(authSessionTokenLength)
		as.TokenCreated = timeNow

		// Create a new encrypted authentication token.
		authToken, err = newAuthToken(user.ID, key, as.Token)
		if err != nil {
			return err
		}

		// Debug log.
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"user":          user.Username,
			"userID":        user.ID,
		}).Debugf("auth: authentication token rotated")
	}

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	// Get or create the auth socket value.
	av := getAuthSocketValue(s)
	if av == nil {
		return fmt.Errorf("failed to create auth socket value for socket")
	}

	// Stop the logout timer if present.
	if av.reauthTimer != nil {
		av.reauthTimer.Stop()
	}

	// Update the auth socket value.
	av.isAuth = true
	av.authSessionKey = key
	av.userID = user.ID

	// Clear the cache.
	clearCache(s)

	// Create the respond data.
	data := struct {
		Token string `json:"token"`
		User  *User  `json:"user"`
	}{
		Token: authToken,
		User:  user,
	}

	// Set it.
	c.Data(data)

	// Debug log.
	log.L.WithFields(logrus.Fields{
		"remoteAddress": s.RemoteAddr(),
		"user":          user.Username,
		"userID":        user.ID,
	}).Debugf("auth: authentication success")

	return nil
}

//##############################//
//### Module Methods - Admin ###//
//##############################//

func getGroups(c *bitmonster.Context) error {
	// Obtain all groups.
	groups := Groups()

	// Set the groups slice as return data.
	c.Data(groups)

	return nil
}

func getUser(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		// Either pass an ID or an Username.
		ID       string `json:"id"`
		Username string `json:"username"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Obtain the user.
	var user *User

	if len(data.ID) > 0 {
		user, err = GetUser(data.ID)
		if err != nil {
			return err
		}
	} else if len(data.Username) > 0 {
		user, err = GetUserByUsername(data.Username)
		if err != nil {
			return err
		}
	} else {
		c.Error("invalid method data passed")
		return nil
	}

	// Set the user as return data.
	c.Data(user)

	return nil
}

func getUsers(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		Groups []string `json:"groups"`
	}{}

	err := c.Decode(&data)
	// Skip if no context data is available.
	if err != nil && err != bitmonster.ErrNoContextData {
		return err
	}

	// Prepare the data.
	data.Groups = utils.RemoveDuplicateStrings(data.Groups)

	// Obtain the users.
	users, err := GetUsers(data.Groups...)
	if err != nil {
		return err
	}

	// Set the users as return data.
	c.Data(users)

	return nil
}

func addUser(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		Username string `json:"username"`
		Name     string `json:"name"`
		EMail    string `json:"email"`
		Password string `json:"password"`

		Enabled bool     `json:"enabled"`
		Groups  []string `json:"groups"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Prepare the data.
	data.Groups = utils.RemoveDuplicateStrings(data.Groups)

	// Create a new user value.
	// Fields are validated by the function.
	user, err := NewUser(data.Username, data.Name, data.EMail, data.Password)
	if err != nil {
		return err
	}

	// Set the additinal data fields.
	user.Enabled = data.Enabled
	user.Groups = data.Groups

	// Add the user to the database.
	err = AddUser(user)
	if err != nil {
		return err
	}

	// Set the newly created user as return data.
	c.Data(user)

	return nil
}

func deleteUser(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		ID string `json:"id"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Obtain the user.
	user, err := GetUser(data.ID)
	if err != nil {
		return err
	}

	// Delete the user.
	err = DeleteUser(user)
	if err != nil {
		return err
	}

	return nil
}

func editUser(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		ID string `json:"id"`

		// All these values replace the values of the user:
		Name    string   `json:"name"`
		Email   string   `json:"email"`
		Enabled bool     `json:"enabled"`
		Groups  []string `json:"groups"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Prepare the data.
	data.Groups = utils.RemoveDuplicateStrings(data.Groups)

	// Obtain the user.
	user, err := GetUser(data.ID)
	if err != nil {
		return err
	}

	// Update the user fields.
	user.Name = data.Name
	user.Email = data.Email
	user.Enabled = data.Enabled
	user.Groups = data.Groups

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	// Set the updated user as return data.
	c.Data(user)

	return nil
}

func changeUsername(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		ID       string `json:"id"`
		Username string `json:"username"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Obtain the user.
	user, err := GetUser(data.ID)
	if err != nil {
		return err
	}

	// Change the user's username.
	err = ChangeUsername(user, data.Username)
	if err != nil {
		return err
	}

	return nil
}

func changePassword(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		ID       string `json:"id"`
		Password string `json:"password"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Obtain the user.
	user, err := GetUser(data.ID)
	if err != nil {
		return err
	}

	// Change the user's password.
	err = user.ChangePassword(data.Password)
	if err != nil {
		return err
	}

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	return nil
}

func clearAuthSessions(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		ID string `json:"id"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Obtain the user
	user, err := GetUser(data.ID)
	if err != nil {
		return err
	}

	// Clear the authenticated sessions.
	user.ClearAuthSessions()

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	return nil
}

//#############################//
//### Module Methods - User ###//
//#############################//

func getCurrentUser(c *bitmonster.Context) error {
	// Obtain the current user.
	user, err := CurrentUser(c.Socket())
	if err != nil {
		return err
	}

	// Set the user as return data.
	c.Data(user)

	return nil
}

func editCurrentUser(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		// All these values replace the values of the user:
		Name  string `json:"name"`
		Email string `json:"email"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Obtain the current user.
	user, err := CurrentUser(c.Socket())
	if err != nil {
		return err
	}

	// Update the user fields.
	user.Name = data.Name
	user.Email = data.Email

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	// Set the updated user as return data.
	c.Data(user)

	return nil
}

func changePasswordOfCurrentUser(c *bitmonster.Context) error {
	// Obtain the data from the context.
	data := struct {
		OldPassword string `json:"oldPassword"`
		NewPassword string `json:"newPassword"`
	}{}

	err := c.Decode(&data)
	if err != nil {
		return err
	}

	// Obtain the current user.
	user, err := CurrentUser(c.Socket())
	if err != nil {
		return err
	}

	// Check if the old password is valid.
	if match := user.ComparePasswords(data.OldPassword); !match {
		c.Error("wrong_password")
		return nil
	}

	// Change the user's password.
	err = user.ChangePassword(data.NewPassword)
	if err != nil {
		return err
	}

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	return nil
}

func clearAuthSessionsOfCurrentUser(c *bitmonster.Context) error {
	// Obtain the current user.
	user, err := CurrentUser(c.Socket())
	if err != nil {
		return err
	}

	// Clear the authenticated sessions.
	user.ClearAuthSessions()

	// Update the user in the database.
	err = UpdateUser(user)
	if err != nil {
		return err
	}

	return nil
}
