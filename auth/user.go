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
	"sync"
	"time"

	"github.com/asaskevich/govalidator"
	"github.com/desertbit/bitmonster/db"
	"github.com/desertbit/bitmonster/utils"

	r "github.com/dancannon/gorethink"
)

const (
	minimumPasswordLen = 8
)

var (
	ErrEmptyResult           = errors.New("empty result")
	ErrUserNotFound          = errors.New("user not found")
	ErrUsernameAlreadyExists = errors.New("a user with the username already exists")
)

//######################//
//### Database Types ###//
//######################//

type AuthSessions map[string]*AuthSession

type AuthSession struct {
	Fingerprint  string    `gorethink:"fingerprint"`
	Token        string    `gorethink:"token"`
	TokenCreated time.Time `gorethink:"tokenCreated"`
	Created      time.Time `gorethink:"created"`
	LastAuth     time.Time `gorethink:"lastAuth"`
}

type Users []*User

type User struct {
	ID       string   `gorethink:"id"        json:"id"           valid:"uuidv4,required"`
	Username string   `gorethink:"username"  json:"username"     valid:"printableascii,length(3|50),required"`
	Name     string   `gorethink:"name"      json:"name"`
	Email    string   `gorethink:"email"     json:"email"        valid:"email,length(3|100),required"`
	Enabled  bool     `gorethink:"enabled"   json:"enabled"`
	Groups   []string `gorethink:"groups"    json:"groups"`

	Created   time.Time `gorethink:"created"    json:"created"`
	LastLogin time.Time `gorethink:"lastLogin"  json:"lastLogin"`

	AuthSessions AuthSessions `gorethink:"authSessions"    json:"-"`
	PasswordHash string       `gorethink:"passwordHash"    json:"-"`
}

// Validate the struct fields.
func (u *User) Validate() error {
	// Validate the struct
	result, err := govalidator.ValidateStruct(u)
	if err != nil {
		return fmt.Errorf("invalid required user fields: %v", err)
	} else if !result {
		return fmt.Errorf("invalid required user fields")
	}

	// Check if the user groups are valid.
	valid := validGroups(u.Groups...)
	if !valid {
		return fmt.Errorf("invalid user group(s): %v", u.Groups)
	}

	return nil
}

// ClearAuthSessions removes all current authenticated sessions of the user.
// This will force an overall relogin.
func (u *User) ClearAuthSessions() {
	// Reset the map.
	u.AuthSessions = nil
}

// ChangePassword changes a user's password.
func (u *User) ChangePassword(password string) (err error) {
	// Prepare the password.
	if len(password) < minimumPasswordLen {
		return fmt.Errorf("password is too short: minimum %v characters required", minimumPasswordLen)
	}

	u.PasswordHash, err = hashPassword(password)
	if err != nil {
		return err
	}

	return nil
}

// ComparePasswords compares the passed password with the user's password hash.
// This method is safe against timing attacks.
func (u *User) ComparePasswords(password string) (match bool) {
	// Compare the password.
	err := comparePasswordHash(u.PasswordHash, password)
	if err != nil {
		return false
	}

	return true
}

// AddGroup adds the user to the passed group(s).
func (u *User) AddGroup(groups ...string) {
Loop:
	for _, g := range groups {
		// Check if the user is already in the group.
		for _, ug := range u.Groups {
			if ug == g {
				continue Loop
			}
		}

		// Add the user to the group.
		u.Groups = append(u.Groups, g)
	}
}

// RemoveGroup removes the user from the group(s).
func (u *User) RemoveGroup(groups ...string) {
	for _, g := range groups {
		// Remove the group. Don't break, to remove possible duplicate groups.
		for i := len(u.Groups) - 1; i >= 0; i-- {
			if g == u.Groups[i] {
				u.Groups = append(u.Groups[:i], u.Groups[i+1:]...)
			}
		}
	}
}

// HasGroup checks if the user is member of the group.
func (u *User) HasGroup(group string) bool {
	for _, g := range u.Groups {
		if g == group {
			return true
		}
	}

	return false
}

//##############//
//### Public ###//
//##############//

// NewUser creates a new user value.
func NewUser(username, name, email, password string) (*User, error) {
	u := &User{
		ID:       utils.UUID(),
		Username: username,
		Name:     name,
		Email:    email,
		Enabled:  true,
		Created:  time.Now(),
	}

	// Set the password.
	err := u.ChangePassword(password)
	if err != nil {
		return nil, err
	}

	// Validate the struct
	err = u.Validate()
	if err != nil {
		return nil, err
	}

	return u, nil
}

// GetUser obtains a user by its ID.
// Returns a ErrUserNotFound error if the user does not exists.
func GetUser(id string) (*User, error) {
	if len(id) == 0 {
		return nil, fmt.Errorf("failed to get user by ID: ID is empty")
	}

	rows, err := r.Table(DBTableUsers).Get(id).Run(db.Session)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID '%s': %v", id, err)
	}

	var u User
	err = rows.One(&u)
	if err != nil {
		// Check if nothing was found.
		if err == r.ErrEmptyResult {
			return nil, ErrUserNotFound
		}

		return nil, fmt.Errorf("failed to get user by ID '%s': %v", id, err)
	}

	return &u, nil
}

// GetUserByUsername obtains a user by its username.
// Returns a ErrUserNotFound error if the user does not exists.
func GetUserByUsername(username string) (*User, error) {
	if len(username) == 0 {
		return nil, fmt.Errorf("failed to get user by username: username is empty")
	}

	rows, err := r.Table(DBTableUsers).GetAllByIndex(DBTableUsersUsernameIndex, username).Run(db.Session)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by username '%s': %v", username, err)
	}

	var u User
	err = rows.One(&u)
	if err != nil {
		// Check if nothing was found.
		if err == r.ErrEmptyResult {
			return nil, ErrUserNotFound
		}

		return nil, fmt.Errorf("failed to get user by username '%s': %v", username, err)
	}

	return &u, nil
}

