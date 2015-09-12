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
	"fmt"

	"github.com/desertbit/glue"
)

//####################//
//### Conext Type ####//
//####################//

// A Context contains the function call context with the passed parameters
// and the registered callbacks.
type Context struct {
	c        *glue.Channel
	dataJSON string

	successData interface{} // Set if the Success method is called.
	err         error       // Set if the Error method is called.

	// Optional:
	callbackID      string // If not set, then no callbacks are defined.
	callbackSuccess bool   // If true, then the success callback is defined.
	callbackError   bool   // If true, then the error callback is defined.
}

// Decode the context data to a custom value.
// The value has to be passed as pointer.
func (c *Context) Decode(v interface{}) error {
	// Check if the data JSON string is empty.
	if len(c.dataJSON) == 0 {
		return fmt.Errorf("no context data available to decode")
	}

	// Unmarshal the data JSON.
	err := json.Unmarshal([]byte(c.dataJSON), v)
	if err != nil {
		return fmt.Errorf("json unmarshal: %v", err)
	}

	return nil
}

// Success sets the success data which is passed to the client.
func (c *Context) Success(d interface{}) {
	c.successData = d
}

// Error sets the error message which is passed to the error callback.
// Once called, the error callback will always be called on the client-side if it is defined.
func (c *Context) Error(msg string) {
	c.err = fmt.Errorf(msg)
}

//###############################//
//### Private Conext Methods ####//
//###############################//

func (c *Context) hasError() bool {
	return c.err != nil
}

func (c *Context) triggerSuccessCallback() error {
	// Skip if no callback ID is set.
	if len(c.callbackID) == 0 {
		return nil
	}

	// Just cleanup the callback hooks on the client-side if no
	// success callback is defined on the client-side.
	if !c.callbackSuccess {
		return c.triggerCleanupCallback()
	}

	// Create the JSON object.
	data := struct {
		CallbackID string      `json:"callbackID"`
		Type       string      `json:"type"`
		Data       interface{} `json:"data"`
	}{
		CallbackID: c.callbackID,
		Type:       "success",
		Data:       c.successData,
	}

	// Marshal to JSON.
	dataJSON, err := json.Marshal(&data)
	if err != nil {
		return err
	}

	// Send the trigger request to the client.
	c.c.Write(string(dataJSON))

	return nil
}

func (c *Context) triggerErrorCallback() error {
	// Skip if no callback ID is set.
	if len(c.callbackID) == 0 {
		return nil
	}

	// Just cleanup the callback hooks on the client-side if no
	// error callback is defined on the client-side.
	if !c.callbackError {
		return c.triggerCleanupCallback()
	}

	// Create the JSON object.
	data := struct {
		CallbackID string `json:"callbackID"`
		Type       string `json:"type"`
		Message    string `json:"message"`
	}{
		CallbackID: c.callbackID,
		Type:       "error",
	}

	// Set the error message if present.
	if c.err != nil {
		data.Message = c.err.Error()
	}

	// Marshal to JSON.
	dataJSON, err := json.Marshal(&data)
	if err != nil {
		return err
	}

	// Send the trigger request to the client.
	c.c.Write(string(dataJSON))

	return nil
}

func (c *Context) triggerCleanupCallback() error {
	// Skip if no callback ID is set.
	if len(c.callbackID) == 0 {
		return nil
	}

	// Create the JSON object.
	data := struct {
		CallbackID string `json:"callbackID"`
		Type       string `json:"type"`
	}{
		CallbackID: c.callbackID,
		Type:       "cleanup",
	}

	// Marshal to JSON.
	dataJSON, err := json.Marshal(&data)
	if err != nil {
		return err
	}

	// Send the trigger request to the client.
	c.c.Write(string(dataJSON))

	return nil
}
