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

const (
	dbTableManagers = "bitmonster_db_managers"
)

var (
	managers = make(map[string]Manager)
)

//#########################//
//### Manager interface ###//
//#########################//

// A Manager interface manages the parts of the database initializaton and migration.
type Manager interface {
	// ID has to return a constant unique ID. This is used for identification.
	// This value should never be changed and should match module names if possible.
	ID() string

	// Version should return the current implemented version.
	Version() *Version

	// Create is called to initialize the database.
	Create() error

	// Mirgate is called during each migration. The database version is passed.
	Migrate(dbVer *Version) error
}

// AddManager adds a database manager.
// This method should only be called in an init() function.
func AddManager(m Manager) {
	id := m.ID()

	// Check if a manager exists already with the same ID.
	if _, ok := managers[id]; ok {
		log.L.Fatalf("A BitMonster manager with the ID '%s' is already registered", id)
	}

	managers[id] = m
}

//###############//
//### Private ###//
//###############//

// dbManager is the type which is saved in the database.
type dbManager struct {
	ID    string `gorethink:"id"`
	Major int    `gorethink:"major"`
	Minor int    `gorethink:"minor"`
	Patch int    `gorethink:"patch"`
}

func prepareDatabase() (err error) {
	// Catch all panics and return the error.
	defer func() {
		if e := recover(); e != nil {
			err = fmt.Errorf("panic: prepare database: %v", e)
		}
	}()

	// Create the database if it does not exists.
	err = createDatabaseIfNotExists(settings.Settings.DBName)
	if err != nil {
		return err
	}

	// Create the managers table if it does not exists.
	err = CreateTableIfNotExists(dbTableManagers)
	if err != nil {
		return err
	}

	// Get all managers saved in the database.
	// Execute the query.
	cur, err := r.Table(dbTableManagers).Run(Session)
	if err != nil {
		return err
	}

	var dbManagers []*dbManager
	err = cur.All(&dbManagers)
	if err != nil {
		return err
	}

	// Go through all managers and compare it with the database manager.
ManagersLoop:
	for id, m := range managers {
		// Check if the manager was already created.
		for _, dbM := range dbManagers {
			if dbM.ID == id {
				curVer := m.Version()
				dbVer := NewVersion(dbM.Major, dbM.Minor, dbM.Patch)

				// The manager was already created.
				// Check if the versions have changed.
				if dbVer.IsEqual(curVer) {
					// Continue with the next manager.
					continue ManagersLoop
				}

				// Call the manager's migrate method and start the migration.
				log.L.Infof("Database: migrating database for %s", id)
				err = m.Migrate(dbVer)
				if err != nil {
					return err
				}

				// Update to the new version on a successful migration.
				dbM.Major = curVer.major
				dbM.Minor = curVer.minor
				dbM.Patch = curVer.patch
				_, err := r.Table(dbTableManagers).Get(id).Update(dbM).RunWrite(Session)
				if err != nil {
					return err
				}

				// Continue with the next manager.
				continue ManagersLoop
			}
		}

		// The manager was not created. Create it.
		log.L.Infof("Database: preparing database for %s", id)
		err = m.Create()
		if err != nil {
			return err
		}

		// Get the current version.
		curVer := m.Version()

		// Add the current manager version to the database on success.
		dbM := dbManager{
			ID:    id,
			Major: curVer.major,
			Minor: curVer.minor,
			Patch: curVer.patch,
		}

		_, err := r.Table(dbTableManagers).Insert(dbM).RunWrite(Session)
		if err != nil {
			return err
		}
	}

	return nil
}
