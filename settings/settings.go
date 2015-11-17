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

const (
	// Default authentication keys:
	defaultAuthHashKey  = "R7DqYdgWlztQ06diRM4z7ByuDwfiAveJLxTwAEDHFvgjkA4CcPrWBhZk6FJIBuDs"
	defaultAuthBlockKey = "2Mox41MlNDHOzShGfiO6AMQ3isx5hz9r"
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

		AuthHashKey:       defaultAuthHashKey,
		AuthBlockKey:      defaultAuthBlockKey,
		AuthSessionMaxAge: 60 * 60 * 24 * 14, // 14 Days
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

	// Whenever this application is accessible through a secure HTTPs connection.
	// This flag affects some important security mechanisms, as settings the secure flag on cookies.
	SecureHTTPSAccess bool

	// The allowed origins of the connecting sockets.
	// If empty, then the host in the Origin header must not be set or
	// must match the host of the request.
	AllowOrigin []string

	// Database settings:
	DBAddress   string        `envconfig:"DB_ADDRESS"`
	DBAddresses []string      `envconfig:"DB_ADDRESSES"`
	DBName      string        `envconfig:"DB_NAME"`
	DBAuthKey   string        `envconfig:"DB_AUTH_KEY"`
	DBMaxIdle   int           `envconfig:"DB_MAX_IDLE"`
	DBMaxOpen   int           `envconfig:"DB_MAX_OPEN"`
	DBTimeout   time.Duration `envconfig:"DB_TIMEOUT"`

	// Authentication settings:
	// The AuthHashKey is used to authenticate the authentication data value using HMAC.
	// It is recommended to use a key with 32 or 64 bytes.
	AuthHashKey string
	// The AuthBlockKey is used to encrypt the authenticate data.
	// The length must correspond to the block size of the encryption algorithm.
	// For AES, used by default, valid lengths are 16, 24, or 32 bytes to select AES-128, AES-192, or AES-256.
	AuthBlockKey string
	// The maximum authenticated session age in seconds.
	AuthSessionMaxAge int
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

// Prepare the settings and validate them.
func Prepare() error {
	// Check if the length of the auth keys are valid.
	l := len([]byte(Settings.AuthHashKey))
	if l != 32 && l != 64 {
		return fmt.Errorf("settings: the authentication hash key has an invalid length of %v bytes! Valid lengths are 32 or 64 bytes...", l)
	}
	l = len([]byte(Settings.AuthBlockKey))
	if l != 16 && l != 24 && l != 32 {
		return fmt.Errorf("settings: the authentication block key has an invalid length of %v bytes! For AES, used by default, valid lengths are 16, 24, or 32 bytes to select AES-128, AES-192, or AES-256.", l)
	}

	// Print a warning if the default authentication keys are set.
	if Settings.AuthHashKey == defaultAuthHashKey {
		log.L.Warning("[WARNING] settings: the default authentication hash key is set! You should replace this with a secret key!")
	}
	if Settings.AuthBlockKey == defaultAuthBlockKey {
		log.L.Warning("[WARNING] settings: the default authentication block key is set! You should replace this with a secret key!")
	}

	// Print a warning if the SecureHTTPSAccess flag is false.
	if !Settings.SecureHTTPSAccess {
		log.L.Warning("[WARNING] settings: the secure https access flag is false! You should provide a secure https access!")
	}

	return nil
}
