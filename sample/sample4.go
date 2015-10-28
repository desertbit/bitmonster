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

/*
import (
	"fmt"

	"github.com/desertbit/bitmonster"
	"github.com/desertbit/bitmonster/settings"
)

// TODO Implement:
// - Transmit a header on each request. Obtain it through the context ( context.Header(key) ):
// - Implement an Event type which automatically handles triggering with hooks.
// - Change module fields to interface -> but use a custom type (type ModuleItem interface{}).
// - ? Move the current Context type implementation to a MethodContext type?
// - ? Implement a new Context type which is passed to Module hooks,...
// - ? Implement a module.Init() function which is triggered after a successful registration of the module (bitmonster.Add).
// - ? The upper implementation should register and add events to an internal module array.
// - ? This internal registration of module events should add the possibility to bind events also on the Go side.

func main() {
	// Add the custom fileserver paths.
	settings.Settings.FileServer = settings.FileServer{
		"/":      "public",
		"/dist/": "../client/dist",
	}

	// Initialize BitMonster.
	bitmonster.Fatal(bitmonster.Init())

	m, err := bitmonster.NewModule("users")

	m.AddMethod("get", getUsers)

	m.AddMethod("delete", func() bool { return true }, method)
	m.AddMethod("delete", hook1, hook2, ... , method)

	m.AddMethod("custom", auth.Group("admin"), ... , method)

	m.AddEvent("onDelete")
	m.AddEvent("onNew", hook1, hook2, ...)
	m.AddEvent("onNew", {
		hook1,
		hook2,
		}, ...)

	// ? Trigger hooks for events?



	// Get the event.
	module.Event("onNew").Trigger(data)
	context.Module().Event("onNew").Trigger()
	context.Event("onNew").Trigger()

	context.Event("onNew").Listen(func(c *Context, u *auth.User) {

	})


	// Start the BitMonster server.
	bitmonster.Fatal(bitmonster.Run())
}

func getUsers(c *bitmonster.Context) error {
	println("getUsers")

	v := struct {
		Foo string
		Bar string
	}{}

	err := c.Decode(&v)
	if err != nil {
		return err
	}

	fmt.Printf("%+v\n", v)

	c.Success(&v)
	c.Error("error message")

	return nil
}
*/
