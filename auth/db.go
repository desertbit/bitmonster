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
	"github.com/desertbit/bitmonster/db"

	r "github.com/dancannon/gorethink"
)

const (
	DBTableUsers           = "auth_users"
	DBTableUsersEmailIndex = "email"
)

func init() {
	// Register the database manager for this module.
	db.AddManager(new(dbManager))
}

//########################//
//### Database Manager ###//
//########################//

type dbManager struct{}

func (m *dbManager) ID() string {
	return ModuleName
}

func (m *dbManager) Version() *db.Version {
	return db.NewVersion(1, 0, 0)
}

func (m *dbManager) Create() error {
	// Create the table.
	err := db.CreateTable(DBTableUsers)
	if err != nil {
		return err
	}

	return createIndexes()
}

func createIndexes() error {
	// Create a secondary index on the LoginName attribute.
	_, err := r.Table(DBTableUsers).IndexCreate(DBTableUsersEmailIndex).Run(db.Session)
	if err != nil {
		return err
	}

	// Wait for the index to be ready to use.
	_, err = r.Table(DBTableUsers).IndexWait(DBTableUsersEmailIndex).Run(db.Session)
	if err != nil {
		return err
	}

	return nil
}

func (m *dbManager) Migrate(dbVer *db.Version) error {
	return nil
}
