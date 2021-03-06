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


var connlost = (function () {
    /*
     * Variables
     */

	var instance = {}, // Our public instance object returned by this function.
		timeout = false;

	var notify = bm.notification({
		destroyOnClose: false,
		hideClose: true
	});




    /*
     * Public Methods
     */

    instance.show = function(connecting) {
		if (timeout !== false) {
			return;
		}

		// Set the title and text.
		if (connecting) {
			notify.setTitle(tr.socket.ConnectingTitle);
			notify.setText(tr.socket.ConnectingText);
		}
		else {
			notify.setTitle(tr.socket.ConnLostTitle);
			notify.setText(tr.socket.ConnLostText);
		}

		timeout = setTimeout(function() {
			timeout = false;
			notify.show();
		}, 1500);
    };

	instance.hide = function() {
		if (timeout !== false) {
			clearTimeout(timeout);
			timeout = false;
		}

		notify.hide();
	};


	return instance;
})();
