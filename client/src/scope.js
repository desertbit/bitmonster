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

bm.scope = (function() {
    /*
     * Variables
     */

    // A map holding the scopes.
    var scopeMap = {};

    /*
     * Return the actual module function.
     */
    return function(scope) {
        // The module name has to be defined.
        if (!scope) {
            console.log("BitMonster: invalid scope call: scope='" + scope + "'");
            return false;
        }

        // Obtain the scope object.
        var s = scopeMap[scope];

        // Create the scope if it does not exists.
        if (!s) {
            s = {
                events: []
            };
        }

        // Add new passed events to the scope.
        for (var i = 1; i < arguments.length; i++) {
            var e = arguments[i];

            // Check if the passed argument is of type event with
            // the off function.
            if (!$.isFunction(e.off)) {
                console.log("BitMonster: invalid scope call: passed invalid argument: skipping argument...");
                continue;
            }

            s.events.push(e);
        }

        // Update/add the scope to the map.
        scopeMap[scope] = s;

        // Return the module object with the module methods.
        return {
            // Unbind all events in the scope.
            off: function() {
                // Call the off method for all events in the scope.
                for (var i = 0; i < s.events.length; i++) {
                    s.events[i].off();
                }

                // Remove the scope from the map.
                delete scopeMap[scope];
            }
        };
    };
})();
