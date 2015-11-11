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
	"errors"
	"fmt"
	"time"

	"golang.org/x/crypto/bcrypt"

	"github.com/Sirupsen/logrus"
	"github.com/desertbit/bitmonster"
	"github.com/desertbit/bitmonster/log"
)

//#################//
//### Constants ###//
//#################//

const (
	authSocketValueKey = "auth"

	checkAuthInterval = time.Minute
	reauthTimeout     = 15 * time.Second
)

//#################//
//### Variables ###//
//#################//

var (
	ErrNotAuth = errors.New("not authenticated")
)

//#####################//
//### Private Types ###//
//#####################//

type authSocketValue struct {
	isAuth         bool
	authSessionKey string
	userID         string
	reauthTimer    *time.Timer
}

func newAuthSocketValue() *authSocketValue {
	return &authSocketValue{}
}

//##############//
//### Public ###//
//##############//

// IsAuth returns a boolean whenever the socket is authentication by a user.
func IsAuth(s *bitmonster.Socket) bool {
	// Get the current socket value.
	av := getAuthSocketValue(s)
	if av == nil {
		return false
	}

	return av.isAuth
}

// CurrentUser returns the current authenticated user of the socket session.
// If the socket session is not authenticated, then ErrNotAuth is returned.
// Optionally pass one variadic boolean to enable caching.
// If caching is enabled, multiple calls to this method will return the cached user value
// instead of always obtaining the value from the database.
// Note: The cached value might be out-of-date.
// Don't enable the cache if the returned user value is used to be written to the database.
func CurrentUser(s *bitmonster.Socket, enableCache ...bool) (*User, error) {
	// Get the current socket value.
	av := getAuthSocketValue(s)
	if av == nil {
		return nil, fmt.Errorf("failed to obtain auth socket value")
	}

	// Check if authenticated.
	if !av.isAuth {
		return nil, ErrNotAuth
	}

	if len(enableCache) > 0 && enableCache[0] {
		// Try to obtain the current user from the cache.
		user := getCachedCurrentUser(s)
		if user != nil {
			// Return the cached value.
			return user, nil
		}
	}

	// Obtain the user by the ID.
	user, err := GetUser(av.userID)
	if err != nil {
		return nil, err
	}

	// Set the user to the cache.
	setCachedCurrentUser(s, user)

	return user, nil
}

//###############//
//### Private ###//
//###############//

func init() {
	// Bind the event.
	bitmonster.OnNewSocket(onNewSocket)
}

func onNewSocket(s *bitmonster.Socket) {
	// Start a goroutine to check the authentication state in an interval.
	go func() {
		ticker := time.NewTicker(checkAuthInterval)
		defer ticker.Stop()

		for {
			select {
			case <-s.ClosedChan():
				// Just release this goroutine.
				return

			case <-ticker.C:
				checkSocketAuthentication(s)
			}
		}
	}()
}

// getAuthSocketValue obtains the authentication socket value from the socket.
// If not present, then this function creates the value.
func getAuthSocketValue(s *bitmonster.Socket) *authSocketValue {
	// Get or create the value.
	v := s.Value(authSocketValueKey, func() interface{} {
		// Not present. Create it.
		return newAuthSocketValue()
	})

	// Cast.
	av, ok := v.(*authSocketValue)
	if !ok {
		return nil
	}

	return av
}

// resetAuthSocketValue removes the socket authentication values and triggers
// the socket Check method.
func resetAuthSocketValue(s *bitmonster.Socket) {
	// Debug log.
	log.L.WithFields(logrus.Fields{
		"remoteAddress": s.RemoteAddr(),
	}).Debugf("auth: authentication state resetted")

	// Get the auth socket value.
	av := getAuthSocketValue(s)
	if av != nil {
		// Stop the reauth timer if present.
		if av.reauthTimer != nil {
			av.reauthTimer.Stop()
		}
	}

	// Remove the socket auth value to delete the authenticated infos.
	s.DeleteValue(authSocketValueKey)

	// Clear the cache.
	clearCache(s)

	// Rerun the event hooks.
	// This will unbind events which require authentication.
	s.Check()
}

func hashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	return string(hash), nil
}

func comparePasswordHash(hashedPassword, password string) error {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err
}

func checkSocketAuthentication(s *bitmonster.Socket) {
	// Get the auth socket value.
	av := getAuthSocketValue(s)
	if av == nil {
		return
	}

	// Skip if not authenticated.
	if !av.isAuth {
		return
	}

	// Debug log.
	log.L.WithFields(logrus.Fields{
		"remoteAddress": s.RemoteAddr(),
	}).Debugf("auth: reauthentication requested")

	// Trigger the event to reauthenticate.
	eventReauth.TriggerSocket(s)

	// Start a timeout to logout the socket session.
	av.reauthTimer = time.AfterFunc(reauthTimeout, func() {
		// Reset the socket authentication values.
		resetAuthSocketValue(s)
	})
}

// TODO//#####################################################################################
/*
const (
	httpHandleURL = "/bitmonster/auth"
)


func init() {
	// Register the HTTP handler.
	http.HandleFunc(httpHandleURL, handleAuthRequest)
}

func handleAuthRequest(rw http.ResponseWriter, req *http.Request) {
	// Only allow POST requests
	if req.Method != "POST" {
		http.Error(rw, "Bad Request", 400)
		return
	}

	// Obtain the auth request key from the POST body.
	// Get the instance ID from the POST query.
	key := req.PostFormValue("key")
	if len(key) == 0 {
		http.Error(rw, "Bad Request", 400)
		return
	}

	// Obtain the socket with the key.
	s := getAuthRequestSocket(key)
	if s == nil {
		http.Error(rw, "Bad Request", 400)
		return
	}

	// TODO: Check origin.
}
*/
