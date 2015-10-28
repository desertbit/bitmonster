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

package bitmonster

import (
	"github.com/desertbit/bitmonster/log"
)

var (
	initErrors []error
)

// initError tells BitMonster that an initialization error occurred.
// The initialization process is done after BitMonster.Run is called.
// If any initError occurred, then the application aborts and logs the error.
// This method is not thread-safe!
func initError(err error) {
	initErrors = append(initErrors, err)
}

// hasInitErrors returns a boolean whenever there are initialization errors.
func hasInitErrors() bool {
	return len(initErrors) != 0
}

// Log the initialization errors.
func logInitErrors() {
	for _, err := range initErrors {
		log.L.Errorf("initialization error: %v", err)
	}
}
