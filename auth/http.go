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
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/Sirupsen/logrus"

	"github.com/desertbit/bitmonster"
	"github.com/desertbit/bitmonster/log"
	"github.com/desertbit/bitmonster/settings"
	"github.com/desertbit/glue/utils"
)

//#################//
//### Constants ###//
//#################//

const (
	httpHandleAuthURL = "/bitmonster/auth"

	httpSocketValueKey = "authHTTP"

	httpAuthTimeout            = 10 * time.Second
	deleteHTTPAuthValueTimeout = 15 * time.Second
)

//#####################//
//### Private Types ###//
//#####################//

type httpAuthSocketValue struct {
	newTokenChan chan string
	getTokenChan chan string
}

func newHTTPAuthSocketValue() *httpAuthSocketValue {
	return &httpAuthSocketValue{
		newTokenChan: make(chan string, 1),
		getTokenChan: make(chan string, 1),
	}
}

//###############//
//### Private ###//
//###############//

func init() {
	// Register the HTTP handler.
	http.HandleFunc(httpHandleAuthURL, handleHTTPAuthRequest)
}

func handleHTTPAuthRequest(rw http.ResponseWriter, req *http.Request) {
	// Only allow POST requests
	if req.Method != "POST" {
		http.Error(rw, "Bad Request", 400)
		return
	}

	// Get the remote address.
	remoteAddr, _ := utils.RemoteAddress(req)

	// Debug log.
	log.L.WithFields(logrus.Fields{
		"remoteAddress": remoteAddr,
	}).Debugf("auth: HTTP authentication request")

	// Create an inline function for better error handling.
	httpStatusCode, err := func() (int, error) {
		// The data value.
		data := struct {
			Type     string `json:"type"`
			SocketID string `json:"socketID"`
		}{}

		// Decode the JSON to the value.
		decoder := json.NewDecoder(req.Body)
		err := decoder.Decode(&data)
		if err != nil {
			return 400, fmt.Errorf("failed to decode JSON: %v", err)
		}

		// The socket ID has to be valid.
		if len(data.SocketID) == 0 {
			return 400, fmt.Errorf("empty socket ID")
		}

		// Try to obtain the socket by the socket ID.
		s := bitmonster.GetSocket(data.SocketID)
		if s == nil {
			return 400, fmt.Errorf("no socket found with ID: '%s'", data.SocketID)
		}

		// Obtain the HTTP authentication value.
		ha := getHTTPAuthSocketValue(s)
		if ha == nil {
			return 500, fmt.Errorf("failed to obtain HTTP auth socket value")
		}

		// Check the type.
		if data.Type == "login" {
			// Create a timeout timer.
			timeout := time.NewTimer(httpAuthTimeout)
			defer timeout.Stop()

			select {
			case <-timeout.C:
				// Timeout reached. Throw an error.
				return 408, fmt.Errorf("timeout reached")

			case token := <-ha.newTokenChan:
				// Encode the token.
				encodedToken, err := newHTTPAuthToken(token)
				if err != nil {
					return 500, err
				}

				// Create a new session cookie
				cookie := &http.Cookie{
					Name:     cookieName,
					Value:    encodedToken,
					Path:     httpHandleAuthURL,
					HttpOnly: true, // Don't allow scripts to manipulate the cookie.
					MaxAge:   settings.Settings.AuthSessionMaxAge,
					Secure:   settings.Settings.SecureHTTPSAccess, // Only send this cookie over a secure https connection if provided
				}

				// Set the new session cookie
				http.SetCookie(rw, cookie)
			}
		} else if data.Type == "auth" {
			// Get the cookie.
			cookie, err := req.Cookie(cookieName)
			if err != nil {
				return 400, fmt.Errorf("failed to get cookie: %v", err)
			}

			// Get the token from the encrypted cookie value.
			token, err := parseHTTPAuthToken(cookie.Value)
			if err != nil {
				return 400, fmt.Errorf("failed to parse cookie value: %v", err)
			}

			// Write the token to the channel.
			select {
			case ha.getTokenChan <- token:
			default:
				return 500, fmt.Errorf("token channel is full")
			}
		} else {
			return 400, fmt.Errorf("invalid request type: '%s'", data.Type)
		}

		return 200, nil
	}()

	// Write the HTTP status code.
	rw.WriteHeader(httpStatusCode)

	// Handle the error.
	if err != nil {
		// Log.
		log.L.WithFields(logrus.Fields{
			"remoteAddress": remoteAddr,
		}).Warningf("auth: HTTP authentication request failed: %v", err)

		return
	}

	// Debug log.
	log.L.WithFields(logrus.Fields{
		"remoteAddress": remoteAddr,
	}).Debugf("auth: HTTP authentication request: success")
}

// getHTTPAuthSocketValue obtains the HTTP authentication value from the socket.
// If not present, then this function creates the value.
func getHTTPAuthSocketValue(s *bitmonster.Socket) *httpAuthSocketValue {
	// Get or create the value.
	v := s.Value(httpSocketValueKey, func() interface{} {
		// Set a delete timeout.
		s.DeleteValueAfterTimeout(httpSocketValueKey, deleteHTTPAuthValueTimeout)

		// Create it.
		return newHTTPAuthSocketValue()
	})

	// Assert.
	ha, ok := v.(*httpAuthSocketValue)
	if !ok {
		return nil
	}

	return ha
}

func setNewHTTPAuthToken(s *bitmonster.Socket, token string) error {
	// Obtain the HTTP authentication value.
	ha := getHTTPAuthSocketValue(s)
	if ha == nil {
		return fmt.Errorf("failed to obtain HTTP auth socket value")
	}

	select {
	case ha.newTokenChan <- token:
	default:
		return fmt.Errorf("failed to set new HTTP auth socket token: channel is full")
	}

	return nil
}

func getHTTPAuthToken(s *bitmonster.Socket) (string, error) {
	// Obtain the HTTP authentication value.
	ha := getHTTPAuthSocketValue(s)
	if ha == nil {
		return "", fmt.Errorf("failed to obtain HTTP auth socket value")
	}

	// Create a timeout timer.
	timeout := time.NewTimer(httpAuthTimeout)
	defer timeout.Stop()

	select {
	case <-timeout.C:
		// Timeout reached. Throw an error.
		return "", fmt.Errorf("timeout")

	case token := <-ha.getTokenChan:
		return token, nil
	}
}
