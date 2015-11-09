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
	// Session is the database session.
	Session *r.Session
)

//##############//
//### Public ###//
//##############//

// Connect to the database.
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

// Prepare the database before using it.
// This will create or migrate the database if required.
// Registered managers are called within this call.
func Prepare() error {
	err := prepareDatabase()
	if err != nil {
		return fmt.Errorf("failed to prepare database: %v", err)
	}

	return nil
}

// Close the database.
func Close() {
	if Session == nil {
		return
	}

	err := Session.Close()
	if err != nil {
		log.L.Warningf("error while closing database session: %v", err)
	}
}

//#################################//
//### Public - Helper Functions ###//
//#################################//

func CreateTableIfNotExists(table string) error {
	// Check if the table exists.
	cur, err := r.TableList().Run(Session)
	if err != nil {
		return err
	}
	defer cur.Close()

	tableName := ""
	for cur.Next(&tableName) {
		if tableName == table {
			return nil
		}
	}

	return CreateTable(table)
}

func CreateTables(tables ...string) error {
	var err error
	for _, t := range tables {
		if err = CreateTable(t); err != nil {
			return err
		}
	}

	return nil
}

func CreateTable(table string) error {
	// Create the table.
	log.L.Infof("Database: creating table %s", table)
	_, err := r.TableCreate(table).RunWrite(Session)
	if err != nil {
		return err
	}

	return nil
}

//##################################//
//### Private - Helper Functions ###//
//##################################//

func createDatabaseIfNotExists(name string) error {
	// Check if the database exists.
	cur, err := r.DBList().Run(Session)
	if err != nil {
		return err
	}

	dbName := ""
	for cur.Next(&dbName) {
		if dbName == name {
			return nil
		}
	}

	// Create the database.
	log.L.Infof("Database: creating database %s", name)
	_, err = r.DBCreate(name).RunWrite(Session)
	if err != nil {
		return err
	}

	return nil
}
