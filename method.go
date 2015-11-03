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

	"github.com/desertbit/bitmonster/log"
	"github.com/desertbit/bitmonster/utils"

	"github.com/Sirupsen/logrus"
)

//####################//
//### Method Type ####//
//####################//

// A Method is a module method.
// If an error is returned, the error callback on the client side is triggered.
type Method func(*Context) error

//######################//
//### Private Types ####//
//######################//

type methodContext struct {
	method Method
	hooks  []Hook
}

func newMethodContext(method Method, hooks []Hook) *methodContext {
	return &methodContext{
		method: method,
		hooks:  hooks,
	}
}

type callOpts struct {
	Module string `json:"module"`
	Method string `json:"method"`

	// Optional:
	CallbackID      string `json:"callbackID"`      // If not set, then no callbacks are defined.
	CallbackSuccess bool   `json:"callbackSuccess"` // If true, then the success callback is defined.
	CallbackError   bool   `json:"callbackError"`   // If true, then the error callback is defined.
}

//###############//
//### Private ###//
//###############//

func handleCallRequest(s *Socket, data string) {
	// Predefine the options to trigger the error callback on panics.
	var opts *callOpts

	// Catch all panics and log the error.
	defer func() {
		if e := recover(); e != nil {
			log.L.WithFields(logrus.Fields{
				"remoteAddress": s.RemoteAddr(),
				"data":          data,
			}).Errorf("panic: request: module method call: %v", e)

			// Trigger the error callback on the client-side if possible.
			if opts != nil {
				// Call the error callback with a nil error (unknown).
				triggerErrorCallback(s, opts, nil)
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
		}).Warningf("client request: invalid module method call: empty request options")
		return
	}

	// Unmarshal the options JSON.
	opts = new(callOpts)
	err = json.Unmarshal([]byte(optsJSON), opts)
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
		}).Warningf("client request: invalid module method call: missing option fields")
		return
	}

	// Get the module by the name.
	m, ok := modules[opts.Module]
	if !ok {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: invalid module method call: module does not exists")
		return
	}

	// Get the module method context by the method name.
	mc, ok := m.methods[opts.Method]
	if !ok {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: invalid module method call: module method does not exists")
		return
	}

	// Create a new context value.
	context := newContext(s, m, dataJSON)

	// Call the hooks first.
	for _, hook := range mc.hooks {
		// Trigger the hook.
		err = hook.Hook(context)
		if err != nil {
			log.L.WithFields(logrus.Fields{
				"remoteAddress": s.RemoteAddr(),
				"module":        opts.Module,
				"method":        opts.Method,
			}).Warningf("client request: module method call: hook error: %v", err)

			// Trigger the error callback on the client-side.
			triggerErrorCallback(s, opts, context.err)
			return
		}

		// Trigger the error callback on the client-side if an error was set by the hook function.
		if context.HasError() {
			triggerErrorCallback(s, opts, context.err)
			return
		}
	}

	// Call the module function with the context.
	err = mc.method(context)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"module":        opts.Module,
			"method":        opts.Method,
		}).Warningf("client request: module method call: error: %v", err)

		// Trigger the error callback on the client-side.
		triggerErrorCallback(s, opts, context.err)
		return
	}

	// Trigger the error callback on the client-side if an error was set by the module function.
	if context.HasError() {
		triggerErrorCallback(s, opts, context.err)
		return
	}

	// Finally trigger the success callback on the client-side.
	triggerSuccessCallback(s, opts, context.data)
}

// This method does not return an error.
// Instead errors are logged.
func triggerSuccessCallback(s *Socket, opts *callOpts, methodData interface{}) {
	// Skip if no callback ID is set.
	if len(opts.CallbackID) == 0 {
		return
	}

	// Just cleanup the callback hooks on the client-side if no
	// success callback is defined on the client-side.
	if !opts.CallbackSuccess {
		triggerCleanupCallback(s, opts)
		return
	}

	// Create the JSON object.
	data := struct {
		CallbackID string      `json:"callbackID"`
		Type       string      `json:"type"`
		Data       interface{} `json:"data"`
	}{
		CallbackID: opts.CallbackID,
		Type:       "success",
		Data:       methodData,
	}

	// Marshal to JSON.
	dataJSON, err := json.Marshal(&data)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: module method call: failed to trigger success callback: %v", err)

		return
	}

	// Send the trigger request to the client.
	s.chanCall.Write(string(dataJSON))
}

// This method does not return an error.
// Instead errors are logged.
func triggerErrorCallback(s *Socket, opts *callOpts, cbErr error) {
	// Skip if no callback ID is set.
	if len(opts.CallbackID) == 0 {
		return
	}

	// Just cleanup the callback hooks on the client-side if no
	// error callback is defined on the client-side.
	if !opts.CallbackError {
		triggerCleanupCallback(s, opts)
		return
	}

	// Create the JSON object.
	data := struct {
		CallbackID string `json:"callbackID"`
		Type       string `json:"type"`
		Message    string `json:"message"`
	}{
		CallbackID: opts.CallbackID,
		Type:       "error",
	}

	// Set the error message if present.
	if cbErr != nil {
		data.Message = cbErr.Error()
	}

	// Marshal to JSON.
	dataJSON, err := json.Marshal(&data)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: module method call: failed to trigger error callback: %v", err)

		return
	}

	// Send the trigger request to the client.
	s.chanCall.Write(string(dataJSON))
}

// This method does not return an error.
// Instead errors are logged.
func triggerCleanupCallback(s *Socket, opts *callOpts) {
	// Skip if no callback ID is set.
	if len(opts.CallbackID) == 0 {
		return
	}

	// Create the JSON object.
	data := struct {
		CallbackID string `json:"callbackID"`
		Type       string `json:"type"`
	}{
		CallbackID: opts.CallbackID,
		Type:       "cleanup",
	}

	// Marshal to JSON.
	dataJSON, err := json.Marshal(&data)
	if err != nil {
		log.L.WithFields(logrus.Fields{
			"remoteAddress": s.RemoteAddr(),
			"options":       opts,
		}).Warningf("client request: module method call: failed to trigger cleanup callback: %v", err)

		return
	}

	// Send the trigger request to the client.
	s.chanCall.Write(string(dataJSON))
}
