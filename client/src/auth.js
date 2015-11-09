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

bm.auth = (function() {
    /*
     * Constants
     */

    var authTokenID = "BMAuthToken";


    /*
     * Variables
     */

    // Get the authentication module.
    var module      = bm.module("auth"),
        fingerprint = false;



    /*
     * Private Methods
     */

    var getFingerprint = function() {
        if (!fingerprint) {
            // Obtain the browser fingerprint.
            fingerprint = utils.browserFingerprint();
        }

        return fingerprint;
    };

    var getAuthToken = function() {
        var token;

        // Obtain the auth token if present.
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Get the token from the local storage.
            token = localStorage[authTokenID];
        }
        else {
            // Get the token from the cookie storage.
            if (utils.cookies.hasItem(authTokenID)) {
                token = utils.cookies.getItem(authTokenID);
            }
        }

        return token;
    };

    var setAuthToken = function(token) {
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Save the token in the local storage.
            localStorage.setItem(authTokenID, token);
        }
        else {
            // Use a cookie as storage alternative.
            utils.cookies.setItem(authTokenID, token, (1*60*60*24*30));
        }
    };

    var deleteAuthToken = function() {
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Remove the token from the local storage.
            localStorage.removeItem(authTokenID);
        }
        else {
            // Use a cookie as storage alternative.
            utils.cookies.removeItem(authTokenID);
        }
    };

    // authenticate this client with the saved auth data.
    var authenticate = function(callback, errorCallback) {
        // Get the auth token.
        var authToken = getAuthToken();
        if (!authToken) {
            return false;
        }

        var callErrorCallback = function(err) {
            if (errorCallback) {
                utils.callCatch(errorCallback, err);
            }
        };

        // Create the module method parameters.
        var data = {
            token:         authToken,
            fingerprint:   getFingerprint()
        };

        module.call("authenticate", data, function(data) {
            // TODO
            console.log(data);

            // Call the success callback.
            if (callback) {
                utils.callCatch(callback);
            }
        }, function(err) {
            callErrorCallback(err);
        });

        return true;
    };

    var login = function(username, password, callback, errorCallback) {
        var callErrorCallback = function(err) {
            if (errorCallback) {
                utils.callCatch(errorCallback, err);
            }
        };

        if (!username || !password) {
            callErrorCallback("invalid login credentials");
            return;
        }

        // Create the module method parameters.
        var data = {
            username: username,
            password: password,
            fingerprint: getFingerprint()
        };

        module.call("login", data, function(data) {
            // Check if the auth token is received.
            if (!data.token) {
                callErrorCallback("login failed: invalid authentication token");
                return;
            }

            // Set the auth token.
            setAuthToken(data.token);

            // Finally authenticate the session.
            authenticate(callback, errorCallback);
        }, function(err) {
            callErrorCallback(err);
        });
    };

    var logout = function() {
        // Remove the authentication token.
        deleteAuthToken();

        // Logout on server-side.
        module.call("logout", function() {
            console.log("logout success");
            // Logout successful on server-side.
        }, function(err) {
            console.log("failed to logout socket session");
            if (err) { console.log(err); }
        });
    };



    /*
     * Initialization
     */

    // Authenticate as soon as the socket connects.
    socket.on("connected", function() {
        // Authenticate this socket session if the authToken is present.
        authenticate(undefined, function(err) {
            // TODO: Add graphical notification.
            console.log("failed to authenticate: " + err);
        });


        // TODO: first then reconnect the events!
    });

    /*login("foo", "asdfghjkl", function() {
        console.log("login success!");
    }, function(err) {
        console.log("failed to login: " + err);
    });*/

     /*
      * Return the actual authentication object.
      */
     return {
         login:     login,
         logout:    logout
     };
})();
