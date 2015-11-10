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

	"github.com/asaskevich/govalidator"
	"github.com/desertbit/bitmonster/db"
	"github.com/desertbit/bitmonster/utils"

	r "github.com/dancannon/gorethink"
)

const (
	dbTableUsers              = "auth_users"
	dbTableUsersUsernameIndex = "username"
)

const (
	// AdminGroup is the administration group.
	AdminGroup = "admin"
)

var (
	ErrNotFound              = errors.New("Not found")
	ErrUsernameAlreadyExists = errors.New("a user with the username already exists")
)

//######################//
//### Database Types ###//
//######################//

type AuthSessions map[string]*AuthSession

type AuthSession struct {
	Fingerprint string    `gorethink:"fingerprint"`
	Token       string    `gorethink:"token"`
	Created     time.Time `gorethink:"created"`
	LastAuth    time.Time `gorethink:"lastAuth"`
}

type User struct {
	ID        string    `gorethink:"id"         json:"id"           valid:"uuidv4,required"`
	Username  string    `gorethink:"username"   json:"username"     valid:"printableascii,length(3|50),required"`
	Name      string    `gorethink:"name"       json:"name"`
	EMail     string    `gorethink:"email"      json:"email"        valid:"email,length(3|100),required"`
	Enabled   bool      `gorethink:"enabled"    json:"enabled"`
	Created   time.Time `gorethink:"created"    json:"created"`
	LastLogin time.Time `gorethink:"lastLogin"  json:"lastLogin"`
	Groups    []string  `gorethink:"groups"     json:"groups"`

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

	return nil
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
		EMail:    email,
		Enabled:  true,
		Created:  time.Now(),
	}

	// Validate the struct
	err := u.Validate()
	if err != nil {
		return nil, err
	}

	// Prepare the password.
	if len(password) < 8 {
		return nil, fmt.Errorf("password is too short: minimum 8 characters")
	}

	u.PasswordHash, err = hashPassword(password)
	if err != nil {
		return nil, err
	}

	return u, nil
}

// GetUserByUsername obtains a user by its username.
// Returns a ErrNotFound error if the user does not exists.
func GetUserByUsername(username string) (*User, error) {
	if len(username) == 0 {
		return nil, fmt.Errorf("failed to get user: username is empty")
	}

	rows, err := r.Table(dbTableUsers).GetAllByIndex(dbTableUsersUsernameIndex, username).Run(db.Session)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by username '%s': %v", username, err)
	}

	var u User
	err = rows.One(&u)
	if err != nil {
		// Check if nothing was found.
		if err == r.ErrEmptyResult {
			return nil, ErrNotFound
		}

		return nil, fmt.Errorf("failed to get user by username '%s': %v", username, err)
	}

	return &u, nil
}

// GetUser obtains a user by its ID.
// Returns a ErrNotFound error if the user does not exists.
func GetUser(id string) (*User, error) {
	if len(id) == 0 {
		return nil, fmt.Errorf("failed to get user: ID is empty")
	}

	rows, err := r.Table(dbTableUsers).Get(id).Run(db.Session)
	if err != nil {
		return nil, fmt.Errorf("failed to get user by ID '%s': %v", id, err)
	}

	var u User
	err = rows.One(&u)
	if err != nil {
		// Check if nothing was found.
		if err == r.ErrEmptyResult {
			return nil, ErrNotFound
		}

		return nil, fmt.Errorf("failed to get user by ID '%s': %v", id, err)
	}

	return &u, nil
}

// AddUser adds a new user to the database.
// Returns ErrUsernameAlreadyExists if the username already exists.
func AddUser(u *User) error {
	// Validate the struct
	err := u.Validate()
	if err != nil {
		return err
	}

	// Check if a previous user with the same username exists.
	cu, err := GetUserByUsername(u.Username)
	if err != nil && err != ErrNotFound {
		return err
	} else if cu != nil {
		return ErrUsernameAlreadyExists
	}

	// Insert the user to the database.
	_, err = r.Table(dbTableUsers).Insert(u).RunWrite(db.Session)
	if err != nil {
		return fmt.Errorf("failed to insert new user '%s' to database: %v", u.Username, err)
	}

	return nil
}

// UpdateUser updates a user in the database.
// The user value replaces the document stored in the database.
func UpdateUser(u *User) error {
	// Validate the struct
	err := u.Validate()
	if err != nil {
		return err
	}

	// Update the user.
	_, err = r.Table(dbTableUsers).Replace(u).RunWrite(db.Session)
	if err != nil {
		return fmt.Errorf("failed to update user '%s' in database: %v", u.Username, err)
	}

	return nil
}