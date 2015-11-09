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
	"fmt"

	"golang.org/x/crypto/bcrypt"

	"github.com/desertbit/bitmonster"
)

//#################//
//### Constants ###//
//#################//

const (
	authSocketValueKey = "auth"
)

//#####################//
//### Private Types ###//
//#####################//

type authSocketValue struct {
	isAuth         bool
	authSessionKey string
	userID         string
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

// AuthUser returns the authenticated user of the socket or nil.
func AuthUser(s *bitmonster.Socket) (*User, error) {
	// Get the current socket value.
	av := getAuthSocketValue(s)
	if av == nil {
		return nil, fmt.Errorf("failed to obtain auth socket value")
	}

	if !av.isAuth {
		return nil, nil
	}

	// Obtain the user by the ID.
	user, err := GetUser(av.userID)
	if err != nil {
		return nil, err
	}

	return user, nil
}

//###############//
//### Private ###//
//###############//

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

// TODO//#####################################################################################
/*
const (
	httpHandleURL = "/bitmonster/auth"

	authRequestTimeout   = 10 * time.Second
	authRequestKeyLength = 30
)

var (
	authRequestMap      = make(map[string]*authRequest)
	authRequestMapMutex sync.Mutex
)

//#####################//
//### Private Types ###//
//#####################//

type authRequest struct {
	socketID        string
	stopTimeoutChan chan struct{}
}

//###############//
//### Private ###//
//###############//

func init() {
	// Register the HTTP handler.
	http.HandleFunc(httpHandleURL, handleAuthRequest)
}

// newAuthRequest creates a new authentication request and returns the access key.
func newAuthRequest(s *bitmonster.Socket) (key string) {
	ar := &authRequest{
		socketID:        s.ID(),
		stopTimeoutChan: make(chan struct{}),
	}

	func() {
		// Lock the mutex.
		authRequestMapMutex.Lock()
		defer authRequestMapMutex.Unlock()

		// Create a unique key.
		key = utils.RandomString(authRequestKeyLength)
		for {
			if _, ok := authRequestMap[key]; !ok {
				break
			}
			key = utils.RandomString(authRequestKeyLength)
		}

		// Add to map.
		authRequestMap[key] = ar
	}()

	// Start the timeout goroutine.
	go func() {
		// Create a timeout timer.
		timeout := time.NewTimer(authRequestTimeout)
		defer timeout.Stop()

		// Wait for it.
		select {
		case <-ar.stopTimeoutChan:
			// Just release this goroutine.
			return

		case <-timeout.C:
			// Lock the mutex.
			authRequestMapMutex.Lock()
			defer authRequestMapMutex.Unlock()

			// Remove again from map.
			delete(authRequestMap, key)
		}
	}()

	return key
}

// getAuthRequestSocket obtains the socket specified by the access key.
// Returns nil if not found.
func getAuthRequestSocket(key string) *bitmonster.Socket {
	socketID := func() string {
		// Lock the mutex.
		authRequestMapMutex.Lock()
		defer authRequestMapMutex.Unlock()

		// Obtain the socket ID.
		ar, ok := authRequestMap[key]
		if !ok {
			return ""
		}

		// Stop the timeout.
		close(ar.stopTimeoutChan)

		// Remove again from map.
		delete(authRequestMap, key)

		return ar.socketID
	}()

	if len(socketID) == 0 {
		return nil
	}

	// Obtain the socket with its ID.
	s := bitmonster.GetSocket(socketID)

	return s
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
