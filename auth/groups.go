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

const (
	// AdminGroup is the administration group.
	AdminGroup = "admin"
)

var (
	groups []string
)

//##############//
//### Public ###//
//##############//

// RegisterGroup registers a new group.
// This method should only be called during the initialization process.
func RegisterGroup(name string) error {
	// Check if already present.
	for _, g := range groups {
		if g == name {
			return fmt.Errorf("group '%s' already registered", name)
		}
	}

	// Add the group to the slice.
	groups = append(groups, name)

	return nil
}

//###############//
//### Private ###//
//###############//

func init() {
	// Register the admin group.
	bitmonster.Fatal(RegisterGroup(AdminGroup))
}

// validGroups checks if the groups are valid.
func validGroups(g ...string) bool {
Loop:
	for _, ug := range g {
		for _, g := range groups {
			if g == ug {
				continue Loop
			}
		}

		return false
	}

	return true
}
