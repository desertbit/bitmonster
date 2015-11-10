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
	"sync"
	"time"

	"github.com/chuckpreslar/emission"
	"github.com/desertbit/glue"
)

//#################//
//### Constants ###//
//#################//

const (
	channelCall  = "call"
	channelEvent = "event"

	emitterOnNewSocket   = "onNewSocket"
	emitterOnCloseSocket = "onCloseSocket"
	emitterOnCheck       = "onCheck"
)

//####################//
//### Public Types ###//
//####################//

// ClosedChan is a channel which doesn't block as soon as the socket is closed.
type ClosedChan <-chan struct{}

// OnCloseSocketFunc is an event function.
type OnCloseSocketFunc func(s *Socket)

// OnNewSocketFunc is an event function.
type OnNewSocketFunc func(s *Socket)

//###################//
//### Socket Type ###//
//###################//

// A Socket is a BitMonster socket.
type Socket struct {
	socket    *glue.Socket
	chanCall  *glue.Channel
	chanEvent *glue.Channel

	emitter *emission.Emitter

	values      map[interface{}]interface{}
	valuesMutex sync.Mutex
}

// ID returns the socket's unique ID.
// This ID is a totally random.
func (s *Socket) ID() string {
	return s.socket.ID()
}

// RemoteAddr returns the remote address of the client.
func (s *Socket) RemoteAddr() string {
	return s.socket.RemoteAddr()
}

// UserAgent returns the user agent of the client.
func (s *Socket) UserAgent() string {
	return s.socket.UserAgent()
}

// Close the socket connection.
func (s *Socket) Close() {
	s.socket.Close()
}

// IsClosed returns a boolean whenever the connection is closed.
func (s *Socket) IsClosed() bool {
	return s.socket.IsClosed()
}

// OnClose sets the functions which is triggered if the socket connection is closed.
func (s *Socket) OnClose(f OnCloseSocketFunc) {
	s.emitter.On(emitterOnCloseSocket, f)
}

// OffClose removea the event listener again.
func (s *Socket) OffClose(f OnNewSocketFunc) {
	s.emitter.Off(emitterOnCloseSocket, f)
}

// ClosedChan returns a channel which is non-blocking (closed)
// as soon as the socket is closed.
func (s *Socket) ClosedChan() ClosedChan {
	return ClosedChan(s.socket.ClosedChan())
}

// Check triggeres an internal check routine.
// Event hooks of already bound events are rerun.
// Trigger this, if an important state of the socket session has changed
// and event hooks should be rerun. (Example: logout)
func (s *Socket) Check() {
	s.emitter.Emit(emitterOnCheck)
}

// Value returns a custom value previously set by the key.
// Returns nil if it does not exists.
// One variadic function is called if no value exists for the given key.
// The return value of this function is the new value for the key.
// This operation is thread-safe.
func (s *Socket) Value(key interface{}, f ...func() interface{}) interface{} {
	// Lock the mutex.
	s.valuesMutex.Lock()
	defer s.valuesMutex.Unlock()

	// Get the value.
	v, ok := s.values[key]
	if !ok {
		// If no value is found and the create function
		// is set, then call the function and set the new value.
		if len(f) > 0 {
			v := f[0]()
			s.values[key] = v
			return v
		}

		return nil
	}

	return v
}

// SetValue sets a custom value with a key.
func (s *Socket) SetValue(key interface{}, value interface{}) {
	// Lock the mutex.
	s.valuesMutex.Lock()
	defer s.valuesMutex.Unlock()

	// Set the value.
	s.values[key] = value
}

// DeleteValue removes a custom value with a key.
func (s *Socket) DeleteValue(key interface{}) {
	// Lock the mutex.
	s.valuesMutex.Lock()
	defer s.valuesMutex.Unlock()

	// Remove the value.
	delete(s.values, key)
}

// DeleteValueAfterTimeout removes a custom value after the specified timeout.
func (s *Socket) DeleteValueAfterTimeout(key interface{}, timeout time.Duration) {
	time.AfterFunc(timeout, func() {
		s.DeleteValue(key)
	})
}

//##############//
//### Public ###//
//##############//

// GetSocket obtains the socket by its ID.
// Returns nil if not found.
func GetSocket(id string) *Socket {
	// Get the glue socket from the glue server.
	gs := server.GetSocket(id)
	if gs == nil {
		return nil
	}

	// Get the BitMonster socket which is saved in the glue socket value.
	s, ok := gs.Value.(*Socket)
	if !ok {
		return nil
	}

	return s
}

// OnNewSocket is triggered during each new socket connection.
func OnNewSocket(f OnNewSocketFunc) {
	emitter.On(emitterOnNewSocket, f)
}

// OffNewSocket remove the event listener again.
func OffNewSocket(f OnNewSocketFunc) {
	emitter.Off(emitterOnNewSocket, f)
}

// OnCloseSocket is triggered if a socket connection is closed.
func OnCloseSocket(f OnNewSocketFunc) {
	emitter.On(emitterOnCloseSocket, f)
}

// OffCloseSocket remove the event listener again.
func OffCloseSocket(f OnNewSocketFunc) {
	emitter.Off(emitterOnCloseSocket, f)
}

//###############//
//### Private ###//
//###############//

// onNewSocket is triggered as soon as a new socket connects.
func onNewSocket(s *glue.Socket) {
	// Create the BitMonster Socket value.
	socket := &Socket{
		socket:    s,
		chanCall:  s.Channel(channelCall),
		chanEvent: s.Channel(channelEvent),
		values:    make(map[interface{}]interface{}),
	}

	// Save itself to the glue Value.
	s.Value = socket

	// Set the emitter.
	// Create a new emitter, set the recover function and the max listeners.
	socket.emitter = emission.NewEmitter().
		RecoverWith(recoverEmitter).
		SetMaxListeners(emitterMaxListeners)

	// We won't read any data from the socket itself.
	// Discard the received data!
	s.DiscardRead()

	// Set the function which is triggered as soon as the socket is closed.
	s.OnClose(func() {
		onCloseSocket(socket)
	})

	// Prepare the call channel.
	socket.chanCall.OnRead(func(data string) {
		// Trigger the call request.
		handleCallRequest(socket, data)
	})

	// Prepare the event channel.
	socket.chanEvent.OnRead(func(data string) {
		// Trigger the event request.
		handleEventRequest(socket, data)
	})

	// Trigger the event.
	emitter.Emit(emitterOnNewSocket, socket)
}

// onCloseSocket is triggered as soon as a socket connection is closed.
func onCloseSocket(s *Socket) {
	// Trigger the socket event.
	s.emitter.Emit(emitterOnCloseSocket, s)

	// Trigger the global event.
	emitter.Emit(emitterOnCloseSocket, s)
}
