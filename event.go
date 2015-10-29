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
	"time"

	"github.com/Sirupsen/logrus"
	"github.com/desertbit/glue/log"
)

const (
	eventListenerTriggerChanSize = 5
	eventListenerTriggerTimeout  = 3 * time.Second
)

//###################//
//### Event Type ####//
//###################//

// An Event implements a single BitMonster event to trigger attached listeners.
type Event struct {
	name  string
	hooks []Hook

	listeners      map[string]*eventListener
	listenersMutex sync.Mutex
}

func newEvent(name string, hooks []Hook) *Event {
	return &Event{
		name:      name,
		hooks:     hooks,
		listeners: make(map[string]*eventListener),
	}
}

// Name returns the event name.
func (e *Event) Name() string {
	return e.name
}

// Trigger the event and pass optional one variadic parameter value.
func (e *Event) Trigger(data ...interface{}) error {
	var dataJSON string

	// Check if a data parameter was passed.
	if len(data) > 0 {
		// Marshal the data to JSON.
		dataJSONBytes, err := json.Marshal(data[0])
		if err != nil {
			return fmt.Errorf("failed to marshal event trigger data to JSON: %v", err)
		}

		dataJSON = string(dataJSONBytes)
	}

	// Lock the listeners mutex.
	e.listenersMutex.Lock()
	defer e.listenersMutex.Unlock()

	// Trigger all the event listeners.
	for _, l := range e.listeners {
		l.Trigger(dataJSON)
	}

	return nil
}

// TriggerSocket triggers the event only for the specified socket.
// Pass optional one variadic parameter value.
func (e *Event) TriggerSocket(socket *Socket, data ...interface{}) error {
	return e.TriggerSockets([]*Socket{socket}, data...)
}

// TriggerSockets triggers the event only for the specified sockets.
// Pass optional one variadic parameter value.
func (e *Event) TriggerSockets(sockets []*Socket, data ...interface{}) error {
	var dataJSON string

	// Check if a data parameter was passed.
	if len(data) > 0 {
		// Marshal the data to JSON.
		dataJSONBytes, err := json.Marshal(data[0])
		if err != nil {
			return fmt.Errorf("failed to marshal event trigger data to JSON: %v", err)
		}

		dataJSON = string(dataJSONBytes)
	}

	// Lock the listeners mutex.
	e.listenersMutex.Lock()
	defer e.listenersMutex.Unlock()

	// Trigger the event listeners for the specified sockets.
	for _, s := range sockets {
		// Get the listener by the socket ID.
		l, ok := e.listeners[s.ID()]
		if !ok {
			// Ignore the error if no listeners are registered for the socket.
			continue
		}

		// Trigger the event listener.
		l.Trigger(dataJSON)
	}

	return nil
}

// addListener adds an event listeners to the event's listener map.
func (e *Event) addListener(l *eventListener, key string) {
	// Lock the mutex.
	e.listenersMutex.Lock()
	defer e.listenersMutex.Unlock()

	// Add the listener to the map.
	e.listeners[key] = l
}

// removeListener removes an event listener with its unique key.
func (e *Event) removeListener(key string) {
	l := func() *eventListener {
		// Lock the mutex.
		e.listenersMutex.Lock()
		defer e.listenersMutex.Unlock()

		// Get the listener.
		l, ok := e.listeners[key]
		if !ok {
			// Does not exists.
			return nil
		}

		// Remove the listener from the map.
		delete(e.listeners, key)

		return l
	}()

	// Return if no listener was found by the key.
	if l == nil {
		return
	}

	// Close the listener.
	l.Close()
}

//######################//
//### Private Types ####//
//######################//

const (
	eventOptsTypeOn  = "on"
	eventOptsTypeOff = "off"
)

type eventOpts struct {
	Type   string `json:"type"`
	Module string `json:"module"`
	Event  string `json:"event"`
}

//#####################################//
//### Private - eventListener Type ####//
//#####################################//

type eventListener struct {
	triggerChan chan string // Marshalled data as string.

	closedChan chan struct{}
	isClosed   bool
	closeMutex sync.Mutex
}

func newEventListener() *eventListener {
	return &eventListener{
		triggerChan: make(chan string, eventListenerTriggerChanSize),
		closedChan:  make(chan struct{}),
	}
}

