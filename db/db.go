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

package db

import (
	"fmt"

	"github.com/desertbit/bitmonster/log"
	"github.com/desertbit/bitmonster/settings"

	r "github.com/dancannon/gorethink"
)

var (
	Session *r.Session
)

//##############//
//### Public ###//
//##############//

func Connect() (err error) {
	// Connext to the database server.
	Session, err = r.Connect(r.ConnectOpts{
		Address:   settings.Settings.DBAddress,
		Addresses: settings.Settings.DBAddresses,
		Database:  settings.Settings.DBName,
		MaxIdle:   settings.Settings.DBMaxIdle,
		MaxOpen:   settings.Settings.DBMaxOpen,
		Timeout:   settings.Settings.DBTimeout,
		AuthKey:   settings.Settings.DBAuthKey,

		// When DiscoverHosts is true any nodes are added to the cluster after
		// the initial connection then the new node will be added to the pool of
		// available nodes used by GoRethink. Unfortunately the canonical address
		// of each server in the cluster MUST be set as otherwise clients will
		// try to connect to the database nodes locally. For more information
		// about how to set a RethinkDB servers canonical address set
		// this page http://www.rethinkdb.com/docs/config-file/.
		DiscoverHosts: true,
	})
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	return nil
}

func Close() {
	if Session == nil {
		return
	}

	err := Session.Close()
	if err != nil {
		log.L.Warningf("error while closing database session: %v", err)
	}
}
