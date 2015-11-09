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

var utils = (function() {
    /*
     * Constants
     */

    var Delimiter = "&";



    /*
     * Variables
     */

     var instance = {}; // Our public instance object returned by this function.



     /*
      * Private Methods
      */

     /**
      * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
      *
      * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
      * @see http://github.com/garycourt/murmurhash-js
      * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
      * @see http://sites.google.com/site/murmurhash/
      *
      * @param {string} key ASCII only
      * @param {number} seed Positive integer only
      * @return {number} 32-bit positive integer hash
      */
     var murmurhash3_32_gc = function(key, seed) {
     	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;

     	remainder = key.length & 3; // key.length % 4
     	bytes = key.length - remainder;
     	h1 = seed;
     	c1 = 0xcc9e2d51;
     	c2 = 0x1b873593;
     	i = 0;

     	while (i < bytes) {
     	  	k1 =
     	  	  ((key.charCodeAt(i) & 0xff)) |
     	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
     	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
     	  	  ((key.charCodeAt(++i) & 0xff) << 24);
     		++i;

     		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
     		k1 = (k1 << 15) | (k1 >>> 17);
     		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

     		h1 ^= k1;
             h1 = (h1 << 13) | (h1 >>> 19);
     		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
     		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
     	}

     	k1 = 0;

     	switch (remainder) {
     		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
     		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
     		case 1: k1 ^= (key.charCodeAt(i) & 0xff);

     		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
     		k1 = (k1 << 15) | (k1 >>> 17);
     		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
     		h1 ^= k1;
     	}

     	h1 ^= key.length;

     	h1 ^= h1 >>> 16;
     	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
     	h1 ^= h1 >>> 13;
     	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
     	h1 ^= h1 >>> 16;

     	return h1 >>> 0;
    };



    /*
     * Public Methods
     */

    // storageAvailable tests if the storage type is supported.
    instance.storageAvailable = function(type) {
        try {
            var storage = window[type],
            x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        }
        catch(e) {
            return false;
        }
    };

    // callCatch calls a callback and catches exceptions which are logged.
    // Arguments are passed to the callback.
    instance.callCatch = function(callback) {
        // Remove the first argument.
        Array.prototype.shift.call(arguments);

        try {
            callback.apply(callback, arguments);
        }
        catch (e) {
            console.log("BitMonster: catched exception while calling callback:");
            console.log(e);
        }
    };

    instance.randomString = function(len) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < len; i++ ) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    };

    // unmarshalValues splits two values from a single string.
    // This function is chainable to extract multiple values.
    // An object with two strings (first, second) is returned.
    instance.unmarshalValues = function(data) {
        if (!data) {
            return false;
        }

        // Find the delimiter position.
        var pos = data.indexOf(Delimiter);

        // Extract the value length integer of the first value.
        var len = parseInt(data.substring(0, pos), 10);
        data = data.substring(pos + 1);

        // Validate the length.
        if (len < 0 || len > data.length) {
            return false;
        }

        // Now split the first value from the second.
        var firstV = data.substr(0, len);
        var secondV = data.substr(len);

        // Return an object with both values.
        return {
            first:  firstV,
            second: secondV
        };
    };

    // marshalValues joins two values into a single string.
    // They can be decoded by the unmarshalValues function.
    instance.marshalValues = function(first, second) {
        return String(first.length) + Delimiter + first + second;
    };

    instance.browserFingerprint = function() {
        // Source from https://github.com/carlo/jquery-browser-fingerprint
        // TODO: Improve the fingerprinting.
        var fingerprint = [
            navigator.userAgent,
            [ screen.height, screen.width, screen.colorDepth ].join("x"),
            ( new Date() ).getTimezoneOffset(),
            !!window.sessionStorage,
            !!window.localStorage,
            $.map( navigator.plugins, function(p) {
              return [
                p.name,
                p.description,
                $.map( p, function(mt) {
                  return [ mt.type, mt.suffixes ].join("~");
                }).join(",")
              ].join("::");
            }).join(";")
      ].join("###");

      return String(murmurhash3_32_gc(fingerprint, 0x80808080));
    };

    // A complete cookies reader/writer framework with full unicode support.
    // Source from https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
    instance.cookies = {
      getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
      },
      setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
          switch (vEnd.constructor) {
            case Number:
              sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
              break;
            case String:
              sExpires = "; expires=" + vEnd;
              break;
            case Date:
              sExpires = "; expires=" + vEnd.toUTCString();
              break;
          }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
      },
      removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
      },
      hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      },
      keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
      }
    };


    return instance;
})();
