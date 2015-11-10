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
	"time"

	"github.com/desertbit/bitmonster"
)

//#################//
//### Constants ###//
//#################//

const (
	clearCacheInterval      = 3 * time.Second
	cacheUserSocketValueKey = "authCachedUser"
)

//###############//
//### Private ###//
//###############//

// clearCache clears all cached values of the socket.
func clearCache(s *bitmonster.Socket) {
	s.DeleteValue(cacheUserSocketValueKey)
}

// getCachedCurrentUser returns the current cached user value or nil.
func getCachedCurrentUser(s *bitmonster.Socket) *User {
	// Obtain the user from the cache if present.
	userI := s.Value(cacheUserSocketValueKey)
	if userI == nil {
		return nil
	}

	// Assertion.
	user, ok := userI.(*User)
	if !ok {
		return nil
	}

	return user
}

func setCachedCurrentUser(s *bitmonster.Socket, user *User) {
	// Set the socket value.
	s.SetValue(cacheUserSocketValueKey, user)

	// Remove the cached value after the timeout.
	s.DeleteValueAfterTimeout(cacheUserSocketValueKey, clearCacheInterval)
}
