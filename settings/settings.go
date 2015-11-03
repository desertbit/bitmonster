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

// Package settings handles the BitMonster settings.
package settings

import (
	"fmt"
	"time"

	"github.com/desertbit/bitmonster/log"

	"github.com/BurntSushi/toml"
	"github.com/kelseyhightower/envconfig"
)

const (
	ENVPrefix = "BM"

	// The socket types
	SocketTypeTCP  = "tcp"
	SocketTypeUnix = "unix"
)

var (
	// Create the initial settings value with default values.
	Settings = settings{
		AutoCatchInterrupts: true,

		ListenAddress: ":9000",
		SocketType:    SocketTypeTCP,

		DBAddress: "localhost:28015",
		DBName:    "test",
		DBAuthKey: "",
		DBMaxIdle: 50,
		DBMaxOpen: 50,
		DBTimeout: time.Minute,
	}
)

//############//
//### Type ###//
//############//

type FileServer map[string]string

//#####################//
//### Settings type ###//
//#####################//

type settings struct {
	AutoCatchInterrupts bool

	// The listen address for the server.
	ListenAddress string `envconfig:"LISTEN_ADDRESS"`

	// TCP or UNIX socket.
	SocketType string `envconfig:"SOCKET_TYPE"`

	// Serve the files in the specified paths.
	// key: url
	// value: path
	FileServer FileServer

	// Database settings.
	DBAddress   string        `envconfig:"DB_ADDRESS"`
	DBAddresses []string      `envconfig:"DB_ADDRESSES"`
	DBName      string        `envconfig:"DB_NAME"`
	DBAuthKey   string        `envconfig:"DB_AUTH_KEY"`
	DBMaxIdle   int           `envconfig:"DB_MAX_IDLE"`
	DBMaxOpen   int           `envconfig:"DB_MAX_OPEN"`
	DBTimeout   time.Duration `envconfig:"DB_TIMEOUT"`
}

//##############//
//### Public ###//
//##############//

// LoadFromENV loads the settings from the environment variables.
func LoadFromENV() error {
	log.L.Infof("Loading settings from environment variables.")

	// Load the settings from the environment variables.
	err := envconfig.Process(ENVPrefix, &Settings)
	if err != nil {
		return fmt.Errorf("failed to load settings from environment variables: %v", err)
	}

	return nil
}

// Load the settings from a settings file.
func Load(path string) error {
	log.L.Infof("Loading settings from file: '%s'", path)

	// Parse the configuration
	_, err := toml.DecodeFile(path, &Settings)
	if err != nil {
		return fmt.Errorf("failed to parse settings file '%s': %v", path, err)
	}

	return nil
}
