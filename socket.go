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
	"github.com/chuckpreslar/emission"
	"github.com/desertbit/glue"
	"github.com/desertbit/glue/log"
)

//#################//
//### Constants ###//
//#################//

const (
	channelCall  = "call"
	channelEvent = "event"

	emitterMaxListeners  = 30
	emitterOnNewSocket   = "onNewSocket"
	emitterOnCloseSocket = "onCloseSocket"
)

//#################//
//### Variables ###//
//#################//

var (
	emitter *emission.Emitter
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

//##############//
//### Public ###//
//##############//

// OnNewSocket is triggered during each new socket connection.
func OnNewSocket(f OnNewSocketFunc) {
	emitter.On(emitterOnNewSocket, f)
}

// OnceNewSocket triggers the event function only once.
func OnceNewSocket(f OnNewSocketFunc) {
	emitter.Once(emitterOnNewSocket, f)
}

// OffNewSocket remove the event listener again.
func OffNewSocket(f OnNewSocketFunc) {
	emitter.Off(emitterOnNewSocket, f)
}

// OnCloseSocket is triggered if a socket connection is closed.
func OnCloseSocket(f OnNewSocketFunc) {
	emitter.On(emitterOnCloseSocket, f)
}

// OnceCloseSocket triggers the event function only once.
func OnceCloseSocket(f OnNewSocketFunc) {
	emitter.Once(emitterOnCloseSocket, f)
}

// OffCloseSocket remove the event listener again.
func OffCloseSocket(f OnNewSocketFunc) {
	emitter.Off(emitterOnCloseSocket, f)
}

//###############//
//### Private ###//
//###############//

func init() {
	// Create a new emitter, set the recover function and the max listeners.
	emitter = emission.NewEmitter().
		RecoverWith(recoverEmitter).
		SetMaxListeners(emitterMaxListeners)
}

func recoverEmitter(event interface{}, listener interface{}, err error) {
	log.L.Error("emitter event: %v: listener: %v: %v", event, listener, err)
}

// onNewSocket is triggered as soon as a new socket connects.
func onNewSocket(s *glue.Socket) {
	// Create the BitMonster Socket value.
	socket := &Socket{
		socket:    s,
		chanCall:  s.Channel(channelCall),
		chanEvent: s.Channel(channelEvent),
	}

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
