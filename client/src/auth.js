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

    var authTokenID = "BMAuthToken",
        httpAuthURL = host + "/bitmonster/auth";


    /*
     * Variables
     */

    // Get the authentication module.
    var module      = bm.module("auth"),
        fingerprint = false,
        authUserID  = false;


    /*
     * The actual authentication object.
     */
    var instance = {
        login:         login,
        logout:        logout,
        getUserID:     getUserID,
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
            // Set any cookie path and domain.
            // Also set the secure HTTPS flag. This cookie is only used in javascript.
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
            setCurrentUserID(false);

            // Remove the authentication token.
            deleteAuthToken();

            if (errorCallback) {
                utils.callCatch(errorCallback, err);
                // Reset to trigger only once.
                errorCallback = undefined;
            }
        };

        // Create the HTTP data.
        var httpData = {
            type:      "auth",
            socketID:  socket.socketID()
        };

        // Send the http authentication request to confirm the cookie.
        var reqXhr = $.ajax({
            url: httpAuthURL,
            success: function () {
                // Reset.
                reqXhr = false;
            },
            error: function (r, msg) {
                // Reset.
                reqXhr = false;
            },
            type: "POST",
            data: JSON.stringify(httpData),
            timeout: 7000,
            xhrFields: {
                withCredentials: true // Allow to send cookies.
            }
        });

        // Create the module method parameters.
        var data = {
            token:         authToken,
            fingerprint:   getFingerprint()
        };

        module.call("authenticate", data, function(data) {
            // Validate, that a correct user is returned.
            if (!data.id) {
                callErrorCallback("invalid user data received");
                logout();
                return;
            }

            // Set the current authenticated user.
            setCurrentUserID(data.id);

            // Call the success callback.
            if (callback) {
                utils.callCatch(callback);
            }
        }, function(err) {
            // Kill the ajax request.
            if (reqXhr) {
                reqXhr.abort();
            }

            callErrorCallback(err);
        });

        return true;
    }

    function login(username, password, callback, errorCallback) {
        var performLogin = function() {
            var callErrorCallback = function(err) {
                // Call the callback.
                if (errorCallback) {
                    utils.callCatch(errorCallback, err);
                    // Reset to trigger only once.
                    errorCallback = undefined;
                }
            };

            if (!username || !password) {
                callErrorCallback("invalid login credentials");
                return;
            }

            // This method triggers the authentication request as soon as
            // the login call and the HTTP request finished.
            var triggerAuthRequestCount = 0;
            var triggerAuthRequest = function() {
                triggerAuthRequestCount++;
                if (triggerAuthRequestCount < 2) {
                    return;
                }

                // Finally authenticate the session.
                if (!authenticate(callback, errorCallback)) {
                    callErrorCallback("authentication failed");
                    return;
                }
            };

            // Create the HTTP data.
            var httpData = {
                type:      "login",
                socketID:  socket.socketID()
            };

            // Send the http login request to set the cookie.
            // We don't have acces through javascript.
            // This is a security precaution.
            var reqXhr = $.ajax({
                url: httpAuthURL,
                success: function () {
                    // Reset.
                    reqXhr = false;

                    // Trigger the authentication request as soon as all requests are ready.
                    triggerAuthRequest();
                },
                error: function (r, msg) {
                    // Reset.
                    reqXhr = false;
                },
                type: "POST",
                data: JSON.stringify(httpData),
                timeout: 7000,
                xhrFields: {
                    withCredentials: true // Allow to send cookies.
                }
            });

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

                // Trigger the authentication request as soon as all requests are ready.
                triggerAuthRequest();
            }, function(err) {
                // Kill the ajax request.
                if (reqXhr) {
                    reqXhr.abort();
                }

                // Call the error callback.
                callErrorCallback(err);
            });
        };

        // If the socket is not connected yet, then trigger the login
        // first as soon as a connection is established.
        // Otherwise the socketID() is empty.
        if (socket.state() !== "connected") {
            socket.on("connected", performLogin);
        } else {
            performLogin();
        }
    }

    function logout() {
        // Reset the current authenticated user.
        setCurrentUserID(false);

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

    function setCurrentUserID(userID) {
        // Skip if nothing has changed.
        // This will prevent triggering the events multiple times.
        if (authUserID === userID) {
            return;
        }

        // Set the new user ID.
        authUserID = userID;

        // Trigger the events.
        if (authUserID) {
            $(instance).trigger('authChanged', [true]);
            $(instance).trigger('onAuth');
        }
        else {
            $(instance).trigger('authChanged', [false]);
        }
    }

    // Returns false if not logged in.
    function getUserID() {
        if (!authUserID) {
            return false;
        }
        return authUserID;
    }

    function isAuth() {
        if (!authUserID) {
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
