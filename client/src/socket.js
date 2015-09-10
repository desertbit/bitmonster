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


var socket = (function () {
    /*
     * Socket Initialization
     */

	// Create the glue socket and connect to the server.
    // Optional pass a host string. This host string is defined in the main BitMonster file.
    var socket = glue(host, {
        baseURL: "/bitmonster/"
    });
    if (!socket) {
    	console.log("BitMonster: failed to initialize socket!");
    	return;
    }

    // ###############################################
    // TODO

    socket.on("connected", function() {
        console.log("connected");
    });

    socket.on("connecting", function() {
        console.log("connecting");
    });

    socket.on("disconnected", function() {
        console.log("disconnected");
    });

    socket.on("reconnecting", function() {
        console.log("reconnecting");
    });

    socket.on("error", function(e, msg) {
        console.log("error: " + msg);
    });

    socket.on("connect_timeout", function() {
        console.log("connect_timeout");
    });

    socket.on("timeout", function() {
        console.log("timeout");
    });

    socket.on("discard_send_buffer", function(e, buf) {
        console.log("discard_send_buffer: ");
        for (var i = 0; i < buf.length; i++) {
            console.log("  i: " + buf[i]);
        }
    });

    socket.onMessage(function(data) {
        console.log("onMessage: " + data);
    });

    // END TODO
    // ###############################################

    // Return the newly created socket.
    return socket;
})();
