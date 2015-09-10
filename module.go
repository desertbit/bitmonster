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
	"encoding/json"

	"github.com/Sirupsen/logrus"
	"github.com/desertbit/bitmonster/log"
	"github.com/desertbit/glue"
	"github.com/desertbit/glue/utils"
)

var (
	modules = make(map[string]Module)
)

//#####################//
//### Public Types ####//
//#####################//

// A ModuleFunc is a module function.
// If an error is returned, the error callback on the client side is triggered.
type ModuleFunc func(*Context) error

// A Module is composed of functions.
type Module map[string]ModuleFunc

//######################//
//### Private Types ####//
//######################//

type callOpts struct {
	Module string `json:"module"`
	Method string `json:"method"`

	// Optional:
	CallbackID      string `json:"callbackID"`      // If not set, then no callbacks are defined.
	CallbackSuccess bool   `json:"callbackSuccess"` // If true, then the success callback is defined.
	CallbackError   bool   `json:"callbackError"`   // If true, then the error callback is defined.
}

//##############//
//### Public ###//
//##############//

// Add a new BitMonster module.
// This method is not thread-safe and should be called only
// during application initialization.
func Add(name string, module Module) {
	// Validate the name.
	if len(name) == 0 {
		log.L.Errorf("add module: empty module name!")
		return
	}

	// Check if a module with the same name exists already.
	if _, ok := modules[name]; ok {
		log.L.Errorf("add module: a module with the name '%s' exists already!", name)
		return
	}

	// Add the module to the modules map.
	modules[name] = module
}

//###############//
//### Private ###//
//###############//

func callRequest(s *glue.Socket, c *glue.Channel, data string) {
	// Predefine the context to trigger the error callback on panics.
	var context *Context

	// Catch all panics and log the error.
	defer func() {
		if e := recover(); e != nil {
			log.L.WithFields(logrus.Fields{
				"remoteAddress": s.RemoteAddr(),
				"data":          data,
			}).Errorf("panic: request: module method call: %v", e)

			// Trigger the error callback on the client-side if possible.
			if context != nil {
				context.Error("")              // Empty the error message first.
				context.triggerErrorCallback() // Ingore the returned error...
			}
		}
	}()

	// Split the options JSON from the data JSON.
	optsJSON, dataJSON, err := utils.UnmarshalValues(data)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"data":          data,
		}).Warningf("client request: invalid module method call: %v", err)
		return
	}

	// Check if empty.
	if len(optsJSON) == 0 {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
		}).Warningf("client request: invalid module method call: empty module options.")
		return
	}

	// Unmarshal the options JSON.
	var opts callOpts
	err = json.Unmarshal([]byte(optsJSON), &opts)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"json":          optsJSON,
		}).Warningf("client request: invalid module method call: json unmarshal: %v", err)
		return
	}

	// Validate for required option fields.
	if len(opts.Module) == 0 || len(opts.Method) == 0 {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: invalid module method call: missing option fields.")
		return
	}

	// Get the module by the name.
	m, ok := modules[opts.Module]
	if !ok {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: invalid module method call: module does not exists.")
		return
	}

	// Get the module method by the function name.
	f, ok := m[opts.Method]
	if !ok {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: invalid module method call: module method does not exists.")
		return
	}

	// Create a new context value.
	context = &Context{
		c:               c,
		dataJSON:        dataJSON,
		callbackID:      opts.CallbackID,
		callbackSuccess: opts.CallbackSuccess,
		callbackError:   opts.CallbackError,
	}

	// Call the module function with the context.
	err = f(context)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"module":        opts.Module,
			"method":        opts.Method,
		}).Warningf("client request: module method call: error: %v", err)

		// Trigger the error callback on the client-side.
		err = context.triggerErrorCallback()
		if err != nil {
			log.L.Warningf("client request: module method call: failed to trigger error callback: %v", err)
		}

		return
	}

	// Trigger the error callback on the client-side if an error was set by the module function.
	if context.hasError() {
		err = context.triggerErrorCallback()
		if err != nil {
			log.L.WithFields(logrus.Fields{
				"remoteAddress": s.RemoteAddr(),
				"options":       opts,
			}).Warningf("client request: module method call: failed to trigger error callback: %v", err)
		}
		return
	}

	// Finally trigger the success callback on the client-side.
	err = context.triggerSuccessCallback()
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: module method call: failed to trigger success callback: %v", err)
	}
}
