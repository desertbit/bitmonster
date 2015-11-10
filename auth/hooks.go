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
)

//##############//
//### Public ###//
//##############//

// MustGroup returns a BitMonster Hook which requires an authenticated
// user who is member of one of the passed groups.
func MustGroup(groups ...string) bitmonster.Hook {
	h := &hook{
		groups: groups,
	}

	return h
}

// MustAdminGroup returns a BitMonster Hook which requires an authenticated
// user who is member of the admin group.
func MustAdminGroup() bitmonster.Hook {
	return mustGroupAdminHook
}

//######################//
//### Private - Hook ###//
//######################//

type hook struct {
	groups []string
}

func (h *hook) Hook(c *bitmonster.Context) error {
	// TODO
	if !IsAuth(c.Socket()) {
		return fmt.Errorf("not auth!")
	}

	return nil
}
