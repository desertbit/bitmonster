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

package db

//####################//
//### Version type ###//
//####################//

// A Version implements a simple versioning type with major, minor and patch version.
type Version struct {
	major, minor, patch int
}

// NewVersion creates a new version.
func NewVersion(major, minor, patch int) *Version {
	return &Version{
		major: major,
		minor: minor,
		patch: patch,
	}
}

// IsEqual returns a boolean whenever the passed version is equal.
func (v *Version) IsEqual(cv *Version) bool {
	return v.major == cv.major && v.minor == cv.minor && v.patch == cv.patch
}

// IsLessThan returns a boolean whenever it is less than the passed version.
func (v *Version) IsLessThan(cv *Version) bool {
	if v.major < cv.major {
		return true
	} else if v.major > cv.major {
		return false
	}

	if v.minor < cv.minor {
		return true
	} else if v.minor > cv.minor {
		return false
	}

	return v.patch < cv.patch
}

// IsGreaterThan returns a boolean whenever it is greater than the passed version.
func (v *Version) IsGreaterThan(cv *Version) bool {
	if v.major > cv.major {
		return true
	} else if v.major < cv.major {
		return false
	}

	if v.minor > cv.minor {
		return true
	} else if v.minor < cv.minor {
		return false
	}

	return v.patch > cv.patch
}
