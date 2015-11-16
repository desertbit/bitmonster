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
	"encoding/gob"

	"github.com/gorilla/securecookie"

	"github.com/desertbit/bitmonster"
	"github.com/desertbit/bitmonster/settings"
)

//#################//
//### Constants ###//
//#################//

const (
	cookieName = "BMAuthToken"
)

//#################//
//### Variables ###//
//#################//

var (
	// The secure cookie.
	secureCookie *securecookie.SecureCookie
)

//######################//
//### authToken Type ###//
//######################//

type authToken struct {
	UserID string
	Key    string
	Token  string
}

//###############//
//### Private ###//
//###############//

func init() {
	// Register the custom type to gob.
	gob.Register(new(authToken))

	bitmonster.OnInit(func() {
		// Create a new secure cookie object with the cookie keys
		secureCookie = securecookie.New([]byte(settings.Settings.AuthHashKey), []byte(settings.Settings.AuthBlockKey))

		// Set the max age in seconds
		secureCookie.MaxAge(settings.Settings.AuthSessionMaxAge)
	})
}

// newAuthToken creates a new encrypted authentication token.
func newAuthToken(userID, key, token string) (string, error) {
	data := authToken{
		UserID: userID,
		Key:    key,
		Token:  token,
	}

	encoded, err := secureCookie.Encode(cookieName, data)
	if err != nil {
		return "", err
	}

	return encoded, nil
}

// parseAuthToken parses an encrypted authentication token.
func parseAuthToken(encoded string) (userID, key, token string, err error) {
	// Decrypt to the authentication data.
	var data authToken
	err = secureCookie.Decode(cookieName, encoded, &data)
	if err != nil {
		return
	}

	return data.UserID, data.Key, data.Token, nil
}

// newHTTPAuthToken creates a new encrypted HTTP authentication token.
func newHTTPAuthToken(token string) (string, error) {
	encoded, err := secureCookie.Encode(cookieName, token)
	if err != nil {
		return "", err
	}

	return encoded, nil
}

// parseHTTPAuthToken parses an encrypted HTTP authentication token.
func parseHTTPAuthToken(encoded string) (token string, err error) {
	// Decrypt to the authentication data.
	err = secureCookie.Decode(cookieName, encoded, &token)
	if err != nil {
		return
	}

	return token, nil
}
