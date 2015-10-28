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

package bitmonster

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestNewModule(t *testing.T) {
	m, err := NewModule("")
	require.NotNil(t, err)
	require.Nil(t, m)

	m, err = NewModule("test")
	require.Nil(t, err)
	require.NotNil(t, m)

	m, err = NewModule("test")
	require.NotNil(t, err)
	require.Nil(t, m)
}

type TestHook struct{}

func (h *TestHook) Hook(*Context) error {
	return nil
}

func TestModuleMethods(t *testing.T) {
	// Create a new module.
	m, err := NewModule("test2")
	require.Nil(t, err)
	require.NotNil(t, m)

	// Module Name:
	// ############
	require.Equal(t, m.Name(), "test2")

	// Module AddMethod:
	// #################
	initErrors = initErrors[:0] // Reset

	m.AddMethod("method", func(*Context) error { return nil })
	require.Len(t, initErrors, 0)

	m.AddMethod("method", func(*Context) error { return nil })
	require.Len(t, initErrors, 1)

	m.AddMethod("method1", func(*Context) error { return nil }, &TestHook{})
	require.Len(t, initErrors, 1)

	m.AddMethod("method2", func(*Context) error { return nil }, &TestHook{}, &TestHook{}, &TestHook{})
	require.Len(t, initErrors, 1)
}
