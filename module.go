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
	"fmt"

	"github.com/desertbit/bitmonster/log"
)

var (
	modules = make(map[string]*Module)
)

//####################//
//### Module Type ####//
//####################//

// A Module contains and handles methods and events.
type Module struct {
	name    string
	methods map[string]*methodContext
	events  map[string]*Event
}

// NewModule creates and register a new BitMonster Module.
// This method is not thread-safe and should be called only
// during application initialization.
func NewModule(name string) (*Module, error) {
	// Validate the name.
	if len(name) == 0 {
		return nil, fmt.Errorf("empty module name")
	}

	// Check if a module with the same name exists already.
	if _, ok := modules[name]; ok {
		return nil, fmt.Errorf("a module with the name '%s' exists already", name)
	}

	// Create a new module value.
	m := &Module{
		name:    name,
		methods: make(map[string]*methodContext),
		events:  make(map[string]*Event),
	}

	// Add the module to the modules map.
	modules[name] = m

	return m, nil
}

// Name returns the module's name.
func (m *Module) Name() string {
	return m.name
}

// AddMethod adds a method which is callable from the client-side.
// Optionally pass hooks which are processed before.
// This method is not thread-safe and should be only called during
// module initialization.
func (m *Module) AddMethod(name string, method Method, hooks ...Hook) {
	// Check if the method name already exists.
	if _, ok := m.methods[name]; ok {
		// Log the warning.
		log.L.Warningf("module '%s': method '%s': a method with the name is already registered", m.name, name)
	}

	// Create the method context and set the method and its hooks.
	mc := newMethodContext(method, hooks)

	// Add it to the methods map.
	m.methods[name] = mc
}

// AddEvent adds and registers a new event.
// The newly created event is returned.
func (m *Module) AddEvent(name string, hooks ...Hook) *Event {
	// Check if the event name already exists.
	if _, ok := m.events[name]; ok {
		// Log the warning.
		log.L.Warningf("module '%s': event '%s': an event with the name is already registered", m.name, name)
	}

	// Create a new event.
	event := newEvent(name, hooks)

	// Add it to the events map.
	m.events[name] = event

	return event
}

// Event returns the event specified by the name.
func (m *Module) Event(name string) (*Event, error) {
	// Try to obtain the event.
	e, ok := m.events[name]
	if !ok {
		return nil, fmt.Errorf("the event with the name '%s' does not exists", name)
	}

	return e, nil
}
