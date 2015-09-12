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

// In this sample frontend and backend are combined into one application.

package main

import (
	"fmt"

	"github.com/desertbit/bitmonster"
	"github.com/desertbit/bitmonster/settings"
)

func main() {
	// Add the custom fileserver paths.
	settings.Settings.FileServer = settings.FileServer{
		"/":      "public",
		"/dist/": "../client/dist",
	}

	// Initialize BitMonster.
	bitmonster.Fatal(bitmonster.Init())

	bitmonster.Add("users", bitmonster.Module{
		"get": getUsers,

		"delete": bitmonster.Hook{
			Hook: func() bool,
			// or
			Hook: func(c* Context), // With c.Abort() ?
			Func: ...,
		}

		// Interfae{} to type ModuleItem ?

		"custom": auth.Auth(auth.AuthOpts {
			Groups: ...,
			Func: ...,
			}),

		"add": bitmonster.Auth {
			Groups: bitmonster.Groups{
				auth.
			},
			Func:
		},

		"onDelete": bitmonster.Event{},
		"onNew": bitmonster.Event{
			Init: func(releaseChan),
			Release: func(),
			BindHook: func(instance),
			TriggerHook: func(),
		},
	})

call module.init() after adding and pass module name.
Context.Header?
	MethodContext?

// Get the event.
	module.Event("onNew").Trigger(data)
	context.Module().Event("onNew").Trigger()
	context.Event("onNew").Trigger()

	// Start the BitMonster server.
	bitmonster.Fatal(bitmonster.Run())
}

func getUsers(c *bitmonster.Context) error {
	println("getUsers")

	v := struct {
		Foo string
		Bar string
	}{}

	// TODO: catch error.
	c.Decode(&v)

	fmt.Printf("%+v\n", v)

	c.Success(&v)
	c.Error("error message")

	return fmt.Errorf("Hallo")
}
