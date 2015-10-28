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

// Create the BitMonster object.
var bm = BitMonster();

// Get the users module.
var users = bm.module("users");

// Call the method get of the module users.
users.call("get");

// Call with a parameter object.
users.call("get", {
    name:   "Sample",
    foo:    bar
});

// Call and pass a return callback function.
users.call("get", function(data) {
    // Gets called on success.
});

// Call and pass a return and error callback function.
users.call("get", function(data) {
    // Gets called on success.
}, function(err) {
    // Gets called on error.
});

// Combine everything.
users.call("get", {
    name:   "Sample",
    foo:    bar
}, function(data) {

}, function(err) {

});


// events
// ######

// Bind an event function.
users.on("new", function(data) {

});

// Bind an event function and pass a parameter object.
/*
users.on("new", {
    name:   "Sample",
    foo:    bar
}, function(data) {

});
*/

// Control the event.
var e = users.on("new", function(data) {});
e.off();

// Add events to global scope group.
bm.scope("usersPage", users.on("new", function() {} ));
bm.scope("usersPage", users.on("delete", function() {} ));
bm.scope("usersPage", users.on("edit", function() {} ));
bm.scope("usersPage").off();
