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
     * Variables
     */

    var initialConnectedOnce = false;


    /*
     * Socket Initialization
     */

	// Create the glue socket and connect to the server.
    // Optional pass a host string. This host string is defined in the main BitMonster file.
    var socket = glue(host, {
        baseURL:                "/bitmonster/",
        resetSendBufferTimeout: 20000
    });
    if (!socket) {
    	console.log("BitMonster: failed to initialize socket!");
    	return;
    }

    socket.on("connected", function() {
        // Set the flag.
        initialConnectedOnce = true;

        connlost.hide();
    });

    socket.on("connecting", function() {
        connlost.show(!initialConnectedOnce);
    });

    socket.on("reconnecting", function() {
        connlost.show(!initialConnectedOnce);
    });

    socket.on("disconnected", function() {
        connlost.hide();

        var notify = bm.notification({
            title: tr.socket.DisconnectedTitle,
            text: tr.socket.DisconnectedText,
            hideClose: true
        });

        notify.onClick(function() {
            notify.destroy();
            socket.reconnect();
        });

        notify.show();
    });

    socket.on("error", function(e, msg) {
        // Just log the error.
        console.log("BitMonster: socket error: " + msg);
    });

    socket.on("discard_send_buffer", function() {
        bm.notification({
    		title: tr.socket.DiscardNotSendDataTitle,
    		text: tr.socket.DiscardNotSendDataText
    	}).show();
    });


    // Return the newly created socket.
    return socket;
})();
