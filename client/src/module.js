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


/*
 *  This code lives inside the BitMonster function.
 */

bm.module = (function() {
    /*
     * Constants
     */

    var callbackIDLength      = 14,
        eventListenerIDLength = 10,
        methodCallTimeout     = 7000; // 7 seconds



    /*
     * Variables
     */

     // Obtain the socket communication channels.
     var callChannel    = socket.channel("call"),
         eventChannel   = socket.channel("event");

     // A map holding all callbacks and events.
     var callbacksMap   = {},
         eventsMap      = {};



     /*
      * Initialization
      */

     // Handle received messages from the call channel.
     callChannel.onMessage(function(data) {
         // Define a method to print error messages.
         var logError = function() {
             console.log("BitMonster: received invalid call request from server.");
         };

         // Parse the JSON to an object.
         data = JSON.parse(data);

         // The callback ID has to be always defined.
         if (!data.callbackID || String(data.callbackID).length === 0) {
             logError();
             return;
         }

         // Obtain the callback object.
         var cb = callbacksMap[data.callbackID];
         if (!cb) {
             logError();
             return;
         }

         // Remove the callback object from the map.
         delete callbacksMap[data.callbackID];

         // Stop the timeout.
         if (cb.timeout) {
             clearTimeout(cb.timeout);
             cb.timeout = false;
         }

         try {
             // Determind the request type and call the callback.
             if (data.type === "cleanup") {
                 // Just return. The callback object was already removed from the map.
                 return;
             }
             else if (data.type === "success" && cb.success) {
                 if (data.data) {
                     cb.success(data.data);
                 } else {
                     cb.success();
                 }
             }
             else if (data.type === "error" && cb.error) {
                 if (data.message) {
                     cb.error(data.message);
                 } else {
                     cb.error();
                 }
             }
             else {
                 logError();
             }
         }
         catch (e) {
             console.log("BitMonster: catched exception while calling callback:");
             console.log(e);
         }
     });

     // Handle received messages from the event channel.
     eventChannel.onMessage(function(data) {
         // Define a method to print error messages.
         var logError = function() {
             console.log("BitMonster: received invalid event request from server.");
         };

         // Parse the JSON to an object.
         data = JSON.parse(data);

         // Check for the required values.
         if (!data.module || !data.event) {
             logError();
             return;
         }

         // Obtain the module events.
         var moduleEvents = eventsMap[data.module];
         if (!moduleEvents) {
             // Don't log the error. The event was unbound.
             return;
         }

         // Get the event object.
         var eventObj = moduleEvents.events[data.event];
         if (!eventObj) {
             // Don't log the error. The event was unbound.
             return;
         }

         // Determind the event type.
         if (data.type === "trigger") {
             // Parse the JSON data value if present.
             var eventData;
             if (data.data) {
                 eventData = JSON.parse(data.data);
             }

             // Create a shallow copy to allow mutations inside the iteration.
             var listeners = jQuery.extend({}, eventObj.listeners);

             // Trigger the listeners bound to this event.
             $.each(listeners, function(id, l) {
                 try {
                     l.callback(eventData);
                 }
                 catch (e) {
                     console.log("BitMonster: catched exception while triggering event:");
                     console.log(e);
                 }
             });
         }
         else {
             logError();
         }
     });



    /*
     * Private
     */

    // call a module method on the server-side.
    var callMethod = function(module, method) {
        var params          = false,
            successCallback = false,
            errorCallback   = false;

        // Define a method to print error messages.
        var logError = function() {
            console.log("BitMonster: invalid method call: module='" + module + "' method='" + method + "'");
        };

        // The method name has to be defined.
        if (!method) {
            logError();
            return false;
        }

        // Parse the function arguments.
        for (var i = 2; i < arguments.length; i++) {
            var arg = arguments[i];

            // Check if this argument is the parameter object.
            if (arg !== null && typeof arg === 'object') {
                // Check if already set.
                if (params !== false) {
                    logError();
                    return false;
                }

                // Set the parameter object.
                params = arg;
            }
            // Check if this argument is a callback function.
            else if ($.isFunction(arg)) {
                // Set the success callback if not already set.
                if (successCallback === false) {
                    successCallback = arg;
                }
                // Set the error callback if not already set.
                else if (errorCallback === false) {
                    errorCallback = arg;
                }
                // Too many functions passed to this method. Handle the error.
                else {
                    logError();
                    return false;
                }
            }
            // Handle unknown types.
            else {
                logError();
                return false;
            }
        }

        // Marshal the parameter object to JSON.
        if (params) {
            params = JSON.stringify(params);
        } else {
            // Just set an empty string.
            params = "";
        }

        // Create the call options.
        var opts = {
            module: module,
            method: method
        };

        // Register the callbacks if defined.
        if (successCallback !== false || errorCallback !== false) {
            // Create a random callbacks ID and check if it does not exist already.
            var callbackID;
            while(true) {
                callbackID = utils.randomString(callbackIDLength);
                if (!callbacksMap[callbackID]) {
                    break;
                }
            }

            // Create a new callbacks map item.
            var cb = {
                success:    successCallback,
                error:      errorCallback
            };

            // Create a timeout.
            cb.timeout = setTimeout(function() {
                cb.timeout = false;

                // Remove the callback object again from the map.
                delete callbacksMap[callbackID];

                // Trigger the error callback if defined.
                if (cb.error) {
                    cb.error("method call timeout: no server response received within the timeout");
                }
            }, methodCallTimeout);

            // Add the callbacks with the ID to the callbacks map.
            callbacksMap[callbackID] = cb;

            // Add the callbacks ID to the options.
            opts.callbackID = callbackID;

            // Set the option callback flags if the callbacks are defined.
            opts.callbackSuccess = (successCallback !== false);
            opts.callbackError = (errorCallback !== false);
        }

        // Marshal the options to JSON.
        opts = JSON.stringify(opts);

        // Call the server function.
        callChannel.send(utils.marshalValues(opts, params));

        return true;
    };

    // Unbind an event.
    var offEvent = function(module, event, id) {
        // Obtain the module events.
        var moduleEvents = eventsMap[module];
        if (!moduleEvents) {
            return;
        }

        // Get the event object.
        var eventObj = moduleEvents.events[event];
        if (!eventObj) {
            return;
        }

        // Remove the event listener again from the map.
        delete eventObj.listeners[id];

        // Unbind the server event if there are no more listeners.
        if (Object.keys(eventObj.listeners).length > 0) {
            return;
        }

        // Remove the event object from the module events.
        delete moduleEvents.events[event];

        // Create the event options.
        var opts = {
            type   : "off",
            module : module,
            event  : event
        };

        // Marshal the options to JSON.
        opts = JSON.stringify(opts);

        // Call the server function to unbind the event.
        eventChannel.send(opts);
    };

    var sendBindEventRequest = function(module, event) {
        // Create the event options.
        var opts = {
            type   : "on",
            module : module,
            event  : event
        };

        // Marshal the options to JSON.
        opts = JSON.stringify(opts);

        // Call the server function to bind the event.
        eventChannel.send(opts);
    };

    // Listens on the specific server-side event and triggers the callback.
    var onEvent = function(module, event, callback) {
        // Obtain the module events or create them if they don't exist.
        var moduleEvents = eventsMap[module];
        if (!moduleEvents) {
            moduleEvents = {
                events: {}
            };
            eventsMap[module] = moduleEvents;
        }

        // Get the event object or create it if it does not exists.
        var eventObj = moduleEvents.events[event];
        if (!eventObj) {
            eventObj = {
                listeners: {}
            };
            moduleEvents.events[event] = eventObj;
        }


        // Create a random event listener ID and check if it does not exist already.
        var id;
        while(true) {
            id = utils.randomString(eventListenerIDLength);
            if (!eventObj.listeners[id]) {
                break;
            }
        }

        // Add the event listener with the ID to the map.
        eventObj.listeners[id] = {
            callback: callback
        };

        // Bind the event if not bound before.
        if (Object.keys(eventObj.listeners).length == 1) {
            sendBindEventRequest(module, event, id);
        }

        // Return the scope
        return {
            // Unbind the event again.
            off: function() {
                offEvent(module, event, id);
            }
        };
    };

    // Rebind the events on reconnections.
    socket.on("connected", function() {
        $.each(eventsMap, function(module, moduleEvents) {
            $.each(moduleEvents.events, function(event, eventObj) {
                // Rebind the event.
                sendBindEventRequest(module, event);
            });
        });
    });



    /*
     * Return the actual module function.
     */
    return function(module) {
        // The module name has to be defined.
        if (!module) {
            console.log("BitMonster: invalid module call: module='" + module + "'");
            return false;
        }

        // Return the module object with the module methods.
        return {
            // call a module method on the server-side.
            call: function() {
                // Prepend the module variable to the arguments array.
                Array.prototype.unshift.call(arguments, module);

                // Call the method.
                return callMethod.apply(callMethod, arguments);
            },

            // on listens on the specific server-side event and triggers the function.
            on: function() {
                // Prepend the module variable to the arguments array.
                Array.prototype.unshift.call(arguments, module);

                // Call the method.
                return onEvent.apply(onEvent, arguments);
            },
        };
    };
})();
