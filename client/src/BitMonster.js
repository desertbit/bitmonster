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

// Include the required libraries directly.
@@include('../bower_components/sjcl/sjcl.js')
@@include('../bower_components/glue-socket/client/dist/glue.js')

// Include the polyfills.
@@include('./polyfills.js')


var BitMonster = function(host) {
    // Turn on strict mode.
    'use strict';

    // BitMonster object
    var bm = {};

    // If host is undefined, then set it to an empty string.
    if (!host) {
        host = "";
    }

    // Include the dependencies.
    @@include('./utils.js')
    @@include('./translate/translate.js')
    @@include('./ui/notification.js')
    @@include('./ui/connlost.js')
    @@include('./scope.js')
    @@include('./socket.js')
    @@include('./module.js')
    @@include('./auth.js')

    // Return the newly created BitMonster object.
    return bm;
};
