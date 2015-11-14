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
	"testing"

	"github.com/stretchr/testify/require"
)

func TestUserPasswords(t *testing.T) {
	u, err := NewUser("foo", "bar", "foo@bar.at", "short")
	require.NotNil(t, err)
	require.Nil(t, u)

	u, err = NewUser("foo", "bar", "foo@bar.at", "secretpassword")
	require.Nil(t, err)
	require.NotNil(t, u)

	match := u.ComparePasswords("secretpassword")
	require.True(t, match)

	match = u.ComparePasswords("secretpasswort")
	require.False(t, match)

	match = u.ComparePasswords("")
	require.False(t, match)

	err = u.ChangePassword("afdiubaefp9wef")
	require.Nil(t, err)

	match = u.ComparePasswords("afdiubaefp9wef")
	require.True(t, match)
}

func TestUserGroups(t *testing.T) {
	err := RegisterGroup("a")
	require.Nil(t, err)

	err = RegisterGroup("b")
	require.Nil(t, err)

	err = RegisterGroup("c")
	require.Nil(t, err)

	u, err := NewUser("foo", "bar", "foo@bar.at", "secretpassword")
	require.Nil(t, err)
	require.NotNil(t, u)

	u.AddGroup("a", "a", "a", "b", "c", "b")
	require.Len(t, u.Groups, 3)

	u.RemoveGroup("a", "b")
	require.Len(t, u.Groups, 1)

	u.Groups = append(u.Groups, "a", "a", "b", "b", "b")
	require.Len(t, u.Groups, 6)

	u.RemoveGroup("a", "b")
	require.Len(t, u.Groups, 1)
}
