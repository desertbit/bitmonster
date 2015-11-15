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

	"github.com/desertbit/bitmonster"
)

var (
	mustGroupAdminHook = MustGroup(AdminGroup)
	mustIsAuth         = new(isAuthHook)
)

//##############//
//### Public ###//
//##############//

// MustIsAuth returns a BitMonster Hook which requires an authenticated
// user session.
func MustIsAuth() bitmonster.Hook {
	return mustIsAuth
}

// MustAdminGroup returns a BitMonster Hook which requires an authenticated
// user who is member of the admin group.
func MustAdminGroup() bitmonster.Hook {
	return mustGroupAdminHook
}

// MustGroup returns a BitMonster Hook which requires an authenticated
// user who is member of one of the passed groups.
func MustGroup(groups ...string) bitmonster.Hook {
	h := &groupHook{
		groups: groups,
	}

	return h
}

//######################//
//### Private - Hook ###//
//######################//

type groupHook struct {
	groups []string
}

func (h *groupHook) Hook(c *bitmonster.Context) error {
	// Obtain the current user.
	// Enable the cache. This hook might be called many times...
	user, err := CurrentUser(c.Socket(), true)
	if err != nil {
		return err
	}

	// Check if the user is in one of the groups.
	for _, g := range h.groups {
		for _, ug := range user.Groups {
			if g == ug {
				// Return because the user is at least in one group.
				return nil
			}
		}
	}

	return fmt.Errorf("socket session is not authorized: not member of required group(s)")
}

type isAuthHook struct {
}

func (h *isAuthHook) Hook(c *bitmonster.Context) error {
	if !IsAuth(c.Socket()) {
		return fmt.Errorf("socket session is not authorized")
	}

	return nil
}
