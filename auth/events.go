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

package auth

import (
	"github.com/desertbit/bitmonster/log"

	"github.com/chuckpreslar/emission"
)

//#################//
//### Constants ###//
//#################//

const (
	emitterMaxListeners = 50

	emitterOnNewUser    = "onNewUser"
	emitterOnDeleteUser = "onDeleteUser"
)

//#################//
//### Variables ###//
//#################//

var (
	emitter *emission.Emitter
)

//##############//
//### Types ####//
//##############//

type OnNewUserFunc func(user *User)
type OnDeleteUserFunc func(user *User)

//###############//
//### Public ####//
//###############//

// OnNewUser triggers the event function if an user was added by the
// current BitMonster server instance. To listen for all database change events
// of all running instances, use the changefeeds package.
func OnNewUser(f OnNewUserFunc) {
	emitter.On(emitterOnNewUser, f)
}

// OffNewUser unbinds the event function again.
func OffNewUser(f OnNewUserFunc) {
	emitter.Off(emitterOnNewUser, f)
}

// OnDeleteUser triggers the event function if an user was deleted by the
// current BitMonster server instance. To listen for all database change events
// of all running instances, use the changefeeds package.
func OnDeleteUser(f OnDeleteUserFunc) {
	emitter.On(emitterOnDeleteUser, f)
}

// OffDeleteUser unbinds the event function again.
func OffDeleteUser(f OnDeleteUserFunc) {
	emitter.Off(emitterOnDeleteUser, f)
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
	log.L.Errorf("emitter event: %v: listener: %v: %v", event, listener, err)
}
