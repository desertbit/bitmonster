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
    var module        = bm.module("auth"),
        fingerprint   = false,
        authUsername  = false;


    /*
     * The actual authentication object.
     */
    var instance = {
        login:         login,
        logout:        logout,
        getUsername:   getUsername,
        isAuth:        isAuth,

        // Triggered if the session is authenticated (After a successful login).
        onAuth: function(f) {
            $(instance).on('onAuth', f);
        },
        // Triggered if the authentication state changes (Logged in or out):
        onAuthChanged: function(f) {
            $(instance).on('authChanged', f);
        }
    };



    /*
     * Private Methods
     */

    function getFingerprint() {
        if (!fingerprint) {
            // Obtain the browser fingerprint.
            fingerprint = utils.browserFingerprint();
        }

        return fingerprint;
    }

    function getAuthToken() {
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
    }

    function setAuthToken(token) {
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Save the token in the local storage.
            localStorage.setItem(authTokenID, token);
        }
        else {
            // Use a cookie as storage alternative.
            utils.cookies.setItem(authTokenID, token, (1*60*60*24*30));
        }
    }

    function deleteAuthToken() {
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Remove the token from the local storage.
            localStorage.removeItem(authTokenID);
        }
        else {
            // Use a cookie as storage alternative.
            utils.cookies.removeItem(authTokenID);
        }
    }

    // authenticate this client with the saved auth data.
    function authenticate(callback, errorCallback) {
        // Get the auth token.
        var authToken = getAuthToken();
        if (!authToken) {
            return false;
        }

        var callErrorCallback = function(err) {
            // Reset the current authenticated user.
            setCurrentUsername(false);

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
            // Validate, that a correct user is returned.
            if (!data.username) {
                callErrorCallback("invalid user data received");
                logout();
                return;
            }

            // Set the current authenticated user.
            setCurrentUsername(data.username);

            // Call the success callback.
            if (callback) {
                utils.callCatch(callback);
            }
        }, function(err) {
            callErrorCallback(err);
        });

        return true;
    }

    function login(username, password, callback, errorCallback) {
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
    }

    function logout() {
        // Reset the current authenticated user.
        setCurrentUsername(false);

        // Remove the authentication token.
        deleteAuthToken();

        // Logout on server-side.
        module.call("logout", function() {
            // Logout successful on server-side.
        }, function(err) {
            console.log("BitMonster: failed to logout socket session");
            if (err) { console.log(err); }
        });
    }

    function setCurrentUsername(username) {
        // Skip if nothing has changed.
        // This will prevent triggering the events multiple times.
        if (authUsername === username) {
            return;
        }

        // Set the new username.
        authUsername = username;

        // Trigger the events.
        $(instance).trigger('authChanged');

        if (authUsername) {
            $(instance).trigger('onAuth');
        }
    }

    // Returns false if not logged in.
    function getUsername() {
        if (!authUsername) {
            return false;
        }
        return authUsername;
    }

    function isAuth() {
        if (!authUsername) {
            return false;
        }
        return true;
    }



    /*
     * Initialization
     */

    // Authenticate as soon as the socket connects.
    socket.on("connected", function() {
        // Authenticate this socket session if the authToken is present.
        var notAuth = authenticate(function() {
            // Trigger the custom event.
            $(socket).trigger("connected_and_auth");
        }, function(err) {
            // Trigger the custom event.
            $(socket).trigger("connected_and_auth");

            // Log.
            console.log("BitMonster: failed to authenticate");
            if (err) { console.log("error message: " + err); }

            // Show a notification.
            bm.notification({
                title: tr.auth.FailedTitle,
                text: tr.auth.FailedText,
            }).show(10000);
        });

        // Trigger the custom event if no authentication was done.
        if (!notAuth) {
            $(socket).trigger("connected_and_auth");
        }
    });

    // Authenticate if the event is triggered.
    module.on("reauthenticate", function() {
        authenticate(undefined, function(err) {
            // Log.
            console.log("BitMonster: failed to reauthenticate");
            if (err) { console.log("error message: " + err); }

            // Show a notification.
            bm.notification({
                title: tr.auth.FailedTitle,
                text: tr.auth.FailedText,
            }).show(10000);
        });
    });



     /*
      * Return the authentication object.
      */
     return instance;
})();
