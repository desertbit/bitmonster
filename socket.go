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
	"github.com/desertbit/glue"
)

//#################//
//### Constants ###//
//#################//

const (
	channelCall = "call"
)

//###############//
//### Private ###//
//###############//

// onNewSocket is triggered as soon as a new socket connects.
func onNewSocket(s *glue.Socket) {
	// Set the function which is triggered as soon as the socket is closed.
	s.OnClose(func() {
		onCloseSocket(s)
	})

	// We won't read any data from the socket itself.
	// Discard the received data!
	s.DiscardRead()

	// Create and prepare the call channel.
	c := s.Channel(channelCall)
	c.OnRead(func(data string) {
		// Trigger the call request.
		callRequest(s, c, data)
	})
}

// onCloseSocket is triggered as soon as a socket connection is closed.
func onCloseSocket(s *glue.Socket) {

}
