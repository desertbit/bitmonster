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

// Package bitmonster - A Monster handling your Bits
package bitmonster

import (
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"sync"
	"syscall"

	"github.com/desertbit/bitmonster/db"
	"github.com/desertbit/bitmonster/log"
	"github.com/desertbit/bitmonster/settings"

	"github.com/desertbit/glue"
)

//################//
//### Contants ###//
//################//

const (
	// InterruptExitCode is the application error exit code.
	InterruptExitCode = 5

	// Private
	// #######
	socketHandleURL = "/bitmonster/"
)

//#################//
//### Variables ###//
//#################//

var (
	isShuttdingDown bool
	releaseMutex    sync.Mutex

	// The glue socket server instance.
	server *glue.Server
)

//##############//
//### Public ###//
//##############//

// Fatal logs the error and exits the application if
// the passed error is not nil.
func Fatal(err error) {
	if err == nil {
		return
	}

	log.L.Fatalln(err)
}

// Init initializes the BitMonster runtime and connects to the database.
func Init() error {
	// Load the settings from the environment variables.
	err := settings.LoadFromENV()
	if err != nil {
		return err
	}

	// Parse the flags.
	var paramSettingsPath string
	flag.StringVar(&paramSettingsPath, "s", paramSettingsPath, "load a bitmonster settings file.")
	flag.Parse()

	// Load the settings file if a path is passed.
	if len(paramSettingsPath) > 0 {
		err = settings.Load(paramSettingsPath)
		if err != nil {
			return err
		}
	}

	// Catch interrupt signals.
	if settings.Settings.AutoCatchInterrupts {
		go func() {
			// Wait for the signal.
			sigchan := make(chan os.Signal, 10)
			signal.Notify(sigchan, os.Interrupt, os.Kill, syscall.SIGTERM, syscall.SIGKILL)
			<-sigchan

			log.L.Info("Exiting...")

			// First cleanup
			release()

			// Exit the application
			os.Exit(InterruptExitCode)
		}()
	}

	// Create the glue options.
	glueOpts := glue.Options{
		HTTPListenAddress: settings.Settings.ListenAddress,
		HTTPHandleURL:     socketHandleURL,
	}

	// Set the socket type.
	if settings.Settings.SocketType == settings.SocketTypeTCP {
		glueOpts.HTTPSocketType = glue.HTTPSocketTypeTCP
	} else if settings.Settings.SocketType == settings.SocketTypeUnix {
		glueOpts.HTTPSocketType = glue.HTTPSocketTypeUnix
	} else {
		return fmt.Errorf("settings: invalid socket type: %v", settings.Settings.SocketType)
	}

	// Create the glue server.
	server = glue.NewServer(glueOpts)

	// Set the event function to handle new incoming socket connections.
	server.OnNewSocket(onNewSocket)

	// Connect to the database.
	if err = db.Connect(); err != nil {
		return err
	}

	return nil
}

// Run starts the BitMonster server.
// This method is blocking.
func Run() error {
	var err error

	// Just check if the init method was skipped.
	if server == nil {
		log.L.Fatalln("BitMonster is not initialized!")
	}

	// Check if initialization errors occurred.
	if hasInitErrors() {
		// Log the errors and abort.
		logInitErrors()
		return fmt.Errorf("initialization errors occurred")
	}

	log.L.Infoln("BitMonster Server running.")

	// Cleanup on return.
	defer release()

	// Setup the fileservers if paths are defined in the settings.
	for url, dir := range settings.Settings.FileServer {
		// Get the absolute path.
		dir, err = filepath.Abs(dir)
		if err != nil {
			return fmt.Errorf("failed to obtain absolute file server path '%s': %v", dir, err)
		}

		// Set the fileserver.
		http.Handle(url, http.StripPrefix(url, http.FileServer(http.Dir(dir))))
	}

	// Start the glue server. This will start the HTTP server.
	err = server.Run()
	if err != nil {
		return fmt.Errorf("Server: %v", err)
	}

	return nil
}

//###############//
//### Private ###//
//###############//

func release() {
	// Lock the mutex.
	releaseMutex.Lock()
	defer releaseMutex.Unlock()

	// Check if already released.
	if isShuttdingDown {
		return
	}

	// Set the flag.
	isShuttdingDown = true

	// Block all new incomming connections and
	// close all current connected sockets by releasing the server.
	if server != nil {
		server.Release()
	}

	// Close the database session.
	db.Close()
}
