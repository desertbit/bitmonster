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


// A list of available translations.
var translations = {
	en: @@include('./en.js')
};

// The current translation.
var tr = translations['en'];

// Obtain the locale.
var locale = (navigator.language || navigator.browserLanguage).split('-')[0];

// Set to the current locale.
if (locale && translations[locale]) {
	tr = translations[locale];
}
