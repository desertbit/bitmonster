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
	"encoding/json"
	"fmt"
)

//####################//
//### Conext Type ####//
//####################//

// A Context contains the function call context with the passed parameters
// and the registered callbacks.
type Context struct {
	// A map to hold custom data values.
	// Commonly used by hooks.
	Values map[interface{}]interface{}

	// Private:
	// ########

	socket        *Socket
	module        *Module
	paramDataJSON string

	data interface{} // Set if the Success method is called.
	err  error       // Set if the Error method is called.
}

func newContext(s *Socket, m *Module, paramDataJSON string) *Context {
	return &Context{
		socket:        s,
		module:        m,
		paramDataJSON: paramDataJSON,
	}
}

// Data sets the data value which is passed finally to the client.
func (c *Context) Data(d interface{}) {
	c.data = d
}

// Error sets the error message which is passed to the error callback.
// Once called, the error callback will always be called on the client-side if it is defined.
func (c *Context) Error(msg string) {
	c.err = fmt.Errorf(msg)
}

// HasError returns a boolean whenever the context error was set.
func (c *Context) HasError() bool {
	return c.err != nil
}

// Decode the context data to a custom value.
// The value has to be passed as pointer.
func (c *Context) Decode(v interface{}) error {
	// Check if the data JSON string is empty.
	if len(c.paramDataJSON) == 0 {
		return fmt.Errorf("no context data available to decode")
	}

	// Unmarshal the data JSON.
	err := json.Unmarshal([]byte(c.paramDataJSON), v)
	if err != nil {
		return fmt.Errorf("json unmarshal: %v", err)
	}

	return nil
}

// Module returns the module of the context.
func (c *Context) Module() *Module {
	return c.module
}

// TriggerEvent triggers an event of the module.
// Pass optional one variadic parameter value.
func (c *Context) TriggerEvent(name string, data ...interface{}) error {
	// Get the event.
	e, err := c.module.Event(name)
	if err != nil {
		return err
	}

	// Trigger the event.
	err = e.Trigger(data...)
	if err != nil {
		return err
	}

	return nil
}