// Hack for AddUser.
// -----------------
var addUserMutex sync.Mutex

// AddUser adds a new user to the database.
// Returns ErrUsernameAlreadyExists if the username already exists.
func AddUser(u *User) error {
	// Start Hack.
	// -----------
	addUserMutex.Lock()
	defer addUserMutex.Unlock()
	// ---------
	// END Hack.

	// Validate the struct
	err := u.Validate()
	if err != nil {
		return err
	}

	// Check if a user is already registered with the same username.
	cu, err := GetUserByUsername(u.Username)
	if err != nil && err != ErrUserNotFound {
		return err
	} else if cu != nil {
		return ErrUsernameAlreadyExists
	}

	// Insert the user to the database.
	_, err = r.Table(DBTableUsers).Insert(u).RunWrite(db.Session)
	if err != nil {
		return fmt.Errorf("failed to insert new user '%s' to database: id '%s': %v", u.Username, u.ID, err)
	}

	// Start Hack.
	// -----------
	// Recheck if the username is unique.
	// This has to be done, because there is no atomic way to ensure that the username field is unique.
	// See: https://github.com/rethinkdb/rethinkdb/issues/1716
	// See TODO.
	rows, err := r.Table(DBTableUsers).GetAllByIndex(DBTableUsersUsernameIndex, u.Username).Count().Run(db.Session)
	if err != nil {
		return fmt.Errorf("failed to get newly created user by username '%s': %v", u.Username, err)
	}

	// Get the count.
	var count int
	err = rows.One(&count)
	if err != nil {
		return err
	}

	// If there are multiple users with the same username, then remove the newly created user again.
	if count > 1 {
		// Delete the user from the database.
		_, err := r.Table(DBTableUsers).Get(u.ID).Delete().RunWrite(db.Session)
		if err != nil {
			return fmt.Errorf("failed to delete duplicate user '%s' from database: id '%s': %v", u.Username, u.ID, err)
		}
		return ErrUsernameAlreadyExists
	}
	// ---------
	// END Hack.

	// Trigger the event.
	emitter.Emit(emitterOnNewUser, u)

	return nil
}

// DeleteUser removes a user from the database.
func DeleteUser(u *User) error {
	// Delete the user from the database.
	_, err := r.Table(DBTableUsers).Get(u.ID).Delete().RunWrite(db.Session)
	if err != nil {
		return fmt.Errorf("failed to delete user '%s' from database: id '%s': %v", u.Username, u.ID, err)
	}

	// Trigger the event.
	emitter.Emit(emitterOnDeleteUser, u)

	return nil
}

// UpdateUser updates a user in the database.
// The user fields replace all fields of the document stored in the database.
// Don't call this function if the username of the user was changed.
// Instead use ChangeUsername to change usernames.
func UpdateUser(u *User) error {
	// Validate the struct
	err := u.Validate()
	if err != nil {
		return err
	}

	// Update the user.
	_, err = r.Table(DBTableUsers).Get(u.ID).Replace(u).RunWrite(db.Session)
	if err != nil {
		return fmt.Errorf("failed to update user '%s' in database: id '%s': %v", u.Username, u.ID, err)
	}

	return nil
}

// Hack for ChangeUsername.
// ------------------------
var changeUsernameMutex sync.Mutex

// ChangeUsername changes the username of the user in the database.
// Returns ErrUsernameAlreadyExists if the username already exists.
// Hint: This implementation is currently not atomic if multiple BitMonster
// instances are used to provide the backend service.
// This is due to limitations of the RethinkDB database.
// See TODO.
// See: https://github.com/rethinkdb/rethinkdb/issues/1716
func ChangeUsername(u *User, newUsername string) error {
	// Start Hack.
	// -----------
	changeUsernameMutex.Lock()
	defer changeUsernameMutex.Unlock()
	// ---------
	// END Hack.

	if len(newUsername) == 0 {
		return fmt.Errorf("failed to change username: new username is empty")
	}

	// Check if a user is already registered with the new username.
	cu, err := GetUserByUsername(newUsername)
	if err != nil && err != ErrUserNotFound {
		return err
	} else if cu != nil {
		return ErrUsernameAlreadyExists
	}

	// Set the new username.
	u.Username = newUsername

	// Update the user in the database.
	err = UpdateUser(u)
	if err != nil {
		return err
	}

	return nil
}

// GetUsers obtains all users from the database.
// Optionally pass groups. If the user is at least in one of the passed groups
// it is added to the result slice.
// Returns ErrEmptyResult if no users are found.
// Don't use this method for setups with a large user database.
func GetUsers(groups ...string) (Users, error) {
	// Create the database term.
	term := r.Table(DBTableUsers)

	// Add the groups filter if present.
	if len(groups) > 0 {
		// Transform to interface slice.
		groupsI := make([]interface{}, len(groups))
		for i, g := range groups {
			groupsI[i] = g
		}

		// Append the filter.
		term = term.Filter(r.Row.Field("groups").Contains(groupsI...))
	}

	// Obtain the users.
	rows, err := term.Run(db.Session)
	if err != nil {
		return nil, fmt.Errorf("failed to get users: %v", err)
	}

	var users Users
	err = rows.All(&users)
	if err != nil {
		// Check if nothing was found.
		if err == r.ErrEmptyResult {
			return nil, ErrEmptyResult
		}

		return nil, fmt.Errorf("failed to get users: %v", err)
	}

	return users, nil
}
