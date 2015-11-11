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

// Package changefeeds provides the database change events for the auth package.
package changefeeds

import (
	"fmt"
	"time"

	"github.com/desertbit/bitmonster"
	"github.com/desertbit/bitmonster/auth"
	"github.com/desertbit/bitmonster/db"
	"github.com/desertbit/bitmonster/log"

	"github.com/chuckpreslar/emission"

	r "github.com/dancannon/gorethink"
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

type OnNewUserFunc func(user *auth.User)
type OnDeleteUserFunc func(user *auth.User)

//###############//
//### Public ####//
//###############//

// OnNewUser triggers the event function if an user was added.
func OnNewUser(f OnNewUserFunc) {
	emitter.On(emitterOnNewUser, f)
}

// OffNewUser unbinds the event function again.
func OffNewUser(f OnNewUserFunc) {
	emitter.Off(emitterOnNewUser, f)
}

// OnDeleteUser triggers the event function if an user was deleted.
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

	// Start the event loops on init.
	bitmonster.OnInit(func() {
		go listenForUserChangesLoop()
	})
}

func recoverEmitter(event interface{}, listener interface{}, err error) {
	log.L.Errorf("emitter event: %v: listener: %v: %v", event, listener, err)
}

func listenForUserChangesLoop() {
	// TODO: improvement: implement gracefully shutdown with the bitmonster.CloseChan
	for {
		// Listen for the changes.
		err := listenForUserChanges()
		if err != nil {
			log.L.Errorf("database users change feed query stopped: %v", err)
		}

		// Short timeout.
		time.Sleep(time.Second)

		log.L.Info("restarting database users change feed query")
	}
}

func listenForUserChanges() error {
	// Make a query for the change feed.
	opts := r.ChangesOpts{
		// When multiple changes to the same document occur before a batch of
		// notifications is sent, the changes are “squashed” into one change.
		// The client receives a notification that will bring it fully up to date with the server.
		Squash: true,
	}
	res, err := r.Table(auth.DBTableUsers).Changes(opts).Run(db.Session)
	if err != nil {
		return err
	}

	value := struct {
		OldVal *auth.User `gorethink:"old_val"`
		NewVal *auth.User `gorethink:"new_val"`
	}{}

	// Wait for changes.
	for res.Next(&value) {
		// Skip changes. We only listen for new and remove events.
		if value.OldVal != nil && value.NewVal != nil {
			continue
		}

		if value.NewVal != nil {
			// New user.
			emitter.Emit(emitterOnNewUser, value.NewVal)
		} else if value.OldVal != nil {
			// Deleted user.
			emitter.Emit(emitterOnDeleteUser, value.OldVal)
		}
	}

	// Something went wrong.
	err = res.Err()
	if err != nil {
		return err
	}

	return fmt.Errorf("change feed query stopped without an error")
}