// Trigger the event in a non-blocking manner.
func (l *eventListener) Trigger(data string) {
	// Don't block if the channel is full.
	select {
	case l.triggerChan <- data:
		// Job done. Just return.
		return

	default:
		// The channel is full and blocking. Retry in a new goroutine with a timeout.
		go func() {
			timeout := time.NewTimer(eventListenerTriggerTimeout)
			defer timeout.Stop()

			select {
			case <-timeout.C:
				log.L.Warningf("trigger event: channel buffer is full: timeout reached")
				return
			case l.triggerChan <- data:
				return
			}
		}()
	}
}

func (l *eventListener) Close() {
	// Lock the mutex.
	l.closeMutex.Lock()
	defer l.closeMutex.Unlock()

	// Return if already closed.
	if l.isClosed {
		return
	}

	// Set the flag.
	l.isClosed = true

	// Close the channel.
	close(l.closedChan)
}

//###############//
//### Private ###//
//###############//

func handleEventRequest(s *Socket, data string) {
	// Catch all panics and log the error.
	defer func() {
		if e := recover(); e != nil {
			log.L.WithFields(logrus.Fields{
				"remoteAddress": s.RemoteAddr(),
				"data":          data,
			}).Errorf("panic: request: module event: %v", e)
		}
	}()

	// Check if empty.
	if len(data) == 0 {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
		}).Warningf("client request: bind module event: empty request options")
		return
	}

	// Unmarshal the options JSON.
	var opts eventOpts
	err := json.Unmarshal([]byte(data), &opts)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"json":          data,
		}).Warningf("client request: bind module event: json unmarshal: %v", err)
		return
	}

	// Validate for required option fields.
	if len(opts.Module) == 0 || len(opts.Event) == 0 {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: bind module event: missing option fields")
		return
	}

	// Get the module by the name.
	m, ok := modules[opts.Module]
	if !ok {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: bind module event: module does not exists")
		return
	}

	// Get the module event by the event name.
	event, ok := m.events[opts.Event]
	if !ok {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: bind module event: module event does not exists")
		return
	}

	// Create the event listener's key.
	// This is just the socket ID.
	// A socket should only bind one listener for one event.
	key := s.ID()

	// Check if an event unbind is requested.
	if opts.Type == eventOptsTypeOff {
		// Remove the event listener with its unique key.
		event.removeListener(key)
		return
	} else if opts.Type != eventOptsTypeOn {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: bind module event: unknown options type")
		return
	}

	// Create a new context value.
	context := newContext(s, m, "")

	// Call the hooks first.
	for _, hook := range event.hooks {
		// Trigger the hook.
		err = hook.Hook(context)
		if err != nil {
			log.L.WithFields(logrus.Fields{
				"remoteAddress": s.RemoteAddr(),
				"module":        opts.Module,
				"event":         opts.Event,
			}).Warningf("client request: bind module event: hook error: %v", err)

			return
		}

		// Trigger the error callback on the client-side if an error was set by the hook function.
		if context.HasError() {
			log.L.WithFields(logrus.Fields{
				"remoteAddress": s.RemoteAddr(),
				"module":        opts.Module,
				"event":         opts.Event,
			}).Warningf("client request: bind module event: hook error: %v", context.err)

			return
		}
	}

	// Create a new event listener.
	l := newEventListener()

	// Add it to the event.
	event.addListener(l, key)

	// Start a new goroutine to handle event trigger requests.
	// Also handle closed sockets.
	go func() {
		for {
			select {
			case <-l.closedChan:
				// Just exit this goroutine.
				return

			case <-s.ClosedChan():
				event.removeListener(key)
				return

			case eventData := <-l.triggerChan:
				triggerEventCallback(s, &opts, eventData)
			}
		}
	}()
}

// This method does not return an error.
// Instead errors are logged.
func triggerEventCallback(s *Socket, opts *eventOpts, eventDataJSON string) {
	// Create the JSON object.
	data := struct {
		Type   string `json:"type"`
		Module string `json:"module"`
		Event  string `json:"event"`
		Data   string `json:"data"`
	}{
		Type:   "trigger",
		Module: opts.Module,
		Event:  opts.Event,
		Data:   eventDataJSON,
	}

	// Marshal to JSON.
	dataJSON, err := json.Marshal(&data)
	if err != nil {
		// Just log the error and continue.
		log.L.WithFields(logrus.Fields{
			"module": opts.Module,
			"event":  opts.Event,
		}).Warningf("trigger event: failed to marshal event data to JSON: %v", err)

		return
	}

	// Send the trigger request to the client.
	s.chanEvent.Write(string(dataJSON))
}
