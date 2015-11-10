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
	"sync"
)

//####################//
//### Conext Type ####//
//####################//

// A Context contains the function call context with the passed parameters
// and the registered callbacks.
type Context struct {
	socket        *Socket
	module        *Module
	paramDataJSON string

	// A map to hold custom data values.
	// Commonly used by hooks.
	values      map[interface{}]interface{}
	valuesMutex sync.Mutex

	data interface{} // Set if the Success method is called.
	err  error       // Set if the Error method is called.
}

func newContext(s *Socket, m *Module, paramDataJSON string) *Context {
	return &Context{
		socket:        s,
		module:        m,
		paramDataJSON: paramDataJSON,
		values:        make(map[interface{}]interface{}),
	}
}

// Socket returns the socket of the context.
func (c *Context) Socket() *Socket {
	return c.socket
}

// Module returns the module of the context.
func (c *Context) Module() *Module {
	return c.module
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

// Value returns a custom value previously set by the key.
// Returns nil if it does not exists.
// One variadic function is called if no value exists for the given key.
// The return value of this function is the new value for the key.
// This operation is thread-safe.
func (c *Context) Value(key interface{}, f ...func() interface{}) interface{} {
	// Lock the mutex.
	c.valuesMutex.Lock()
	defer c.valuesMutex.Unlock()

	// Get the value.
	v, ok := c.values[key]
	if !ok {
		// If no value is found and the create function
		// is set, then call the function and set the new value.
		if len(f) > 0 {
			v := f[0]()
			c.values[key] = v
			return v
		}

		return nil
	}

	return v
}

// SetValue sets a custom value with a key.
// This operation is thread-safe.
func (c *Context) SetValue(key interface{}, value interface{}) {
	// Lock the mutex.
	c.valuesMutex.Lock()
	defer c.valuesMutex.Unlock()

	// Set the value.
	c.values[key] = value
}

// DeleteValue removes a custom value with a key.
// This operation is thread-safe.
func (c *Context) DeleteValue(key interface{}) {
	// Lock the mutex.
	c.valuesMutex.Lock()
	defer c.valuesMutex.Unlock()

	// Remove the value.
	delete(c.values, key)
}

// ClearValues clears all values from the custom values map.
// This operation is thread-safe.
func (c *Context) ClearValues() {
	// Lock the mutex.
	c.valuesMutex.Lock()
	defer c.valuesMutex.Unlock()

	// Clear the complete map.
	c.values = make(map[interface{}]interface{})
}
