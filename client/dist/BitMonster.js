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
var glue=function(e,n){"use strict";var t,o,i,c,r,a,s,u,l=function(){var t,o={};return o.open=function(){try{var i;i=e.match("^https://")?"wss"+e.substr(5):"ws"+e.substr(4),i+=n.baseURL+"ws",t=new WebSocket(i),t.onmessage=function(e){o.onMessage(e.data.toString())},t.onerror=function(e){var n="the websocket closed the connection with ";n+=e.code?"the error code: "+e.code:"an error.",o.onError(n)},t.onclose=function(){o.onClose()},t.onopen=function(){o.onOpen()}}catch(c){o.onError()}},o.send=function(e){t.send(e)},o.reset=function(){t&&t.close(),t=void 0},o},d=function(){var t,o,i,c=e+n.baseURL+"ajax",r=8e3,a=45e3,s={Timeout:"t",Closed:"c"},u={Delimiter:"&",Init:"i",Push:"u",Poll:"o"},l={},d=!1,f=!1,g=function(){i=function(){},d&&d.abort(),f&&f.abort()},v=function(){g(),l.onClose()},m=function(e){g(),e=e?"the ajax socket closed the connection with the error: "+e:"the ajax socket closed the connection with an error.",l.onError(e)},h=function(e,n){f=$.ajax({url:c,success:function(e){f=!1,n&&n(e)},error:function(e,n){f=!1,m(n)},type:"POST",data:e,dataType:"text",timeout:r})};return i=function(){d=$.ajax({url:c,success:function(e){if(d=!1,e==s.Timeout)return void i();if(e==s.Closed)return void v();var n=e.indexOf(u.Delimiter);return 0>n?void m("ajax socket: failed to split poll token from data!"):(o=e.substring(0,n),e=e.substr(n+1),i(),void l.onMessage(e))},error:function(e,n){d=!1,m(n)},type:"POST",data:u.Poll+t+u.Delimiter+o,dataType:"text",timeout:a})},l.open=function(){h(u.Init,function(e){var n=e.indexOf(u.Delimiter);return 0>n?void m("ajax socket: failed to split uid and poll token from data!"):(t=e.substring(0,n),o=e.substr(n+1),i(),void l.onOpen())})},l.send=function(e){h(u.Push+t+u.Delimiter+e)},l.reset=function(){g()},l},f="1.6.0",g="m",v={WebSocket:"WebSocket",AjaxSocket:"AjaxSocket"},m={Len:2,Init:"in",Ping:"pi",Pong:"po",Close:"cl",Invalid:"iv",DontAutoReconnect:"dr",ChannelData:"cd"},h={Disconnected:"disconnected",Connecting:"connecting",Reconnecting:"reconnecting",Connected:"connected"},p={baseURL:"/glue/",forceSocketType:!1,connectTimeout:1e4,pingInterval:35e3,pingReconnectTimeout:5e3,reconnect:!0,reconnectDelay:1e3,reconnectDelayMax:5e3,reconnectAttempts:10,resetSendBufferTimeout:1e4},b=!1,k=!1,D=h.Disconnected,T=0,x=!1,y=!1,S=!1,C=!1,M=[],w=!1,R=!1,O=!1,I=[],L="",P=function(){var e="&",n={};return n.unmarshalValues=function(n){if(!n)return!1;var t=n.indexOf(e),o=parseInt(n.substring(0,t),10);if(n=n.substring(t+1),0>o||o>n.length)return!1;var i=n.substr(0,o),c=n.substr(o);return{first:i,second:c}},n.marshalValues=function(n,t){return String(n.length)+e+n+t},n}(),j=function(){var e={},n={},t=function(e){var n={onMessageFunc:function(){}};return n.instance={onMessage:function(e){n.onMessageFunc=e},send:function(n,t){return n?a(m.ChannelData,P.marshalValues(e,n),t):-1}},n};return e.get=function(e){if(!e)return!1;var o=n[e];return o?o.instance:(o=t(e),n[e]=o,o.instance)},e.emitOnMessage=function(e,t){if(e&&t){var o=n[e];if(!o)return void console.log("glue: channel '"+e+"': emit onMessage event: channel does not exists");try{o.onMessageFunc(t)}catch(i){return void console.log("glue: channel '"+e+"': onMessage event call failed: "+i.message)}}},e}();r=function(e){return b?O?void b.send(e):void I.push(e):void 0};var A=function(){if(0!==I.length){for(var e=0;e<I.length;e++)r(I[e]);I=[]}},U=function(){R=!1,w!==!1&&(clearTimeout(w),w=!1)},W=function(){w!==!1||R||(w=setTimeout(function(){if(w=!1,R=!0,0!==M.length){for(var e,n=0;n<M.length;n++)if(e=M[n],e.discardCallback&&$.isFunction(e.discardCallback))try{e.discardCallback(e.data)}catch(t){console.log("glue: failed to call discard callback: "+t.message)}u("discard_send_buffer"),M=[]}},n.resetSendBufferTimeout))},E=function(){if(U(),0!==M.length){for(var e,n=0;n<M.length;n++)e=M[n],r(e.cmd+e.data);M=[]}};a=function(e,n,t){return n||(n=""),b&&D===h.Connected?(r(e+n),1):R?(t&&$.isFunction(t)&&t(n),-1):(W(),M.push({cmd:e,data:n,discardCallback:t}),0)};var F=function(){y!==!1&&(clearTimeout(y),y=!1)},q=function(){F(),y=setTimeout(function(){y=!1,u("connect_timeout"),s()},n.connectTimeout)},V=function(){S!==!1&&(clearTimeout(S),S=!1),C!==!1&&(clearTimeout(C),C=!1)},_=function(){V(),S=setTimeout(function(){S=!1,r(m.Ping),C=setTimeout(function(){C=!1,u("timeout"),s()},n.pingReconnectTimeout)},n.pingInterval)},z=function(){return k?void(b=o()):T>1?(o=d,b=o(),void(i=v.AjaxSocket)):(!n.forceSocketType&&window.WebSocket||n.forceSocketType===v.WebSocket?(o=l,i=v.WebSocket):(o=d,i=v.AjaxSocket),void(b=o()))},B=function(e){return e=JSON.parse(e),e.socketID?(L=e.socketID,O=!0,A(),D=h.Connected,u("connected"),void setTimeout(E,0)):(c(),void console.log("glue: socket initialization failed: invalid initialization data received"))},J=function(){z(),b.onOpen=function(){F(),T=0,k=!0,_();var e={version:f};e=JSON.stringify(e),b.send(m.Init+e)},b.onClose=function(){s()},b.onError=function(e){u("error",[e]),s()},b.onMessage=function(e){if(_(),e.length<m.Len)return void console.log("glue: received invalid data from server: data is too short.");var n=e.substr(0,m.Len);if(e=e.substr(m.Len),n===m.Ping)r(m.Pong);else if(n===m.Pong);else if(n===m.Invalid)console.log("glue: server replied with an invalid request notification!");else if(n===m.DontAutoReconnect)x=!0,console.log("glue: server replied with an don't automatically reconnect request. This might be due to an incompatible protocol version.");else if(n===m.Init)B(e);else if(n===m.ChannelData){var t=P.unmarshalValues(e);if(!t)return void console.log("glue: server requested an invalid channel data request: "+e);j.emitOnMessage(t.first,t.second)}else console.log("glue: received invalid data from server with command '"+n+"' and data '"+e+"'!")},setTimeout(function(){T>0?(D=h.Reconnecting,u("reconnecting")):(D=h.Connecting,u("connecting")),q(),b.open()},0)},N=function(){F(),V(),O=!1,L="",I=[],b&&(b.onOpen=b.onClose=b.onMessage=b.onError=function(){},b.reset(),b=!1)};if(s=function(){if(N(),n.reconnectAttempts>0&&T>n.reconnectAttempts||n.reconnect===!1||x)return D=h.Disconnected,void u("disconnected");T+=1;var e=n.reconnectDelay*T;e>n.reconnectDelayMax&&(e=n.reconnectDelayMax),setTimeout(function(){J()},e)},c=function(){b&&(r(m.Close),N(),D=h.Disconnected,u("disconnected"))},t=j.get(g),e||(e=window.location.protocol+"//"+window.location.host),!e.match("^http://")&&!e.match("^https://"))return void console.log("glue: invalid host: missing 'http://' or 'https://'!");n=$.extend(p,n),n.reconnectDelayMax<n.reconnectDelay&&(n.reconnectDelayMax=n.reconnectDelay),0!==n.baseURL.indexOf("/")&&(n.baseURL="/"+n.baseURL),"/"!==n.baseURL.slice(-1)&&(n.baseURL=n.baseURL+"/"),J();var H={version:function(){return f},type:function(){return i},state:function(){return D},socketID:function(){return L},send:function(e,n){t.send(e,n)},onMessage:function(e){t.onMessage(e)},on:function(){var e=$(H);e.on.apply(e,arguments)},reconnect:function(){D===h.Disconnected&&(T=0,x=!1,s())},close:function(){c()},channel:function(e){return j.get(e)}};return u=function(){var e=$(H);e.triggerHandler.apply(e,arguments)},H};

// Include the polyfills.
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

// Object.keys polyfill.
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
  Object.keys = (function() {
    'use strict';
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function(obj) {
      if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
        throw new TypeError('Object.keys called on non-object');
      }

      var result = [], prop, i;

      for (prop in obj) {
        if (hasOwnProperty.call(obj, prop)) {
          result.push(prop);
        }
      }

      if (hasDontEnumBug) {
        for (i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) {
            result.push(dontEnums[i]);
          }
        }
      }
      return result;
    };
  }());
}



var BitMonster = function(host) {
    // Turn on strict mode.
    'use strict';

    // BitMonster object
    var bm = {};

    // Include the dependencies.
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
	en: /*
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

{
	socket: {
		ConnLostTitle: "Connection Lost",
		ConnLostText:  "Trying to reconnect to Server...",
		DiscardNotSendDataTitle: "Unsend Data",
		DiscardNotSendDataText: "Not all data messages could be transmitted to the server!",
		DisconnectedTitle: "Disconnected from Server",
		DisconnectedText: "Click here to reconnect.",
	},
	auth: {
		FailedTitle: "Authentication failed",
		FailedText:  "Failed to authenticate this session."
	}
}

};

// The current translation.
var tr = translations['en'];

// Obtain the locale.
var locale = (navigator.language || navigator.browserLanguage).split('-')[0];

// Set to the current locale.
if (locale && translations[locale]) {
	tr = translations[locale];
}

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


bm.notification = function (options) {
    /*
     * Constants
     */

     var DefaultOptions = {
         title         : "",
         text          : "",
         destroyOnClose: true,
         hideClose     : false
     };



    /*
     * Variables
     */

     var id         = "bm-notification-" + utils.randomString(14),
         timeout    = false,
 		 widgetBody = 	'<div id="' + id + '" class="bm-notification">' +
                            '<div><b></b><b></b><b></b><b></b></div>' +
 							'<p></p>' +
 							'<span></span>' +
 						'</div>';



    /*
     * Private Functions
     */

    function getWidget() {
        // Try to obtain the widget object.
        var widget = $('#' + id);

        // Return it if it exists.
        if (widget.length) {
            return widget;
        }

        // Create it and prepend it to the document body.
        widget = $(widgetBody);
        $('body').prepend(widget);

        if (options.hideClose) {
            $('#' + id + ' > div').remove();
        }
        else {
            // Bind close events.
            $('#' + id + ' > div').on('click', function() {
                if (options.destroyOnClose) {
                    destroy();
                }
                else {
                    hide();
                }
            });
        }

        return widget;
    }

    function setTitle(str) {
        getWidget().find("p").text(str);
    }

    function setText(str) {
        getWidget().find("span").text(str);
    }

    function stopTimeout() {
        // Stop the timeout.
        if (timeout !== false) {
            clearTimeout(timeout);
            timeout = false;
        }
    }

    // Optionally pass a duration which hides the widget again.
    function show(duration) {
        // Get the widget.
        var widget = getWidget();

        // Stop the timeout.
        stopTimeout();

        // Remove the classes if present.
        widget.removeClass('hide');
        widget.removeClass('show');

        // Show it by adding the show class.
        widget.addClass('show');

        // Hide again after a timeout duration if defined.
        if (duration > 0) {
            timeout = setTimeout(function() {
                timeout = false;
                hide();
            }, duration);
        }
    }

    function hide() {
        // Get the widget.
        var widget = getWidget();

        // Stop the timeout.
        stopTimeout();

        // Hide it by removing the class.
        widget.addClass('hide');

        // Remove the classes after a short duration.
        timeout = setTimeout(function() {
            timeout = false;
            widget.removeClass('hide');
            widget.removeClass('show');
        }, 3000);
    }

    function destroy() {
        // Get the widget.
        var widget = getWidget();

        // Stop the timeout.
        stopTimeout();

        // Hide it by removing the class.
        widget.addClass('hide');

        // Remove the object after a short duration.
        timeout = setTimeout(function() {
            timeout = false;
            widget.remove();
        }, 3000);
    }



    /*
     * Initialization
     */

    // Merge the options with the default options.
    options = $.extend(DefaultOptions, options);

    // This call creates the widget once.
    getWidget();

    // Set the default title and text.
    setTitle(options.title);
    setText(options.text);



    // Return the public object.
    return {
        setTitle: setTitle,
        setText : setText,
        show    : show,
        hide    : hide,
        destroy : destroy,

        onClick: function(f) {
            getWidget().addClass('bm-clickable').on('click', f);
        }
    };
};

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
		title: tr.socket.ConnLostTitle,
		text: tr.socket.ConnLostText,
		destroyOnClose: false,
		hideClose: true
	});




    /*
     * Public Methods
     */

    instance.show = function() {
		if (timeout !== false) {
			return;
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

    socket.on("connected", function() {
        connlost.hide();
    });

    socket.on("connecting", function() {
        connlost.show();
    });

    socket.on("reconnecting", function() {
        connlost.show();
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

bm.module = (function() {
    /*
     * Constants
     */

    var callbackIDLength      = 14,
        eventListenerIDLength = 10,
        methodCallTimeout     = 12000; // 12 seconds



    /*
     * Variables
     */

     // Obtain the socket communication channels.
     var callChannel    = socket.channel("call"),
         eventChannel   = socket.channel("event");

     // A map holding all callbacks and events.
     var callbacksMap   = {},
         eventsMap      = {};



     /*
      * Initialization
      */

     // Handle received messages from the call channel.
     callChannel.onMessage(function(data) {
         // Define a method to print error messages.
         var logError = function() {
             console.log("BitMonster: received invalid call request from server.");
         };

         // Parse the JSON to an object.
         data = JSON.parse(data);

         // The callback ID has to be always defined.
         if (!data.callbackID || String(data.callbackID).length === 0) {
             logError();
             return;
         }

         // Obtain the callback object.
         var cb = callbacksMap[data.callbackID];
         if (!cb) {
             logError();
             return;
         }

         // Remove the callback object from the map.
         delete callbacksMap[data.callbackID];

         // Stop the timeout.
         if (cb.timeout) {
             clearTimeout(cb.timeout);
             cb.timeout = false;
         }

         // Determind the request type and call the callback.
         if (data.type === "cleanup") {
             // Just return. The callback object was already removed from the map.
             return;
         }
         else if (data.type === "success" && cb.success) {
             utils.callCatch(cb.success, data.data);
         }
         else if (data.type === "error" && cb.error) {
             utils.callCatch(cb.error, data.message);
         }
         else {
             logError();
         }
     });

     // Handle received messages from the event channel.
     eventChannel.onMessage(function(data) {
         // Define a method to print error messages.
         var logError = function() {
             console.log("BitMonster: received invalid event request from server.");
         };

         // Parse the JSON to an object.
         data = JSON.parse(data);

         // Check for the required values.
         if (!data.module || !data.event) {
             logError();
             return;
         }

         // Obtain the module events.
         var moduleEvents = eventsMap[data.module];
         if (!moduleEvents) {
             // Don't log the error. The event was unbound.
             return;
         }

         // Get the event object.
         var eventObj = moduleEvents.events[data.event];
         if (!eventObj) {
             // Don't log the error. The event was unbound.
             return;
         }

         // Determind the event type.
         if (data.type === "trigger") {
             // Parse the JSON data value if present.
             var eventData;
             if (data.data) {
                 eventData = JSON.parse(data.data);
             }

             // Create a shallow copy to allow mutations inside the iteration.
             var listeners = jQuery.extend({}, eventObj.listeners);

             // Trigger the listeners bound to this event.
             $.each(listeners, function(id, l) {
                 try {
                     l.callback(eventData);
                 }
                 catch (e) {
                     console.log("BitMonster: catched exception while triggering event:");
                     console.log(e);
                 }
             });
         }
         else {
             logError();
         }
     });



    /*
     * Private
     */

    // call a module method on the server-side.
    var callMethod = function(module, method) {
        var params          = false,
            successCallback = false,
            errorCallback   = false;

        // Define a method to print error messages.
        var logError = function() {
            console.log("BitMonster: invalid method call: module='" + module + "' method='" + method + "'");
        };

        // The method name has to be defined.
        if (!method) {
            logError();
            return false;
        }

        // Parse the function arguments.
        for (var i = 2; i < arguments.length; i++) {
            var arg = arguments[i];

            // Check if this argument is the parameter object.
            if (arg !== null && typeof arg === 'object') {
                // Check if already set.
                if (params !== false) {
                    logError();
                    return false;
                }

                // Set the parameter object.
                params = arg;
            }
            // Check if this argument is a callback function.
            else if ($.isFunction(arg)) {
                // Set the success callback if not already set.
                if (successCallback === false) {
                    successCallback = arg;
                }
                // Set the error callback if not already set.
                else if (errorCallback === false) {
                    errorCallback = arg;
                }
                // Too many functions passed to this method. Handle the error.
                else {
                    logError();
                    return false;
                }
            }
            // Handle unknown types.
            else {
                logError();
                return false;
            }
        }

        // Marshal the parameter object to JSON.
        if (params) {
            params = JSON.stringify(params);
        } else {
            // Just set an empty string.
            params = "";
        }

        // Create the call options.
        var opts = {
            module: module,
            method: method
        };

        // Register the callbacks if defined.
        if (successCallback !== false || errorCallback !== false) {
            // Create a random callbacks ID and check if it does not exist already.
            var callbackID;
            while(true) {
                callbackID = utils.randomString(callbackIDLength);
                if (!callbacksMap[callbackID]) {
                    break;
                }
            }

            // Create a new callbacks map item.
            var cb = {
                success:    successCallback,
                error:      errorCallback
            };

            // Create a timeout.
            cb.timeout = setTimeout(function() {
                cb.timeout = false;

                // Remove the callback object again from the map.
                delete callbacksMap[callbackID];

                // Trigger the error callback if defined.
                if (cb.error) {
                    cb.error("method call timeout: no server response received within the timeout");
                }
            }, methodCallTimeout);

            // Add the callbacks with the ID to the callbacks map.
            callbacksMap[callbackID] = cb;

            // Add the callbacks ID to the options.
            opts.callbackID = callbackID;

            // Set the option callback flags if the callbacks are defined.
            opts.callbackSuccess = (successCallback !== false);
            opts.callbackError = (errorCallback !== false);
        }

        // Marshal the options to JSON.
        opts = JSON.stringify(opts);

        // Call the server function.
        callChannel.send(utils.marshalValues(opts, params));

        return true;
    };

    // Unbind an event.
    var offEvent = function(module, event, id) {
        // Obtain the module events.
        var moduleEvents = eventsMap[module];
        if (!moduleEvents) {
            return;
        }

        // Get the event object.
        var eventObj = moduleEvents.events[event];
        if (!eventObj) {
            return;
        }

        // Remove the event listener again from the map.
        delete eventObj.listeners[id];

        // Unbind the server event if there are no more listeners.
        if (Object.keys(eventObj.listeners).length > 0) {
            return;
        }

        // Remove the event object from the module events.
        delete moduleEvents.events[event];

        // Create the event options.
        var opts = {
            type   : "off",
            module : module,
            event  : event
        };

        // Marshal the options to JSON.
        opts = JSON.stringify(opts);

        // Call the server function to unbind the event.
        eventChannel.send(opts);
    };

    var sendBindEventRequest = function(module, event) {
        // Create the event options.
        var opts = {
            type   : "on",
            module : module,
            event  : event
        };

        // Marshal the options to JSON.
        opts = JSON.stringify(opts);

        // Call the server function to bind the event.
        eventChannel.send(opts);
    };

    // Listens on the specific server-side event and triggers the callback.
    var onEvent = function(module, event, callback) {
        // Obtain the module events or create them if they don't exist.
        var moduleEvents = eventsMap[module];
        if (!moduleEvents) {
            moduleEvents = {
                events: {}
            };
            eventsMap[module] = moduleEvents;
        }

        // Get the event object or create it if it does not exists.
        var eventObj = moduleEvents.events[event];
        if (!eventObj) {
            eventObj = {
                listeners: {}
            };
            moduleEvents.events[event] = eventObj;
        }


        // Create a random event listener ID and check if it does not exist already.
        var id;
        while(true) {
            id = utils.randomString(eventListenerIDLength);
            if (!eventObj.listeners[id]) {
                break;
            }
        }

        // Add the event listener with the ID to the map.
        eventObj.listeners[id] = {
            callback: callback
        };

        // Bind the event if not bound before.
        if (Object.keys(eventObj.listeners).length == 1) {
            sendBindEventRequest(module, event, id);
        }

        // Return the scope
        return {
            // Unbind the event again.
            off: function() {
                offEvent(module, event, id);
            }
        };
    };

    // Rebind the events on reconnections.
    // Don't use the connected event directly, because the authentication
    // should be handled first.
    $(socket).on("connected_and_auth", function() {
        $.each(eventsMap, function(module, moduleEvents) {
            $.each(moduleEvents.events, function(event, eventObj) {
                // Rebind the event.
                sendBindEventRequest(module, event);
            });
        });
    });



    /*
     * Return the actual module function.
     */
    return function(module) {
        // The module name has to be defined.
        if (!module) {
            console.log("BitMonster: invalid module call: module='" + module + "'");
            return false;
        }

        // Return the module object with the module methods.
        return {
            // call a module method on the server-side.
            call: function() {
                // Prepend the module variable to the arguments array.
                Array.prototype.unshift.call(arguments, module);

                // Call the method.
                return callMethod.apply(callMethod, arguments);
            },

            // on listens on the specific server-side event and triggers the function.
            on: function() {
                // Prepend the module variable to the arguments array.
                Array.prototype.unshift.call(arguments, module);

                // Call the method.
                return onEvent.apply(onEvent, arguments);
            },
        };
    };
})();

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

bm.auth = (function() {
    /*
     * Constants
     */

    var authTokenID = "BMAuthToken",
        httpAuthURL = "/bitmonster/auth";


    /*
     * Variables
     */

    // Get the authentication module.
    var module      = bm.module("auth"),
        fingerprint = false,
        authUserID  = false;


    /*
     * The actual authentication object.
     */
    var instance = {
        login:         login,
        logout:        logout,
        getUserID:     getUserID,
        isAuth:        isAuth,

        // Triggered if the session is authenticated (After a successful login).
        onAuth: function(f) {
            $(instance).on('onAuth', f);
        },
        // Triggered if the authentication state changes (Logged in or out):
        onAuthChanged: function(f) {
            $(instance).on('authChanged', f);
        }
    };



    /*
     * Private Methods
     */

    function getFingerprint() {
        if (!fingerprint) {
            // Obtain the browser fingerprint.
            fingerprint = utils.browserFingerprint();
        }

        return fingerprint;
    }

    function getAuthToken() {
        var token;

        // Obtain the auth token if present.
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Get the token from the local storage.
            token = localStorage[authTokenID];
        }
        else {
            // Get the token from the cookie storage.
            if (utils.cookies.hasItem(authTokenID)) {
                token = utils.cookies.getItem(authTokenID);
            }
        }

        return token;
    }

    function setAuthToken(token) {
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Save the token in the local storage.
            localStorage.setItem(authTokenID, token);
        }
        else {
            // Use a cookie as storage alternative.
            // Set any cookie path and domain.
            // Also set the secure HTTPS flag. This cookie is only used in javascript.
            utils.cookies.setItem(authTokenID, token, (1*60*60*24*30));
        }
    }

    function deleteAuthToken() {
        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Remove the token from the local storage.
            localStorage.removeItem(authTokenID);
        }
        else {
            // Use a cookie as storage alternative.
            utils.cookies.removeItem(authTokenID);
        }
    }

    // authenticate this client with the saved auth data.
    function authenticate(callback, errorCallback) {
        // Get the auth token.
        var authToken = getAuthToken();
        if (!authToken) {
            return false;
        }

        var callErrorCallback = function(err) {
            // Reset the current authenticated user.
            setCurrentUserID(false);

            // Remove the authentication token.
            deleteAuthToken();

            if (errorCallback) {
                utils.callCatch(errorCallback, err);
                // Reset to trigger only once.
                errorCallback = undefined;
            }
        };

        // Create the HTTP data.
        var httpData = {
            type:      "auth",
            socketID:  socket.socketID()
        };

        // Send the http authentication request to confirm the cookie.
        var reqXhr = $.ajax({
            url: httpAuthURL,
            success: function () {
                // Reset.
                reqXhr = false;
            },
            error: function (r, msg) {
                // Reset.
                reqXhr = false;

                // Call the error callback.
                var err = "HTTP authentication failed";
                if (msg) { err += ": " + msg; }
                callErrorCallback(err);
            },
            type: "POST",
            data: JSON.stringify(httpData),
            timeout: 7000
        });

        // Create the module method parameters.
        var data = {
            token:         authToken,
            fingerprint:   getFingerprint()
        };

        module.call("authenticate", data, function(data) {
            // Validate, that a correct user is returned.
            if (!data.id) {
                callErrorCallback("invalid user data received");
                logout();
                return;
            }

            // Set the current authenticated user.
            setCurrentUserID(data.id);

            // Call the success callback.
            if (callback) {
                utils.callCatch(callback);
            }
        }, function(err) {
            // Kill the ajax request.
            if (reqXhr) {
                reqXhr.abort();
            }

            callErrorCallback(err);
        });

        return true;
    }

    function login(username, password, callback, errorCallback) {
        var performLogin = function() {
            var callErrorCallback = function(err) {
                // Call the callback.
                if (errorCallback) {
                    utils.callCatch(errorCallback, err);
                    // Reset to trigger only once.
                    errorCallback = undefined;
                }
            };

            if (!username || !password) {
                callErrorCallback("invalid login credentials");
                return;
            }

            // This method triggers the authentication request as soon as
            // the login call and the HTTP request finished.
            var triggerAuthRequestCount = 0;
            var triggerAuthRequest = function() {
                triggerAuthRequestCount++;
                if (triggerAuthRequestCount < 2) {
                    return;
                }

                // Finally authenticate the session.
                if (!authenticate(callback, errorCallback)) {
                    callErrorCallback("authentication failed");
                    return;
                }
            };

            // Create the HTTP data.
            var httpData = {
                type:      "login",
                socketID:  socket.socketID()
            };

            // Send the http login request to set the cookie.
            // We don't have acces through javascript.
            // This is a security precaution.
            var reqXhr = $.ajax({
                url: httpAuthURL,
                success: function () {
                    // Reset.
                    reqXhr = false;

                    // Trigger the authentication request as soon as all requests are ready.
                    triggerAuthRequest();
                },
                error: function (r, msg) {
                    // Reset.
                    reqXhr = false;

                    // Call the error callback.
                    var err = "HTTP authentication failed";
                    if (msg) { err += ": " + msg; }
                    callErrorCallback(err);
                },
                type: "POST",
                data: JSON.stringify(httpData),
                timeout: 7000
            });

            // Create the module method parameters.
            var data = {
                username: username,
                password: password,
                fingerprint: getFingerprint()
            };

            module.call("login", data, function(data) {
                // Check if the auth token is received.
                if (!data.token) {
                    callErrorCallback("login failed: invalid authentication token");
                    return;
                }

                // Set the auth token.
                setAuthToken(data.token);

                // Trigger the authentication request as soon as all requests are ready.
                triggerAuthRequest();
            }, function(err) {
                // Kill the ajax request.
                if (reqXhr) {
                    reqXhr.abort();
                }

                // Call the error callback.
                callErrorCallback(err);
            });
        };

        // If the socket is not connected yet, then trigger the login
        // first as soon as a connection is established.
        // Otherwise the socketID() is empty.
        if (socket.state() !== "connected") {
            socket.on("connected", performLogin);
        } else {
            performLogin();
        }
    }

    function logout() {
        // Reset the current authenticated user.
        setCurrentUserID(false);

        // Remove the authentication token.
        deleteAuthToken();

        // Logout on server-side.
        module.call("logout", function() {
            // Logout successful on server-side.
        }, function(err) {
            console.log("BitMonster: failed to logout socket session");
            if (err) { console.log(err); }
        });
    }

    function setCurrentUserID(userID) {
        // Skip if nothing has changed.
        // This will prevent triggering the events multiple times.
        if (authUserID === userID) {
            return;
        }

        // Set the new user ID.
        authUserID = userID;

        // Trigger the events.
        if (authUserID) {
            $(instance).trigger('authChanged', [true]);
            $(instance).trigger('onAuth');
        }
        else {
            $(instance).trigger('authChanged', [false]);
        }
    }

    // Returns false if not logged in.
    function getUserID() {
        if (!authUserID) {
            return false;
        }
        return authUserID;
    }

    function isAuth() {
        if (!authUserID) {
            return false;
        }
        return true;
    }



    /*
     * Initialization
     */

    // Authenticate as soon as the socket connects.
    socket.on("connected", function() {
        // Authenticate this socket session if the authToken is present.
        var notAuth = authenticate(function() {
            // Trigger the custom event.
            $(socket).trigger("connected_and_auth");
        }, function(err) {
            // Trigger the custom event.
            $(socket).trigger("connected_and_auth");

            // Log.
            console.log("BitMonster: failed to authenticate");
            if (err) { console.log("error message: " + err); }

            // Show a notification.
            bm.notification({
                title: tr.auth.FailedTitle,
                text: tr.auth.FailedText,
            }).show(10000);
        });

        // Trigger the custom event if no authentication was done.
        if (!notAuth) {
            $(socket).trigger("connected_and_auth");
        }
    });

    // Authenticate if the event is triggered.
    module.on("reauthenticate", function() {
        authenticate(undefined, function(err) {
            // Log.
            console.log("BitMonster: failed to reauthenticate");
            if (err) { console.log("error message: " + err); }

            // Show a notification.
            bm.notification({
                title: tr.auth.FailedTitle,
                text: tr.auth.FailedText,
            }).show(10000);
        });
    });



     /*
      * Return the authentication object.
      */
     return instance;
})();


    // Return the newly created BitMonster object.
    return bm;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJCaXRNb25zdGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vLyBJbmNsdWRlIHRoZSByZXF1aXJlZCBsaWJyYXJpZXMgZGlyZWN0bHkuXG52YXIgZ2x1ZT1mdW5jdGlvbihlLG4pe1widXNlIHN0cmljdFwiO3ZhciB0LG8saSxjLHIsYSxzLHUsbD1mdW5jdGlvbigpe3ZhciB0LG89e307cmV0dXJuIG8ub3Blbj1mdW5jdGlvbigpe3RyeXt2YXIgaTtpPWUubWF0Y2goXCJeaHR0cHM6Ly9cIik/XCJ3c3NcIitlLnN1YnN0cig1KTpcIndzXCIrZS5zdWJzdHIoNCksaSs9bi5iYXNlVVJMK1wid3NcIix0PW5ldyBXZWJTb2NrZXQoaSksdC5vbm1lc3NhZ2U9ZnVuY3Rpb24oZSl7by5vbk1lc3NhZ2UoZS5kYXRhLnRvU3RyaW5nKCkpfSx0Lm9uZXJyb3I9ZnVuY3Rpb24oZSl7dmFyIG49XCJ0aGUgd2Vic29ja2V0IGNsb3NlZCB0aGUgY29ubmVjdGlvbiB3aXRoIFwiO24rPWUuY29kZT9cInRoZSBlcnJvciBjb2RlOiBcIitlLmNvZGU6XCJhbiBlcnJvci5cIixvLm9uRXJyb3Iobil9LHQub25jbG9zZT1mdW5jdGlvbigpe28ub25DbG9zZSgpfSx0Lm9ub3Blbj1mdW5jdGlvbigpe28ub25PcGVuKCl9fWNhdGNoKGMpe28ub25FcnJvcigpfX0sby5zZW5kPWZ1bmN0aW9uKGUpe3Quc2VuZChlKX0sby5yZXNldD1mdW5jdGlvbigpe3QmJnQuY2xvc2UoKSx0PXZvaWQgMH0sb30sZD1mdW5jdGlvbigpe3ZhciB0LG8saSxjPWUrbi5iYXNlVVJMK1wiYWpheFwiLHI9OGUzLGE9NDVlMyxzPXtUaW1lb3V0OlwidFwiLENsb3NlZDpcImNcIn0sdT17RGVsaW1pdGVyOlwiJlwiLEluaXQ6XCJpXCIsUHVzaDpcInVcIixQb2xsOlwib1wifSxsPXt9LGQ9ITEsZj0hMSxnPWZ1bmN0aW9uKCl7aT1mdW5jdGlvbigpe30sZCYmZC5hYm9ydCgpLGYmJmYuYWJvcnQoKX0sdj1mdW5jdGlvbigpe2coKSxsLm9uQ2xvc2UoKX0sbT1mdW5jdGlvbihlKXtnKCksZT1lP1widGhlIGFqYXggc29ja2V0IGNsb3NlZCB0aGUgY29ubmVjdGlvbiB3aXRoIHRoZSBlcnJvcjogXCIrZTpcInRoZSBhamF4IHNvY2tldCBjbG9zZWQgdGhlIGNvbm5lY3Rpb24gd2l0aCBhbiBlcnJvci5cIixsLm9uRXJyb3IoZSl9LGg9ZnVuY3Rpb24oZSxuKXtmPSQuYWpheCh7dXJsOmMsc3VjY2VzczpmdW5jdGlvbihlKXtmPSExLG4mJm4oZSl9LGVycm9yOmZ1bmN0aW9uKGUsbil7Zj0hMSxtKG4pfSx0eXBlOlwiUE9TVFwiLGRhdGE6ZSxkYXRhVHlwZTpcInRleHRcIix0aW1lb3V0OnJ9KX07cmV0dXJuIGk9ZnVuY3Rpb24oKXtkPSQuYWpheCh7dXJsOmMsc3VjY2VzczpmdW5jdGlvbihlKXtpZihkPSExLGU9PXMuVGltZW91dClyZXR1cm4gdm9pZCBpKCk7aWYoZT09cy5DbG9zZWQpcmV0dXJuIHZvaWQgdigpO3ZhciBuPWUuaW5kZXhPZih1LkRlbGltaXRlcik7cmV0dXJuIDA+bj92b2lkIG0oXCJhamF4IHNvY2tldDogZmFpbGVkIHRvIHNwbGl0IHBvbGwgdG9rZW4gZnJvbSBkYXRhIVwiKToobz1lLnN1YnN0cmluZygwLG4pLGU9ZS5zdWJzdHIobisxKSxpKCksdm9pZCBsLm9uTWVzc2FnZShlKSl9LGVycm9yOmZ1bmN0aW9uKGUsbil7ZD0hMSxtKG4pfSx0eXBlOlwiUE9TVFwiLGRhdGE6dS5Qb2xsK3QrdS5EZWxpbWl0ZXIrbyxkYXRhVHlwZTpcInRleHRcIix0aW1lb3V0OmF9KX0sbC5vcGVuPWZ1bmN0aW9uKCl7aCh1LkluaXQsZnVuY3Rpb24oZSl7dmFyIG49ZS5pbmRleE9mKHUuRGVsaW1pdGVyKTtyZXR1cm4gMD5uP3ZvaWQgbShcImFqYXggc29ja2V0OiBmYWlsZWQgdG8gc3BsaXQgdWlkIGFuZCBwb2xsIHRva2VuIGZyb20gZGF0YSFcIik6KHQ9ZS5zdWJzdHJpbmcoMCxuKSxvPWUuc3Vic3RyKG4rMSksaSgpLHZvaWQgbC5vbk9wZW4oKSl9KX0sbC5zZW5kPWZ1bmN0aW9uKGUpe2godS5QdXNoK3QrdS5EZWxpbWl0ZXIrZSl9LGwucmVzZXQ9ZnVuY3Rpb24oKXtnKCl9LGx9LGY9XCIxLjYuMFwiLGc9XCJtXCIsdj17V2ViU29ja2V0OlwiV2ViU29ja2V0XCIsQWpheFNvY2tldDpcIkFqYXhTb2NrZXRcIn0sbT17TGVuOjIsSW5pdDpcImluXCIsUGluZzpcInBpXCIsUG9uZzpcInBvXCIsQ2xvc2U6XCJjbFwiLEludmFsaWQ6XCJpdlwiLERvbnRBdXRvUmVjb25uZWN0OlwiZHJcIixDaGFubmVsRGF0YTpcImNkXCJ9LGg9e0Rpc2Nvbm5lY3RlZDpcImRpc2Nvbm5lY3RlZFwiLENvbm5lY3Rpbmc6XCJjb25uZWN0aW5nXCIsUmVjb25uZWN0aW5nOlwicmVjb25uZWN0aW5nXCIsQ29ubmVjdGVkOlwiY29ubmVjdGVkXCJ9LHA9e2Jhc2VVUkw6XCIvZ2x1ZS9cIixmb3JjZVNvY2tldFR5cGU6ITEsY29ubmVjdFRpbWVvdXQ6MWU0LHBpbmdJbnRlcnZhbDozNWUzLHBpbmdSZWNvbm5lY3RUaW1lb3V0OjVlMyxyZWNvbm5lY3Q6ITAscmVjb25uZWN0RGVsYXk6MWUzLHJlY29ubmVjdERlbGF5TWF4OjVlMyxyZWNvbm5lY3RBdHRlbXB0czoxMCxyZXNldFNlbmRCdWZmZXJUaW1lb3V0OjFlNH0sYj0hMSxrPSExLEQ9aC5EaXNjb25uZWN0ZWQsVD0wLHg9ITEseT0hMSxTPSExLEM9ITEsTT1bXSx3PSExLFI9ITEsTz0hMSxJPVtdLEw9XCJcIixQPWZ1bmN0aW9uKCl7dmFyIGU9XCImXCIsbj17fTtyZXR1cm4gbi51bm1hcnNoYWxWYWx1ZXM9ZnVuY3Rpb24obil7aWYoIW4pcmV0dXJuITE7dmFyIHQ9bi5pbmRleE9mKGUpLG89cGFyc2VJbnQobi5zdWJzdHJpbmcoMCx0KSwxMCk7aWYobj1uLnN1YnN0cmluZyh0KzEpLDA+b3x8bz5uLmxlbmd0aClyZXR1cm4hMTt2YXIgaT1uLnN1YnN0cigwLG8pLGM9bi5zdWJzdHIobyk7cmV0dXJue2ZpcnN0Omksc2Vjb25kOmN9fSxuLm1hcnNoYWxWYWx1ZXM9ZnVuY3Rpb24obix0KXtyZXR1cm4gU3RyaW5nKG4ubGVuZ3RoKStlK24rdH0sbn0oKSxqPWZ1bmN0aW9uKCl7dmFyIGU9e30sbj17fSx0PWZ1bmN0aW9uKGUpe3ZhciBuPXtvbk1lc3NhZ2VGdW5jOmZ1bmN0aW9uKCl7fX07cmV0dXJuIG4uaW5zdGFuY2U9e29uTWVzc2FnZTpmdW5jdGlvbihlKXtuLm9uTWVzc2FnZUZ1bmM9ZX0sc2VuZDpmdW5jdGlvbihuLHQpe3JldHVybiBuP2EobS5DaGFubmVsRGF0YSxQLm1hcnNoYWxWYWx1ZXMoZSxuKSx0KTotMX19LG59O3JldHVybiBlLmdldD1mdW5jdGlvbihlKXtpZighZSlyZXR1cm4hMTt2YXIgbz1uW2VdO3JldHVybiBvP28uaW5zdGFuY2U6KG89dChlKSxuW2VdPW8sby5pbnN0YW5jZSl9LGUuZW1pdE9uTWVzc2FnZT1mdW5jdGlvbihlLHQpe2lmKGUmJnQpe3ZhciBvPW5bZV07aWYoIW8pcmV0dXJuIHZvaWQgY29uc29sZS5sb2coXCJnbHVlOiBjaGFubmVsICdcIitlK1wiJzogZW1pdCBvbk1lc3NhZ2UgZXZlbnQ6IGNoYW5uZWwgZG9lcyBub3QgZXhpc3RzXCIpO3RyeXtvLm9uTWVzc2FnZUZ1bmModCl9Y2F0Y2goaSl7cmV0dXJuIHZvaWQgY29uc29sZS5sb2coXCJnbHVlOiBjaGFubmVsICdcIitlK1wiJzogb25NZXNzYWdlIGV2ZW50IGNhbGwgZmFpbGVkOiBcIitpLm1lc3NhZ2UpfX19LGV9KCk7cj1mdW5jdGlvbihlKXtyZXR1cm4gYj9PP3ZvaWQgYi5zZW5kKGUpOnZvaWQgSS5wdXNoKGUpOnZvaWQgMH07dmFyIEE9ZnVuY3Rpb24oKXtpZigwIT09SS5sZW5ndGgpe2Zvcih2YXIgZT0wO2U8SS5sZW5ndGg7ZSsrKXIoSVtlXSk7ST1bXX19LFU9ZnVuY3Rpb24oKXtSPSExLHchPT0hMSYmKGNsZWFyVGltZW91dCh3KSx3PSExKX0sVz1mdW5jdGlvbigpe3chPT0hMXx8Unx8KHc9c2V0VGltZW91dChmdW5jdGlvbigpe2lmKHc9ITEsUj0hMCwwIT09TS5sZW5ndGgpe2Zvcih2YXIgZSxuPTA7bjxNLmxlbmd0aDtuKyspaWYoZT1NW25dLGUuZGlzY2FyZENhbGxiYWNrJiYkLmlzRnVuY3Rpb24oZS5kaXNjYXJkQ2FsbGJhY2spKXRyeXtlLmRpc2NhcmRDYWxsYmFjayhlLmRhdGEpfWNhdGNoKHQpe2NvbnNvbGUubG9nKFwiZ2x1ZTogZmFpbGVkIHRvIGNhbGwgZGlzY2FyZCBjYWxsYmFjazogXCIrdC5tZXNzYWdlKX11KFwiZGlzY2FyZF9zZW5kX2J1ZmZlclwiKSxNPVtdfX0sbi5yZXNldFNlbmRCdWZmZXJUaW1lb3V0KSl9LEU9ZnVuY3Rpb24oKXtpZihVKCksMCE9PU0ubGVuZ3RoKXtmb3IodmFyIGUsbj0wO248TS5sZW5ndGg7bisrKWU9TVtuXSxyKGUuY21kK2UuZGF0YSk7TT1bXX19O2E9ZnVuY3Rpb24oZSxuLHQpe3JldHVybiBufHwobj1cIlwiKSxiJiZEPT09aC5Db25uZWN0ZWQ/KHIoZStuKSwxKTpSPyh0JiYkLmlzRnVuY3Rpb24odCkmJnQobiksLTEpOihXKCksTS5wdXNoKHtjbWQ6ZSxkYXRhOm4sZGlzY2FyZENhbGxiYWNrOnR9KSwwKX07dmFyIEY9ZnVuY3Rpb24oKXt5IT09ITEmJihjbGVhclRpbWVvdXQoeSkseT0hMSl9LHE9ZnVuY3Rpb24oKXtGKCkseT1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7eT0hMSx1KFwiY29ubmVjdF90aW1lb3V0XCIpLHMoKX0sbi5jb25uZWN0VGltZW91dCl9LFY9ZnVuY3Rpb24oKXtTIT09ITEmJihjbGVhclRpbWVvdXQoUyksUz0hMSksQyE9PSExJiYoY2xlYXJUaW1lb3V0KEMpLEM9ITEpfSxfPWZ1bmN0aW9uKCl7VigpLFM9c2V0VGltZW91dChmdW5jdGlvbigpe1M9ITEscihtLlBpbmcpLEM9c2V0VGltZW91dChmdW5jdGlvbigpe0M9ITEsdShcInRpbWVvdXRcIikscygpfSxuLnBpbmdSZWNvbm5lY3RUaW1lb3V0KX0sbi5waW5nSW50ZXJ2YWwpfSx6PWZ1bmN0aW9uKCl7cmV0dXJuIGs/dm9pZChiPW8oKSk6VD4xPyhvPWQsYj1vKCksdm9pZChpPXYuQWpheFNvY2tldCkpOighbi5mb3JjZVNvY2tldFR5cGUmJndpbmRvdy5XZWJTb2NrZXR8fG4uZm9yY2VTb2NrZXRUeXBlPT09di5XZWJTb2NrZXQ/KG89bCxpPXYuV2ViU29ja2V0KToobz1kLGk9di5BamF4U29ja2V0KSx2b2lkKGI9bygpKSl9LEI9ZnVuY3Rpb24oZSl7cmV0dXJuIGU9SlNPTi5wYXJzZShlKSxlLnNvY2tldElEPyhMPWUuc29ja2V0SUQsTz0hMCxBKCksRD1oLkNvbm5lY3RlZCx1KFwiY29ubmVjdGVkXCIpLHZvaWQgc2V0VGltZW91dChFLDApKTooYygpLHZvaWQgY29uc29sZS5sb2coXCJnbHVlOiBzb2NrZXQgaW5pdGlhbGl6YXRpb24gZmFpbGVkOiBpbnZhbGlkIGluaXRpYWxpemF0aW9uIGRhdGEgcmVjZWl2ZWRcIikpfSxKPWZ1bmN0aW9uKCl7eigpLGIub25PcGVuPWZ1bmN0aW9uKCl7RigpLFQ9MCxrPSEwLF8oKTt2YXIgZT17dmVyc2lvbjpmfTtlPUpTT04uc3RyaW5naWZ5KGUpLGIuc2VuZChtLkluaXQrZSl9LGIub25DbG9zZT1mdW5jdGlvbigpe3MoKX0sYi5vbkVycm9yPWZ1bmN0aW9uKGUpe3UoXCJlcnJvclwiLFtlXSkscygpfSxiLm9uTWVzc2FnZT1mdW5jdGlvbihlKXtpZihfKCksZS5sZW5ndGg8bS5MZW4pcmV0dXJuIHZvaWQgY29uc29sZS5sb2coXCJnbHVlOiByZWNlaXZlZCBpbnZhbGlkIGRhdGEgZnJvbSBzZXJ2ZXI6IGRhdGEgaXMgdG9vIHNob3J0LlwiKTt2YXIgbj1lLnN1YnN0cigwLG0uTGVuKTtpZihlPWUuc3Vic3RyKG0uTGVuKSxuPT09bS5QaW5nKXIobS5Qb25nKTtlbHNlIGlmKG49PT1tLlBvbmcpO2Vsc2UgaWYobj09PW0uSW52YWxpZCljb25zb2xlLmxvZyhcImdsdWU6IHNlcnZlciByZXBsaWVkIHdpdGggYW4gaW52YWxpZCByZXF1ZXN0IG5vdGlmaWNhdGlvbiFcIik7ZWxzZSBpZihuPT09bS5Eb250QXV0b1JlY29ubmVjdCl4PSEwLGNvbnNvbGUubG9nKFwiZ2x1ZTogc2VydmVyIHJlcGxpZWQgd2l0aCBhbiBkb24ndCBhdXRvbWF0aWNhbGx5IHJlY29ubmVjdCByZXF1ZXN0LiBUaGlzIG1pZ2h0IGJlIGR1ZSB0byBhbiBpbmNvbXBhdGlibGUgcHJvdG9jb2wgdmVyc2lvbi5cIik7ZWxzZSBpZihuPT09bS5Jbml0KUIoZSk7ZWxzZSBpZihuPT09bS5DaGFubmVsRGF0YSl7dmFyIHQ9UC51bm1hcnNoYWxWYWx1ZXMoZSk7aWYoIXQpcmV0dXJuIHZvaWQgY29uc29sZS5sb2coXCJnbHVlOiBzZXJ2ZXIgcmVxdWVzdGVkIGFuIGludmFsaWQgY2hhbm5lbCBkYXRhIHJlcXVlc3Q6IFwiK2UpO2ouZW1pdE9uTWVzc2FnZSh0LmZpcnN0LHQuc2Vjb25kKX1lbHNlIGNvbnNvbGUubG9nKFwiZ2x1ZTogcmVjZWl2ZWQgaW52YWxpZCBkYXRhIGZyb20gc2VydmVyIHdpdGggY29tbWFuZCAnXCIrbitcIicgYW5kIGRhdGEgJ1wiK2UrXCInIVwiKX0sc2V0VGltZW91dChmdW5jdGlvbigpe1Q+MD8oRD1oLlJlY29ubmVjdGluZyx1KFwicmVjb25uZWN0aW5nXCIpKTooRD1oLkNvbm5lY3RpbmcsdShcImNvbm5lY3RpbmdcIikpLHEoKSxiLm9wZW4oKX0sMCl9LE49ZnVuY3Rpb24oKXtGKCksVigpLE89ITEsTD1cIlwiLEk9W10sYiYmKGIub25PcGVuPWIub25DbG9zZT1iLm9uTWVzc2FnZT1iLm9uRXJyb3I9ZnVuY3Rpb24oKXt9LGIucmVzZXQoKSxiPSExKX07aWYocz1mdW5jdGlvbigpe2lmKE4oKSxuLnJlY29ubmVjdEF0dGVtcHRzPjAmJlQ+bi5yZWNvbm5lY3RBdHRlbXB0c3x8bi5yZWNvbm5lY3Q9PT0hMXx8eClyZXR1cm4gRD1oLkRpc2Nvbm5lY3RlZCx2b2lkIHUoXCJkaXNjb25uZWN0ZWRcIik7VCs9MTt2YXIgZT1uLnJlY29ubmVjdERlbGF5KlQ7ZT5uLnJlY29ubmVjdERlbGF5TWF4JiYoZT1uLnJlY29ubmVjdERlbGF5TWF4KSxzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7SigpfSxlKX0sYz1mdW5jdGlvbigpe2ImJihyKG0uQ2xvc2UpLE4oKSxEPWguRGlzY29ubmVjdGVkLHUoXCJkaXNjb25uZWN0ZWRcIikpfSx0PWouZ2V0KGcpLGV8fChlPXdpbmRvdy5sb2NhdGlvbi5wcm90b2NvbCtcIi8vXCIrd2luZG93LmxvY2F0aW9uLmhvc3QpLCFlLm1hdGNoKFwiXmh0dHA6Ly9cIikmJiFlLm1hdGNoKFwiXmh0dHBzOi8vXCIpKXJldHVybiB2b2lkIGNvbnNvbGUubG9nKFwiZ2x1ZTogaW52YWxpZCBob3N0OiBtaXNzaW5nICdodHRwOi8vJyBvciAnaHR0cHM6Ly8nIVwiKTtuPSQuZXh0ZW5kKHAsbiksbi5yZWNvbm5lY3REZWxheU1heDxuLnJlY29ubmVjdERlbGF5JiYobi5yZWNvbm5lY3REZWxheU1heD1uLnJlY29ubmVjdERlbGF5KSwwIT09bi5iYXNlVVJMLmluZGV4T2YoXCIvXCIpJiYobi5iYXNlVVJMPVwiL1wiK24uYmFzZVVSTCksXCIvXCIhPT1uLmJhc2VVUkwuc2xpY2UoLTEpJiYobi5iYXNlVVJMPW4uYmFzZVVSTCtcIi9cIiksSigpO3ZhciBIPXt2ZXJzaW9uOmZ1bmN0aW9uKCl7cmV0dXJuIGZ9LHR5cGU6ZnVuY3Rpb24oKXtyZXR1cm4gaX0sc3RhdGU6ZnVuY3Rpb24oKXtyZXR1cm4gRH0sc29ja2V0SUQ6ZnVuY3Rpb24oKXtyZXR1cm4gTH0sc2VuZDpmdW5jdGlvbihlLG4pe3Quc2VuZChlLG4pfSxvbk1lc3NhZ2U6ZnVuY3Rpb24oZSl7dC5vbk1lc3NhZ2UoZSl9LG9uOmZ1bmN0aW9uKCl7dmFyIGU9JChIKTtlLm9uLmFwcGx5KGUsYXJndW1lbnRzKX0scmVjb25uZWN0OmZ1bmN0aW9uKCl7RD09PWguRGlzY29ubmVjdGVkJiYoVD0wLHg9ITEscygpKX0sY2xvc2U6ZnVuY3Rpb24oKXtjKCl9LGNoYW5uZWw6ZnVuY3Rpb24oZSl7cmV0dXJuIGouZ2V0KGUpfX07cmV0dXJuIHU9ZnVuY3Rpb24oKXt2YXIgZT0kKEgpO2UudHJpZ2dlckhhbmRsZXIuYXBwbHkoZSxhcmd1bWVudHMpfSxIfTtcblxuLy8gSW5jbHVkZSB0aGUgcG9seWZpbGxzLlxuLypcbiAqICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuICogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbi8vIE9iamVjdC5rZXlzIHBvbHlmaWxsLlxuLy8gRnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3Qva2V5c1xuaWYgKCFPYmplY3Qua2V5cykge1xuICBPYmplY3Qua2V5cyA9IChmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxcbiAgICAgICAgaGFzRG9udEVudW1CdWcgPSAhKHsgdG9TdHJpbmc6IG51bGwgfSkucHJvcGVydHlJc0VudW1lcmFibGUoJ3RvU3RyaW5nJyksXG4gICAgICAgIGRvbnRFbnVtcyA9IFtcbiAgICAgICAgICAndG9TdHJpbmcnLFxuICAgICAgICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAgICAgJ3ZhbHVlT2YnLFxuICAgICAgICAgICdoYXNPd25Qcm9wZXJ0eScsXG4gICAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICAgICAgICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICAgICAgICAgJ2NvbnN0cnVjdG9yJ1xuICAgICAgICBdLFxuICAgICAgICBkb250RW51bXNMZW5ndGggPSBkb250RW51bXMubGVuZ3RoO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG9iaikge1xuICAgICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnICYmICh0eXBlb2Ygb2JqICE9PSAnZnVuY3Rpb24nIHx8IG9iaiA9PT0gbnVsbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmtleXMgY2FsbGVkIG9uIG5vbi1vYmplY3QnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlc3VsdCA9IFtdLCBwcm9wLCBpO1xuXG4gICAgICBmb3IgKHByb3AgaW4gb2JqKSB7XG4gICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChwcm9wKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoaGFzRG9udEVudW1CdWcpIHtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGRvbnRFbnVtc0xlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCBkb250RW51bXNbaV0pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChkb250RW51bXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9KCkpO1xufVxuXG5cblxudmFyIEJpdE1vbnN0ZXIgPSBmdW5jdGlvbihob3N0KSB7XG4gICAgLy8gVHVybiBvbiBzdHJpY3QgbW9kZS5cbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICAvLyBCaXRNb25zdGVyIG9iamVjdFxuICAgIHZhciBibSA9IHt9O1xuXG4gICAgLy8gSW5jbHVkZSB0aGUgZGVwZW5kZW5jaWVzLlxuICAgIC8qXG4qICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuKiAgQ29weXJpZ2h0IChDKSAyMDE1ICBSb2xhbmQgU2luZ2VyIDxyb2xhbmQuc2luZ2VyW2F0XWRlc2VydGJpdC5jb20+XG4qXG4qICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuKiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4qICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuKlxuKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4qICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbipcbiogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4qICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiovXG5cbi8qXG4gKiAgVGhpcyBjb2RlIGxpdmVzIGluc2lkZSB0aGUgQml0TW9uc3RlciBmdW5jdGlvbi5cbiAqL1xuXG52YXIgdXRpbHMgPSAoZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICAgKiBDb25zdGFudHNcbiAgICAgKi9cblxuICAgIHZhciBEZWxpbWl0ZXIgPSBcIiZcIjtcblxuXG5cbiAgICAvKlxuICAgICAqIFZhcmlhYmxlc1xuICAgICAqL1xuXG4gICAgIHZhciBpbnN0YW5jZSA9IHt9OyAvLyBPdXIgcHVibGljIGluc3RhbmNlIG9iamVjdCByZXR1cm5lZCBieSB0aGlzIGZ1bmN0aW9uLlxuXG5cblxuICAgICAvKlxuICAgICAgKiBQcml2YXRlIE1ldGhvZHNcbiAgICAgICovXG5cbiAgICAgLyoqXG4gICAgICAqIEpTIEltcGxlbWVudGF0aW9uIG9mIE11cm11ckhhc2gzIChyMTM2KSAoYXMgb2YgTWF5IDIwLCAyMDExKVxuICAgICAgKlxuICAgICAgKiBAYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86Z2FyeS5jb3VydEBnbWFpbC5jb21cIj5HYXJ5IENvdXJ0PC9hPlxuICAgICAgKiBAc2VlIGh0dHA6Ly9naXRodWIuY29tL2dhcnljb3VydC9tdXJtdXJoYXNoLWpzXG4gICAgICAqIEBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzphYXBwbGVieUBnbWFpbC5jb21cIj5BdXN0aW4gQXBwbGVieTwvYT5cbiAgICAgICogQHNlZSBodHRwOi8vc2l0ZXMuZ29vZ2xlLmNvbS9zaXRlL211cm11cmhhc2gvXG4gICAgICAqXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgQVNDSUkgb25seVxuICAgICAgKiBAcGFyYW0ge251bWJlcn0gc2VlZCBQb3NpdGl2ZSBpbnRlZ2VyIG9ubHlcbiAgICAgICogQHJldHVybiB7bnVtYmVyfSAzMi1iaXQgcG9zaXRpdmUgaW50ZWdlciBoYXNoXG4gICAgICAqL1xuICAgICB2YXIgbXVybXVyaGFzaDNfMzJfZ2MgPSBmdW5jdGlvbihrZXksIHNlZWQpIHtcbiAgICAgXHR2YXIgcmVtYWluZGVyLCBieXRlcywgaDEsIGgxYiwgYzEsIGMxYiwgYzIsIGMyYiwgazEsIGk7XG5cbiAgICAgXHRyZW1haW5kZXIgPSBrZXkubGVuZ3RoICYgMzsgLy8ga2V5Lmxlbmd0aCAlIDRcbiAgICAgXHRieXRlcyA9IGtleS5sZW5ndGggLSByZW1haW5kZXI7XG4gICAgIFx0aDEgPSBzZWVkO1xuICAgICBcdGMxID0gMHhjYzllMmQ1MTtcbiAgICAgXHRjMiA9IDB4MWI4NzM1OTM7XG4gICAgIFx0aSA9IDA7XG5cbiAgICAgXHR3aGlsZSAoaSA8IGJ5dGVzKSB7XG4gICAgIFx0ICBcdGsxID1cbiAgICAgXHQgIFx0ICAoKGtleS5jaGFyQ29kZUF0KGkpICYgMHhmZikpIHxcbiAgICAgXHQgIFx0ICAoKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCA4KSB8XG4gICAgIFx0ICBcdCAgKChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgMTYpIHxcbiAgICAgXHQgIFx0ICAoKGtleS5jaGFyQ29kZUF0KCsraSkgJiAweGZmKSA8PCAyNCk7XG4gICAgIFx0XHQrK2k7XG5cbiAgICAgXHRcdGsxID0gKCgoKGsxICYgMHhmZmZmKSAqIGMxKSArICgoKChrMSA+Pj4gMTYpICogYzEpICYgMHhmZmZmKSA8PCAxNikpKSAmIDB4ZmZmZmZmZmY7XG4gICAgIFx0XHRrMSA9IChrMSA8PCAxNSkgfCAoazEgPj4+IDE3KTtcbiAgICAgXHRcdGsxID0gKCgoKGsxICYgMHhmZmZmKSAqIGMyKSArICgoKChrMSA+Pj4gMTYpICogYzIpICYgMHhmZmZmKSA8PCAxNikpKSAmIDB4ZmZmZmZmZmY7XG5cbiAgICAgXHRcdGgxIF49IGsxO1xuICAgICAgICAgICAgIGgxID0gKGgxIDw8IDEzKSB8IChoMSA+Pj4gMTkpO1xuICAgICBcdFx0aDFiID0gKCgoKGgxICYgMHhmZmZmKSAqIDUpICsgKCgoKGgxID4+PiAxNikgKiA1KSAmIDB4ZmZmZikgPDwgMTYpKSkgJiAweGZmZmZmZmZmO1xuICAgICBcdFx0aDEgPSAoKChoMWIgJiAweGZmZmYpICsgMHg2YjY0KSArICgoKChoMWIgPj4+IDE2KSArIDB4ZTY1NCkgJiAweGZmZmYpIDw8IDE2KSk7XG4gICAgIFx0fVxuXG4gICAgIFx0azEgPSAwO1xuXG4gICAgIFx0c3dpdGNoIChyZW1haW5kZXIpIHtcbiAgICAgXHRcdGNhc2UgMzogazEgXj0gKGtleS5jaGFyQ29kZUF0KGkgKyAyKSAmIDB4ZmYpIDw8IDE2O1xuICAgICBcdFx0Y2FzZSAyOiBrMSBePSAoa2V5LmNoYXJDb2RlQXQoaSArIDEpICYgMHhmZikgPDwgODtcbiAgICAgXHRcdGNhc2UgMTogazEgXj0gKGtleS5jaGFyQ29kZUF0KGkpICYgMHhmZik7XG5cbiAgICAgXHRcdGsxID0gKCgoazEgJiAweGZmZmYpICogYzEpICsgKCgoKGsxID4+PiAxNikgKiBjMSkgJiAweGZmZmYpIDw8IDE2KSkgJiAweGZmZmZmZmZmO1xuICAgICBcdFx0azEgPSAoazEgPDwgMTUpIHwgKGsxID4+PiAxNyk7XG4gICAgIFx0XHRrMSA9ICgoKGsxICYgMHhmZmZmKSAqIGMyKSArICgoKChrMSA+Pj4gMTYpICogYzIpICYgMHhmZmZmKSA8PCAxNikpICYgMHhmZmZmZmZmZjtcbiAgICAgXHRcdGgxIF49IGsxO1xuICAgICBcdH1cblxuICAgICBcdGgxIF49IGtleS5sZW5ndGg7XG5cbiAgICAgXHRoMSBePSBoMSA+Pj4gMTY7XG4gICAgIFx0aDEgPSAoKChoMSAmIDB4ZmZmZikgKiAweDg1ZWJjYTZiKSArICgoKChoMSA+Pj4gMTYpICogMHg4NWViY2E2YikgJiAweGZmZmYpIDw8IDE2KSkgJiAweGZmZmZmZmZmO1xuICAgICBcdGgxIF49IGgxID4+PiAxMztcbiAgICAgXHRoMSA9ICgoKChoMSAmIDB4ZmZmZikgKiAweGMyYjJhZTM1KSArICgoKChoMSA+Pj4gMTYpICogMHhjMmIyYWUzNSkgJiAweGZmZmYpIDw8IDE2KSkpICYgMHhmZmZmZmZmZjtcbiAgICAgXHRoMSBePSBoMSA+Pj4gMTY7XG5cbiAgICAgXHRyZXR1cm4gaDEgPj4+IDA7XG4gICAgfTtcblxuXG5cbiAgICAvKlxuICAgICAqIFB1YmxpYyBNZXRob2RzXG4gICAgICovXG5cbiAgICAvLyBzdG9yYWdlQXZhaWxhYmxlIHRlc3RzIGlmIHRoZSBzdG9yYWdlIHR5cGUgaXMgc3VwcG9ydGVkLlxuICAgIGluc3RhbmNlLnN0b3JhZ2VBdmFpbGFibGUgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgc3RvcmFnZSA9IHdpbmRvd1t0eXBlXSxcbiAgICAgICAgICAgIHggPSAnX19zdG9yYWdlX3Rlc3RfXyc7XG4gICAgICAgICAgICBzdG9yYWdlLnNldEl0ZW0oeCwgeCk7XG4gICAgICAgICAgICBzdG9yYWdlLnJlbW92ZUl0ZW0oeCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gY2FsbENhdGNoIGNhbGxzIGEgY2FsbGJhY2sgYW5kIGNhdGNoZXMgZXhjZXB0aW9ucyB3aGljaCBhcmUgbG9nZ2VkLlxuICAgIC8vIEFyZ3VtZW50cyBhcmUgcGFzc2VkIHRvIHRoZSBjYWxsYmFjay5cbiAgICBpbnN0YW5jZS5jYWxsQ2F0Y2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIGZpcnN0IGFyZ3VtZW50LlxuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2hpZnQuY2FsbChhcmd1bWVudHMpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCaXRNb25zdGVyOiBjYXRjaGVkIGV4Y2VwdGlvbiB3aGlsZSBjYWxsaW5nIGNhbGxiYWNrOlwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGluc3RhbmNlLnJhbmRvbVN0cmluZyA9IGZ1bmN0aW9uKGxlbikge1xuICAgICAgICB2YXIgdGV4dCA9IFwiXCI7XG4gICAgICAgIHZhciBwb3NzaWJsZSA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODlcIjtcblxuICAgICAgICBmb3IoIHZhciBpPTA7IGkgPCBsZW47IGkrKyApIHtcbiAgICAgICAgICAgIHRleHQgKz0gcG9zc2libGUuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlLmxlbmd0aCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfTtcblxuICAgIC8vIHVubWFyc2hhbFZhbHVlcyBzcGxpdHMgdHdvIHZhbHVlcyBmcm9tIGEgc2luZ2xlIHN0cmluZy5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGlzIGNoYWluYWJsZSB0byBleHRyYWN0IG11bHRpcGxlIHZhbHVlcy5cbiAgICAvLyBBbiBvYmplY3Qgd2l0aCB0d28gc3RyaW5ncyAoZmlyc3QsIHNlY29uZCkgaXMgcmV0dXJuZWQuXG4gICAgaW5zdGFuY2UudW5tYXJzaGFsVmFsdWVzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmQgdGhlIGRlbGltaXRlciBwb3NpdGlvbi5cbiAgICAgICAgdmFyIHBvcyA9IGRhdGEuaW5kZXhPZihEZWxpbWl0ZXIpO1xuXG4gICAgICAgIC8vIEV4dHJhY3QgdGhlIHZhbHVlIGxlbmd0aCBpbnRlZ2VyIG9mIHRoZSBmaXJzdCB2YWx1ZS5cbiAgICAgICAgdmFyIGxlbiA9IHBhcnNlSW50KGRhdGEuc3Vic3RyaW5nKDAsIHBvcyksIDEwKTtcbiAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyaW5nKHBvcyArIDEpO1xuXG4gICAgICAgIC8vIFZhbGlkYXRlIHRoZSBsZW5ndGguXG4gICAgICAgIGlmIChsZW4gPCAwIHx8IGxlbiA+IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgc3BsaXQgdGhlIGZpcnN0IHZhbHVlIGZyb20gdGhlIHNlY29uZC5cbiAgICAgICAgdmFyIGZpcnN0ViA9IGRhdGEuc3Vic3RyKDAsIGxlbik7XG4gICAgICAgIHZhciBzZWNvbmRWID0gZGF0YS5zdWJzdHIobGVuKTtcblxuICAgICAgICAvLyBSZXR1cm4gYW4gb2JqZWN0IHdpdGggYm90aCB2YWx1ZXMuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaXJzdDogIGZpcnN0VixcbiAgICAgICAgICAgIHNlY29uZDogc2Vjb25kVlxuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvLyBtYXJzaGFsVmFsdWVzIGpvaW5zIHR3byB2YWx1ZXMgaW50byBhIHNpbmdsZSBzdHJpbmcuXG4gICAgLy8gVGhleSBjYW4gYmUgZGVjb2RlZCBieSB0aGUgdW5tYXJzaGFsVmFsdWVzIGZ1bmN0aW9uLlxuICAgIGluc3RhbmNlLm1hcnNoYWxWYWx1ZXMgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcoZmlyc3QubGVuZ3RoKSArIERlbGltaXRlciArIGZpcnN0ICsgc2Vjb25kO1xuICAgIH07XG5cbiAgICBpbnN0YW5jZS5icm93c2VyRmluZ2VycHJpbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gU291cmNlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2NhcmxvL2pxdWVyeS1icm93c2VyLWZpbmdlcnByaW50XG4gICAgICAgIC8vIFRPRE86IEltcHJvdmUgdGhlIGZpbmdlcnByaW50aW5nLlxuICAgICAgICB2YXIgZmluZ2VycHJpbnQgPSBbXG4gICAgICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50LFxuICAgICAgICAgICAgKCBuZXcgRGF0ZSgpICkuZ2V0VGltZXpvbmVPZmZzZXQoKSxcbiAgICAgICAgICAgICEhd2luZG93LnNlc3Npb25TdG9yYWdlLFxuICAgICAgICAgICAgISF3aW5kb3cubG9jYWxTdG9yYWdlLFxuICAgICAgICAgICAgJC5tYXAoIG5hdmlnYXRvci5wbHVnaW5zLCBmdW5jdGlvbihwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgcC5uYW1lLFxuICAgICAgICAgICAgICAgIHAuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgJC5tYXAoIHAsIGZ1bmN0aW9uKG10KSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gWyBtdC50eXBlLCBtdC5zdWZmaXhlcyBdLmpvaW4oXCJ+XCIpO1xuICAgICAgICAgICAgICAgIH0pLmpvaW4oXCIsXCIpXG4gICAgICAgICAgICAgIF0uam9pbihcIjo6XCIpO1xuICAgICAgICAgICAgfSkuam9pbihcIjtcIilcbiAgICAgIF0uam9pbihcIiMjI1wiKTtcblxuICAgICAgcmV0dXJuIFN0cmluZyhtdXJtdXJoYXNoM18zMl9nYyhmaW5nZXJwcmludCwgMHg4MDgwODA4MCkpO1xuICAgIH07XG5cbiAgICAvLyBBIGNvbXBsZXRlIGNvb2tpZXMgcmVhZGVyL3dyaXRlciBmcmFtZXdvcmsgd2l0aCBmdWxsIHVuaWNvZGUgc3VwcG9ydC5cbiAgICAvLyBTb3VyY2UgZnJvbSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvZG9jdW1lbnQuY29va2llXG4gICAgaW5zdGFuY2UuY29va2llcyA9IHtcbiAgICAgIGdldEl0ZW06IGZ1bmN0aW9uIChzS2V5KSB7XG4gICAgICAgIGlmICghc0tleSkgeyByZXR1cm4gbnVsbDsgfVxuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoPzooPzpefC4qOylcXFxccypcIiArIGVuY29kZVVSSUNvbXBvbmVudChzS2V5KS5yZXBsYWNlKC9bXFwtXFwuXFwrXFwqXS9nLCBcIlxcXFwkJlwiKSArIFwiXFxcXHMqXFxcXD1cXFxccyooW147XSopLiokKXxeLiokXCIpLCBcIiQxXCIpKSB8fCBudWxsO1xuICAgICAgfSxcbiAgICAgIHNldEl0ZW06IGZ1bmN0aW9uIChzS2V5LCBzVmFsdWUsIHZFbmQsIHNQYXRoLCBzRG9tYWluLCBiU2VjdXJlKSB7XG4gICAgICAgIGlmICghc0tleSB8fCAvXig/OmV4cGlyZXN8bWF4XFwtYWdlfHBhdGh8ZG9tYWlufHNlY3VyZSkkL2kudGVzdChzS2V5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgdmFyIHNFeHBpcmVzID0gXCJcIjtcbiAgICAgICAgaWYgKHZFbmQpIHtcbiAgICAgICAgICBzd2l0Y2ggKHZFbmQuY29uc3RydWN0b3IpIHtcbiAgICAgICAgICAgIGNhc2UgTnVtYmVyOlxuICAgICAgICAgICAgICBzRXhwaXJlcyA9IHZFbmQgPT09IEluZmluaXR5ID8gXCI7IGV4cGlyZXM9RnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBHTVRcIiA6IFwiOyBtYXgtYWdlPVwiICsgdkVuZDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFN0cmluZzpcbiAgICAgICAgICAgICAgc0V4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIHZFbmQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBEYXRlOlxuICAgICAgICAgICAgICBzRXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgdkVuZC50b1VUQ1N0cmluZygpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoc1ZhbHVlKSArIHNFeHBpcmVzICsgKHNEb21haW4gPyBcIjsgZG9tYWluPVwiICsgc0RvbWFpbiA6IFwiXCIpICsgKHNQYXRoID8gXCI7IHBhdGg9XCIgKyBzUGF0aCA6IFwiXCIpICsgKGJTZWN1cmUgPyBcIjsgc2VjdXJlXCIgOiBcIlwiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlSXRlbTogZnVuY3Rpb24gKHNLZXksIHNQYXRoLCBzRG9tYWluKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNJdGVtKHNLZXkpKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICBkb2N1bWVudC5jb29raWUgPSBlbmNvZGVVUklDb21wb25lbnQoc0tleSkgKyBcIj07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVRcIiArIChzRG9tYWluID8gXCI7IGRvbWFpbj1cIiArIHNEb21haW4gOiBcIlwiKSArIChzUGF0aCA/IFwiOyBwYXRoPVwiICsgc1BhdGggOiBcIlwiKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgaGFzSXRlbTogZnVuY3Rpb24gKHNLZXkpIHtcbiAgICAgICAgaWYgKCFzS2V5KSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICByZXR1cm4gKG5ldyBSZWdFeHAoXCIoPzpefDtcXFxccyopXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc0tleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XCIpKS50ZXN0KGRvY3VtZW50LmNvb2tpZSk7XG4gICAgICB9LFxuICAgICAga2V5czogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYUtleXMgPSBkb2N1bWVudC5jb29raWUucmVwbGFjZSgvKCg/Ol58XFxzKjspW15cXD1dKykoPz07fCQpfF5cXHMqfFxccyooPzpcXD1bXjtdKik/KD86XFwxfCQpL2csIFwiXCIpLnNwbGl0KC9cXHMqKD86XFw9W147XSopPztcXHMqLyk7XG4gICAgICAgIGZvciAodmFyIG5MZW4gPSBhS2V5cy5sZW5ndGgsIG5JZHggPSAwOyBuSWR4IDwgbkxlbjsgbklkeCsrKSB7IGFLZXlzW25JZHhdID0gZGVjb2RlVVJJQ29tcG9uZW50KGFLZXlzW25JZHhdKTsgfVxuICAgICAgICByZXR1cm4gYUtleXM7XG4gICAgICB9XG4gICAgfTtcblxuXG4gICAgcmV0dXJuIGluc3RhbmNlO1xufSkoKTtcblxuICAgIC8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vKlxuICogIFRoaXMgY29kZSBsaXZlcyBpbnNpZGUgdGhlIEJpdE1vbnN0ZXIgZnVuY3Rpb24uXG4gKi9cblxuXG4vLyBBIGxpc3Qgb2YgYXZhaWxhYmxlIHRyYW5zbGF0aW9ucy5cbnZhciB0cmFuc2xhdGlvbnMgPSB7XG5cdGVuOiAvKlxuICogIEJpdE1vbnN0ZXIgLSBBIE1vbnN0ZXIgaGFuZGxpbmcgeW91ciBCaXRzXG4gKiAgQ29weXJpZ2h0IChDKSAyMDE1ICBSb2xhbmQgU2luZ2VyIDxyb2xhbmQuc2luZ2VyW2F0XWRlc2VydGJpdC5jb20+XG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxue1xuXHRzb2NrZXQ6IHtcblx0XHRDb25uTG9zdFRpdGxlOiBcIkNvbm5lY3Rpb24gTG9zdFwiLFxuXHRcdENvbm5Mb3N0VGV4dDogIFwiVHJ5aW5nIHRvIHJlY29ubmVjdCB0byBTZXJ2ZXIuLi5cIixcblx0XHREaXNjYXJkTm90U2VuZERhdGFUaXRsZTogXCJVbnNlbmQgRGF0YVwiLFxuXHRcdERpc2NhcmROb3RTZW5kRGF0YVRleHQ6IFwiTm90IGFsbCBkYXRhIG1lc3NhZ2VzIGNvdWxkIGJlIHRyYW5zbWl0dGVkIHRvIHRoZSBzZXJ2ZXIhXCIsXG5cdFx0RGlzY29ubmVjdGVkVGl0bGU6IFwiRGlzY29ubmVjdGVkIGZyb20gU2VydmVyXCIsXG5cdFx0RGlzY29ubmVjdGVkVGV4dDogXCJDbGljayBoZXJlIHRvIHJlY29ubmVjdC5cIixcblx0fSxcblx0YXV0aDoge1xuXHRcdEZhaWxlZFRpdGxlOiBcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZFwiLFxuXHRcdEZhaWxlZFRleHQ6ICBcIkZhaWxlZCB0byBhdXRoZW50aWNhdGUgdGhpcyBzZXNzaW9uLlwiXG5cdH1cbn1cblxufTtcblxuLy8gVGhlIGN1cnJlbnQgdHJhbnNsYXRpb24uXG52YXIgdHIgPSB0cmFuc2xhdGlvbnNbJ2VuJ107XG5cbi8vIE9idGFpbiB0aGUgbG9jYWxlLlxudmFyIGxvY2FsZSA9IChuYXZpZ2F0b3IubGFuZ3VhZ2UgfHwgbmF2aWdhdG9yLmJyb3dzZXJMYW5ndWFnZSkuc3BsaXQoJy0nKVswXTtcblxuLy8gU2V0IHRvIHRoZSBjdXJyZW50IGxvY2FsZS5cbmlmIChsb2NhbGUgJiYgdHJhbnNsYXRpb25zW2xvY2FsZV0pIHtcblx0dHIgPSB0cmFuc2xhdGlvbnNbbG9jYWxlXTtcbn1cblxuICAgIC8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vKlxuICogIFRoaXMgY29kZSBsaXZlcyBpbnNpZGUgdGhlIEJpdE1vbnN0ZXIgZnVuY3Rpb24uXG4gKi9cblxuXG5ibS5ub3RpZmljYXRpb24gPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIC8qXG4gICAgICogQ29uc3RhbnRzXG4gICAgICovXG5cbiAgICAgdmFyIERlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgdGl0bGUgICAgICAgICA6IFwiXCIsXG4gICAgICAgICB0ZXh0ICAgICAgICAgIDogXCJcIixcbiAgICAgICAgIGRlc3Ryb3lPbkNsb3NlOiB0cnVlLFxuICAgICAgICAgaGlkZUNsb3NlICAgICA6IGZhbHNlXG4gICAgIH07XG5cblxuXG4gICAgLypcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKi9cblxuICAgICB2YXIgaWQgICAgICAgICA9IFwiYm0tbm90aWZpY2F0aW9uLVwiICsgdXRpbHMucmFuZG9tU3RyaW5nKDE0KSxcbiAgICAgICAgIHRpbWVvdXQgICAgPSBmYWxzZSxcbiBcdFx0IHdpZGdldEJvZHkgPSBcdCc8ZGl2IGlkPVwiJyArIGlkICsgJ1wiIGNsYXNzPVwiYm0tbm90aWZpY2F0aW9uXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXY+PGI+PC9iPjxiPjwvYj48Yj48L2I+PGI+PC9iPjwvZGl2PicgK1xuIFx0XHRcdFx0XHRcdFx0JzxwPjwvcD4nICtcbiBcdFx0XHRcdFx0XHRcdCc8c3Bhbj48L3NwYW4+JyArXG4gXHRcdFx0XHRcdFx0JzwvZGl2Pic7XG5cblxuXG4gICAgLypcbiAgICAgKiBQcml2YXRlIEZ1bmN0aW9uc1xuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gZ2V0V2lkZ2V0KCkge1xuICAgICAgICAvLyBUcnkgdG8gb2J0YWluIHRoZSB3aWRnZXQgb2JqZWN0LlxuICAgICAgICB2YXIgd2lkZ2V0ID0gJCgnIycgKyBpZCk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGl0IGlmIGl0IGV4aXN0cy5cbiAgICAgICAgaWYgKHdpZGdldC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB3aWRnZXQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgaXQgYW5kIHByZXBlbmQgaXQgdG8gdGhlIGRvY3VtZW50IGJvZHkuXG4gICAgICAgIHdpZGdldCA9ICQod2lkZ2V0Qm9keSk7XG4gICAgICAgICQoJ2JvZHknKS5wcmVwZW5kKHdpZGdldCk7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMuaGlkZUNsb3NlKSB7XG4gICAgICAgICAgICAkKCcjJyArIGlkICsgJyA+IGRpdicpLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gQmluZCBjbG9zZSBldmVudHMuXG4gICAgICAgICAgICAkKCcjJyArIGlkICsgJyA+IGRpdicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLmRlc3Ryb3lPbkNsb3NlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB3aWRnZXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VGl0bGUoc3RyKSB7XG4gICAgICAgIGdldFdpZGdldCgpLmZpbmQoXCJwXCIpLnRleHQoc3RyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRUZXh0KHN0cikge1xuICAgICAgICBnZXRXaWRnZXQoKS5maW5kKFwic3BhblwiKS50ZXh0KHN0cik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3RvcFRpbWVvdXQoKSB7XG4gICAgICAgIC8vIFN0b3AgdGhlIHRpbWVvdXQuXG4gICAgICAgIGlmICh0aW1lb3V0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgdGltZW91dCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gT3B0aW9uYWxseSBwYXNzIGEgZHVyYXRpb24gd2hpY2ggaGlkZXMgdGhlIHdpZGdldCBhZ2Fpbi5cbiAgICBmdW5jdGlvbiBzaG93KGR1cmF0aW9uKSB7XG4gICAgICAgIC8vIEdldCB0aGUgd2lkZ2V0LlxuICAgICAgICB2YXIgd2lkZ2V0ID0gZ2V0V2lkZ2V0KCk7XG5cbiAgICAgICAgLy8gU3RvcCB0aGUgdGltZW91dC5cbiAgICAgICAgc3RvcFRpbWVvdXQoKTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGNsYXNzZXMgaWYgcHJlc2VudC5cbiAgICAgICAgd2lkZ2V0LnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgIHdpZGdldC5yZW1vdmVDbGFzcygnc2hvdycpO1xuXG4gICAgICAgIC8vIFNob3cgaXQgYnkgYWRkaW5nIHRoZSBzaG93IGNsYXNzLlxuICAgICAgICB3aWRnZXQuYWRkQ2xhc3MoJ3Nob3cnKTtcblxuICAgICAgICAvLyBIaWRlIGFnYWluIGFmdGVyIGEgdGltZW91dCBkdXJhdGlvbiBpZiBkZWZpbmVkLlxuICAgICAgICBpZiAoZHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaGlkZSgpO1xuICAgICAgICAgICAgfSwgZHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSB3aWRnZXQuXG4gICAgICAgIHZhciB3aWRnZXQgPSBnZXRXaWRnZXQoKTtcblxuICAgICAgICAvLyBTdG9wIHRoZSB0aW1lb3V0LlxuICAgICAgICBzdG9wVGltZW91dCgpO1xuXG4gICAgICAgIC8vIEhpZGUgaXQgYnkgcmVtb3ZpbmcgdGhlIGNsYXNzLlxuICAgICAgICB3aWRnZXQuYWRkQ2xhc3MoJ2hpZGUnKTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGNsYXNzZXMgYWZ0ZXIgYSBzaG9ydCBkdXJhdGlvbi5cbiAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gZmFsc2U7XG4gICAgICAgICAgICB3aWRnZXQucmVtb3ZlQ2xhc3MoJ2hpZGUnKTtcbiAgICAgICAgICAgIHdpZGdldC5yZW1vdmVDbGFzcygnc2hvdycpO1xuICAgICAgICB9LCAzMDAwKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgICAgICAvLyBHZXQgdGhlIHdpZGdldC5cbiAgICAgICAgdmFyIHdpZGdldCA9IGdldFdpZGdldCgpO1xuXG4gICAgICAgIC8vIFN0b3AgdGhlIHRpbWVvdXQuXG4gICAgICAgIHN0b3BUaW1lb3V0KCk7XG5cbiAgICAgICAgLy8gSGlkZSBpdCBieSByZW1vdmluZyB0aGUgY2xhc3MuXG4gICAgICAgIHdpZGdldC5hZGRDbGFzcygnaGlkZScpO1xuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgb2JqZWN0IGFmdGVyIGEgc2hvcnQgZHVyYXRpb24uXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IGZhbHNlO1xuICAgICAgICAgICAgd2lkZ2V0LnJlbW92ZSgpO1xuICAgICAgICB9LCAzMDAwKTtcbiAgICB9XG5cblxuXG4gICAgLypcbiAgICAgKiBJbml0aWFsaXphdGlvblxuICAgICAqL1xuXG4gICAgLy8gTWVyZ2UgdGhlIG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCBvcHRpb25zLlxuICAgIG9wdGlvbnMgPSAkLmV4dGVuZChEZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICAvLyBUaGlzIGNhbGwgY3JlYXRlcyB0aGUgd2lkZ2V0IG9uY2UuXG4gICAgZ2V0V2lkZ2V0KCk7XG5cbiAgICAvLyBTZXQgdGhlIGRlZmF1bHQgdGl0bGUgYW5kIHRleHQuXG4gICAgc2V0VGl0bGUob3B0aW9ucy50aXRsZSk7XG4gICAgc2V0VGV4dChvcHRpb25zLnRleHQpO1xuXG5cblxuICAgIC8vIFJldHVybiB0aGUgcHVibGljIG9iamVjdC5cbiAgICByZXR1cm4ge1xuICAgICAgICBzZXRUaXRsZTogc2V0VGl0bGUsXG4gICAgICAgIHNldFRleHQgOiBzZXRUZXh0LFxuICAgICAgICBzaG93ICAgIDogc2hvdyxcbiAgICAgICAgaGlkZSAgICA6IGhpZGUsXG4gICAgICAgIGRlc3Ryb3kgOiBkZXN0cm95LFxuXG4gICAgICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgIGdldFdpZGdldCgpLmFkZENsYXNzKCdibS1jbGlja2FibGUnKS5vbignY2xpY2snLCBmKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG4gICAgLypcbiAqICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuICogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbi8qXG4gKiAgVGhpcyBjb2RlIGxpdmVzIGluc2lkZSB0aGUgQml0TW9uc3RlciBmdW5jdGlvbi5cbiAqL1xuXG5cbnZhciBjb25ubG9zdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLypcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKi9cblxuXHR2YXIgaW5zdGFuY2UgPSB7fSwgLy8gT3VyIHB1YmxpYyBpbnN0YW5jZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhpcyBmdW5jdGlvbi5cblx0XHR0aW1lb3V0ID0gZmFsc2U7XG5cblx0dmFyIG5vdGlmeSA9IGJtLm5vdGlmaWNhdGlvbih7XG5cdFx0dGl0bGU6IHRyLnNvY2tldC5Db25uTG9zdFRpdGxlLFxuXHRcdHRleHQ6IHRyLnNvY2tldC5Db25uTG9zdFRleHQsXG5cdFx0ZGVzdHJveU9uQ2xvc2U6IGZhbHNlLFxuXHRcdGhpZGVDbG9zZTogdHJ1ZVxuXHR9KTtcblxuXG5cblxuICAgIC8qXG4gICAgICogUHVibGljIE1ldGhvZHNcbiAgICAgKi9cblxuICAgIGluc3RhbmNlLnNob3cgPSBmdW5jdGlvbigpIHtcblx0XHRpZiAodGltZW91dCAhPT0gZmFsc2UpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdHRpbWVvdXQgPSBmYWxzZTtcblx0XHRcdG5vdGlmeS5zaG93KCk7XG5cdFx0fSwgMTUwMCk7XG4gICAgfTtcblxuXHRpbnN0YW5jZS5oaWRlID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRpbWVvdXQgIT09IGZhbHNlKSB7XG5cdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHR0aW1lb3V0ID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0bm90aWZ5LmhpZGUoKTtcblx0fTtcblxuXG5cdHJldHVybiBpbnN0YW5jZTtcbn0pKCk7XG5cbiAgICAvKlxuICogIEJpdE1vbnN0ZXIgLSBBIE1vbnN0ZXIgaGFuZGxpbmcgeW91ciBCaXRzXG4gKiAgQ29weXJpZ2h0IChDKSAyMDE1ICBSb2xhbmQgU2luZ2VyIDxyb2xhbmQuc2luZ2VyW2F0XWRlc2VydGJpdC5jb20+XG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuXG4vKlxuICogIFRoaXMgY29kZSBsaXZlcyBpbnNpZGUgdGhlIEJpdE1vbnN0ZXIgZnVuY3Rpb24uXG4gKi9cblxuYm0uc2NvcGUgPSAoZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKi9cblxuICAgIC8vIEEgbWFwIGhvbGRpbmcgdGhlIHNjb3Blcy5cbiAgICB2YXIgc2NvcGVNYXAgPSB7fTtcblxuICAgIC8qXG4gICAgICogUmV0dXJuIHRoZSBhY3R1YWwgbW9kdWxlIGZ1bmN0aW9uLlxuICAgICAqL1xuICAgIHJldHVybiBmdW5jdGlvbihzY29wZSkge1xuICAgICAgICAvLyBUaGUgbW9kdWxlIG5hbWUgaGFzIHRvIGJlIGRlZmluZWQuXG4gICAgICAgIGlmICghc2NvcGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogaW52YWxpZCBzY29wZSBjYWxsOiBzY29wZT0nXCIgKyBzY29wZSArIFwiJ1wiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE9idGFpbiB0aGUgc2NvcGUgb2JqZWN0LlxuICAgICAgICB2YXIgcyA9IHNjb3BlTWFwW3Njb3BlXTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIHNjb3BlIGlmIGl0IGRvZXMgbm90IGV4aXN0cy5cbiAgICAgICAgaWYgKCFzKSB7XG4gICAgICAgICAgICBzID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50czogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgbmV3IHBhc3NlZCBldmVudHMgdG8gdGhlIHNjb3BlLlxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGUgPSBhcmd1bWVudHNbaV07XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwYXNzZWQgYXJndW1lbnQgaXMgb2YgdHlwZSBldmVudCB3aXRoXG4gICAgICAgICAgICAvLyB0aGUgb2ZmIGZ1bmN0aW9uLlxuICAgICAgICAgICAgaWYgKCEkLmlzRnVuY3Rpb24oZS5vZmYpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCaXRNb25zdGVyOiBpbnZhbGlkIHNjb3BlIGNhbGw6IHBhc3NlZCBpbnZhbGlkIGFyZ3VtZW50OiBza2lwcGluZyBhcmd1bWVudC4uLlwiKTtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcy5ldmVudHMucHVzaChlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFVwZGF0ZS9hZGQgdGhlIHNjb3BlIHRvIHRoZSBtYXAuXG4gICAgICAgIHNjb3BlTWFwW3Njb3BlXSA9IHM7XG5cbiAgICAgICAgLy8gUmV0dXJuIHRoZSBtb2R1bGUgb2JqZWN0IHdpdGggdGhlIG1vZHVsZSBtZXRob2RzLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLy8gVW5iaW5kIGFsbCBldmVudHMgaW4gdGhlIHNjb3BlLlxuICAgICAgICAgICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBvZmYgbWV0aG9kIGZvciBhbGwgZXZlbnRzIGluIHRoZSBzY29wZS5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMuZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHMuZXZlbnRzW2ldLm9mZigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgc2NvcGUgZnJvbSB0aGUgbWFwLlxuICAgICAgICAgICAgICAgIGRlbGV0ZSBzY29wZU1hcFtzY29wZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbn0pKCk7XG5cbiAgICAvKlxuICogIEJpdE1vbnN0ZXIgLSBBIE1vbnN0ZXIgaGFuZGxpbmcgeW91ciBCaXRzXG4gKiAgQ29weXJpZ2h0IChDKSAyMDE1ICBSb2xhbmQgU2luZ2VyIDxyb2xhbmQuc2luZ2VyW2F0XWRlc2VydGJpdC5jb20+XG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuLypcbiAqICBUaGlzIGNvZGUgbGl2ZXMgaW5zaWRlIHRoZSBCaXRNb25zdGVyIGZ1bmN0aW9uLlxuICovXG5cblxudmFyIHNvY2tldCA9IChmdW5jdGlvbiAoKSB7XG4gICAgLypcbiAgICAgKiBTb2NrZXQgSW5pdGlhbGl6YXRpb25cbiAgICAgKi9cblxuXHQvLyBDcmVhdGUgdGhlIGdsdWUgc29ja2V0IGFuZCBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIuXG4gICAgLy8gT3B0aW9uYWwgcGFzcyBhIGhvc3Qgc3RyaW5nLiBUaGlzIGhvc3Qgc3RyaW5nIGlzIGRlZmluZWQgaW4gdGhlIG1haW4gQml0TW9uc3RlciBmaWxlLlxuICAgIHZhciBzb2NrZXQgPSBnbHVlKGhvc3QsIHtcbiAgICAgICAgYmFzZVVSTDogXCIvYml0bW9uc3Rlci9cIlxuICAgIH0pO1xuICAgIGlmICghc29ja2V0KSB7XG4gICAgXHRjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IGZhaWxlZCB0byBpbml0aWFsaXplIHNvY2tldCFcIik7XG4gICAgXHRyZXR1cm47XG4gICAgfVxuXG4gICAgc29ja2V0Lm9uKFwiY29ubmVjdGVkXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25ubG9zdC5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oXCJjb25uZWN0aW5nXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25ubG9zdC5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oXCJyZWNvbm5lY3RpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbm5sb3N0LnNob3coKTtcbiAgICB9KTtcblxuICAgIHNvY2tldC5vbihcImRpc2Nvbm5lY3RlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29ubmxvc3QuaGlkZSgpO1xuXG4gICAgICAgIHZhciBub3RpZnkgPSBibS5ub3RpZmljYXRpb24oe1xuICAgICAgICAgICAgdGl0bGU6IHRyLnNvY2tldC5EaXNjb25uZWN0ZWRUaXRsZSxcbiAgICAgICAgICAgIHRleHQ6IHRyLnNvY2tldC5EaXNjb25uZWN0ZWRUZXh0LFxuICAgICAgICAgICAgaGlkZUNsb3NlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5vdGlmeS5vbkNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbm90aWZ5LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHNvY2tldC5yZWNvbm5lY3QoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbm90aWZ5LnNob3coKTtcbiAgICB9KTtcblxuICAgIHNvY2tldC5vbihcImVycm9yXCIsIGZ1bmN0aW9uKGUsIG1zZykge1xuICAgICAgICAvLyBKdXN0IGxvZyB0aGUgZXJyb3IuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3Rlcjogc29ja2V0IGVycm9yOiBcIiArIG1zZyk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oXCJkaXNjYXJkX3NlbmRfYnVmZmVyXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBibS5ub3RpZmljYXRpb24oe1xuICAgIFx0XHR0aXRsZTogdHIuc29ja2V0LkRpc2NhcmROb3RTZW5kRGF0YVRpdGxlLFxuICAgIFx0XHR0ZXh0OiB0ci5zb2NrZXQuRGlzY2FyZE5vdFNlbmREYXRhVGV4dFxuICAgIFx0fSkuc2hvdygpO1xuICAgIH0pO1xuXG5cbiAgICAvLyBSZXR1cm4gdGhlIG5ld2x5IGNyZWF0ZWQgc29ja2V0LlxuICAgIHJldHVybiBzb2NrZXQ7XG59KSgpO1xuXG4gICAgLypcbiAqICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuICogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cblxuLypcbiAqICBUaGlzIGNvZGUgbGl2ZXMgaW5zaWRlIHRoZSBCaXRNb25zdGVyIGZ1bmN0aW9uLlxuICovXG5cbmJtLm1vZHVsZSA9IChmdW5jdGlvbigpIHtcbiAgICAvKlxuICAgICAqIENvbnN0YW50c1xuICAgICAqL1xuXG4gICAgdmFyIGNhbGxiYWNrSURMZW5ndGggICAgICA9IDE0LFxuICAgICAgICBldmVudExpc3RlbmVySURMZW5ndGggPSAxMCxcbiAgICAgICAgbWV0aG9kQ2FsbFRpbWVvdXQgICAgID0gMTIwMDA7IC8vIDEyIHNlY29uZHNcblxuXG5cbiAgICAvKlxuICAgICAqIFZhcmlhYmxlc1xuICAgICAqL1xuXG4gICAgIC8vIE9idGFpbiB0aGUgc29ja2V0IGNvbW11bmljYXRpb24gY2hhbm5lbHMuXG4gICAgIHZhciBjYWxsQ2hhbm5lbCAgICA9IHNvY2tldC5jaGFubmVsKFwiY2FsbFwiKSxcbiAgICAgICAgIGV2ZW50Q2hhbm5lbCAgID0gc29ja2V0LmNoYW5uZWwoXCJldmVudFwiKTtcblxuICAgICAvLyBBIG1hcCBob2xkaW5nIGFsbCBjYWxsYmFja3MgYW5kIGV2ZW50cy5cbiAgICAgdmFyIGNhbGxiYWNrc01hcCAgID0ge30sXG4gICAgICAgICBldmVudHNNYXAgICAgICA9IHt9O1xuXG5cblxuICAgICAvKlxuICAgICAgKiBJbml0aWFsaXphdGlvblxuICAgICAgKi9cblxuICAgICAvLyBIYW5kbGUgcmVjZWl2ZWQgbWVzc2FnZXMgZnJvbSB0aGUgY2FsbCBjaGFubmVsLlxuICAgICBjYWxsQ2hhbm5lbC5vbk1lc3NhZ2UoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgLy8gRGVmaW5lIGEgbWV0aG9kIHRvIHByaW50IGVycm9yIG1lc3NhZ2VzLlxuICAgICAgICAgdmFyIGxvZ0Vycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgY29uc29sZS5sb2coXCJCaXRNb25zdGVyOiByZWNlaXZlZCBpbnZhbGlkIGNhbGwgcmVxdWVzdCBmcm9tIHNlcnZlci5cIik7XG4gICAgICAgICB9O1xuXG4gICAgICAgICAvLyBQYXJzZSB0aGUgSlNPTiB0byBhbiBvYmplY3QuXG4gICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgLy8gVGhlIGNhbGxiYWNrIElEIGhhcyB0byBiZSBhbHdheXMgZGVmaW5lZC5cbiAgICAgICAgIGlmICghZGF0YS5jYWxsYmFja0lEIHx8IFN0cmluZyhkYXRhLmNhbGxiYWNrSUQpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLyBPYnRhaW4gdGhlIGNhbGxiYWNrIG9iamVjdC5cbiAgICAgICAgIHZhciBjYiA9IGNhbGxiYWNrc01hcFtkYXRhLmNhbGxiYWNrSURdO1xuICAgICAgICAgaWYgKCFjYikge1xuICAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLyBSZW1vdmUgdGhlIGNhbGxiYWNrIG9iamVjdCBmcm9tIHRoZSBtYXAuXG4gICAgICAgICBkZWxldGUgY2FsbGJhY2tzTWFwW2RhdGEuY2FsbGJhY2tJRF07XG5cbiAgICAgICAgIC8vIFN0b3AgdGhlIHRpbWVvdXQuXG4gICAgICAgICBpZiAoY2IudGltZW91dCkge1xuICAgICAgICAgICAgIGNsZWFyVGltZW91dChjYi50aW1lb3V0KTtcbiAgICAgICAgICAgICBjYi50aW1lb3V0ID0gZmFsc2U7XG4gICAgICAgICB9XG5cbiAgICAgICAgIC8vIERldGVybWluZCB0aGUgcmVxdWVzdCB0eXBlIGFuZCBjYWxsIHRoZSBjYWxsYmFjay5cbiAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFwiY2xlYW51cFwiKSB7XG4gICAgICAgICAgICAgLy8gSnVzdCByZXR1cm4uIFRoZSBjYWxsYmFjayBvYmplY3Qgd2FzIGFscmVhZHkgcmVtb3ZlZCBmcm9tIHRoZSBtYXAuXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuICAgICAgICAgZWxzZSBpZiAoZGF0YS50eXBlID09PSBcInN1Y2Nlc3NcIiAmJiBjYi5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgdXRpbHMuY2FsbENhdGNoKGNiLnN1Y2Nlc3MsIGRhdGEuZGF0YSk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIGlmIChkYXRhLnR5cGUgPT09IFwiZXJyb3JcIiAmJiBjYi5lcnJvcikge1xuICAgICAgICAgICAgIHV0aWxzLmNhbGxDYXRjaChjYi5lcnJvciwgZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICB9XG4gICAgIH0pO1xuXG4gICAgIC8vIEhhbmRsZSByZWNlaXZlZCBtZXNzYWdlcyBmcm9tIHRoZSBldmVudCBjaGFubmVsLlxuICAgICBldmVudENoYW5uZWwub25NZXNzYWdlKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgIC8vIERlZmluZSBhIG1ldGhvZCB0byBwcmludCBlcnJvciBtZXNzYWdlcy5cbiAgICAgICAgIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogcmVjZWl2ZWQgaW52YWxpZCBldmVudCByZXF1ZXN0IGZyb20gc2VydmVyLlwiKTtcbiAgICAgICAgIH07XG5cbiAgICAgICAgIC8vIFBhcnNlIHRoZSBKU09OIHRvIGFuIG9iamVjdC5cbiAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXG4gICAgICAgICAvLyBDaGVjayBmb3IgdGhlIHJlcXVpcmVkIHZhbHVlcy5cbiAgICAgICAgIGlmICghZGF0YS5tb2R1bGUgfHwgIWRhdGEuZXZlbnQpIHtcbiAgICAgICAgICAgICBsb2dFcnJvcigpO1xuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gT2J0YWluIHRoZSBtb2R1bGUgZXZlbnRzLlxuICAgICAgICAgdmFyIG1vZHVsZUV2ZW50cyA9IGV2ZW50c01hcFtkYXRhLm1vZHVsZV07XG4gICAgICAgICBpZiAoIW1vZHVsZUV2ZW50cykge1xuICAgICAgICAgICAgIC8vIERvbid0IGxvZyB0aGUgZXJyb3IuIFRoZSBldmVudCB3YXMgdW5ib3VuZC5cbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIC8vIEdldCB0aGUgZXZlbnQgb2JqZWN0LlxuICAgICAgICAgdmFyIGV2ZW50T2JqID0gbW9kdWxlRXZlbnRzLmV2ZW50c1tkYXRhLmV2ZW50XTtcbiAgICAgICAgIGlmICghZXZlbnRPYmopIHtcbiAgICAgICAgICAgICAvLyBEb24ndCBsb2cgdGhlIGVycm9yLiBUaGUgZXZlbnQgd2FzIHVuYm91bmQuXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLyBEZXRlcm1pbmQgdGhlIGV2ZW50IHR5cGUuXG4gICAgICAgICBpZiAoZGF0YS50eXBlID09PSBcInRyaWdnZXJcIikge1xuICAgICAgICAgICAgIC8vIFBhcnNlIHRoZSBKU09OIGRhdGEgdmFsdWUgaWYgcHJlc2VudC5cbiAgICAgICAgICAgICB2YXIgZXZlbnREYXRhO1xuICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgZXZlbnREYXRhID0gSlNPTi5wYXJzZShkYXRhLmRhdGEpO1xuICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgIC8vIENyZWF0ZSBhIHNoYWxsb3cgY29weSB0byBhbGxvdyBtdXRhdGlvbnMgaW5zaWRlIHRoZSBpdGVyYXRpb24uXG4gICAgICAgICAgICAgdmFyIGxpc3RlbmVycyA9IGpRdWVyeS5leHRlbmQoe30sIGV2ZW50T2JqLmxpc3RlbmVycyk7XG5cbiAgICAgICAgICAgICAvLyBUcmlnZ2VyIHRoZSBsaXN0ZW5lcnMgYm91bmQgdG8gdGhpcyBldmVudC5cbiAgICAgICAgICAgICAkLmVhY2gobGlzdGVuZXJzLCBmdW5jdGlvbihpZCwgbCkge1xuICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgbC5jYWxsYmFjayhldmVudERhdGEpO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IGNhdGNoZWQgZXhjZXB0aW9uIHdoaWxlIHRyaWdnZXJpbmcgZXZlbnQ6XCIpO1xuICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9KTtcbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICB9XG4gICAgIH0pO1xuXG5cblxuICAgIC8qXG4gICAgICogUHJpdmF0ZVxuICAgICAqL1xuXG4gICAgLy8gY2FsbCBhIG1vZHVsZSBtZXRob2Qgb24gdGhlIHNlcnZlci1zaWRlLlxuICAgIHZhciBjYWxsTWV0aG9kID0gZnVuY3Rpb24obW9kdWxlLCBtZXRob2QpIHtcbiAgICAgICAgdmFyIHBhcmFtcyAgICAgICAgICA9IGZhbHNlLFxuICAgICAgICAgICAgc3VjY2Vzc0NhbGxiYWNrID0gZmFsc2UsXG4gICAgICAgICAgICBlcnJvckNhbGxiYWNrICAgPSBmYWxzZTtcblxuICAgICAgICAvLyBEZWZpbmUgYSBtZXRob2QgdG8gcHJpbnQgZXJyb3IgbWVzc2FnZXMuXG4gICAgICAgIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJCaXRNb25zdGVyOiBpbnZhbGlkIG1ldGhvZCBjYWxsOiBtb2R1bGU9J1wiICsgbW9kdWxlICsgXCInIG1ldGhvZD0nXCIgKyBtZXRob2QgKyBcIidcIik7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVGhlIG1ldGhvZCBuYW1lIGhhcyB0byBiZSBkZWZpbmVkLlxuICAgICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICAgICAgbG9nRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBhcnNlIHRoZSBmdW5jdGlvbiBhcmd1bWVudHMuXG4gICAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGFyZ3VtZW50IGlzIHRoZSBwYXJhbWV0ZXIgb2JqZWN0LlxuICAgICAgICAgICAgaWYgKGFyZyAhPT0gbnVsbCAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGFscmVhZHkgc2V0LlxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIHBhcmFtZXRlciBvYmplY3QuXG4gICAgICAgICAgICAgICAgcGFyYW1zID0gYXJnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBhcmd1bWVudCBpcyBhIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICAgICAgZWxzZSBpZiAoJC5pc0Z1bmN0aW9uKGFyZykpIHtcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIHN1Y2Nlc3MgY2FsbGJhY2sgaWYgbm90IGFscmVhZHkgc2V0LlxuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzQ2FsbGJhY2sgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjayA9IGFyZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBlcnJvciBjYWxsYmFjayBpZiBub3QgYWxyZWFkeSBzZXQuXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXJyb3JDYWxsYmFjayA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayA9IGFyZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gVG9vIG1hbnkgZnVuY3Rpb25zIHBhc3NlZCB0byB0aGlzIG1ldGhvZC4gSGFuZGxlIHRoZSBlcnJvci5cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEhhbmRsZSB1bmtub3duIHR5cGVzLlxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nRXJyb3IoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBNYXJzaGFsIHRoZSBwYXJhbWV0ZXIgb2JqZWN0IHRvIEpTT04uXG4gICAgICAgIGlmIChwYXJhbXMpIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBKdXN0IHNldCBhbiBlbXB0eSBzdHJpbmcuXG4gICAgICAgICAgICBwYXJhbXMgPSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBjYWxsIG9wdGlvbnMuXG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgbW9kdWxlOiBtb2R1bGUsXG4gICAgICAgICAgICBtZXRob2Q6IG1ldGhvZFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlZ2lzdGVyIHRoZSBjYWxsYmFja3MgaWYgZGVmaW5lZC5cbiAgICAgICAgaWYgKHN1Y2Nlc3NDYWxsYmFjayAhPT0gZmFsc2UgfHwgZXJyb3JDYWxsYmFjayAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIHJhbmRvbSBjYWxsYmFja3MgSUQgYW5kIGNoZWNrIGlmIGl0IGRvZXMgbm90IGV4aXN0IGFscmVhZHkuXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJRDtcbiAgICAgICAgICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFja0lEID0gdXRpbHMucmFuZG9tU3RyaW5nKGNhbGxiYWNrSURMZW5ndGgpO1xuICAgICAgICAgICAgICAgIGlmICghY2FsbGJhY2tzTWFwW2NhbGxiYWNrSURdKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IGNhbGxiYWNrcyBtYXAgaXRlbS5cbiAgICAgICAgICAgIHZhciBjYiA9IHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiAgICBzdWNjZXNzQ2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgZXJyb3I6ICAgICAgZXJyb3JDYWxsYmFja1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgdGltZW91dC5cbiAgICAgICAgICAgIGNiLnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNiLnRpbWVvdXQgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgY2FsbGJhY2sgb2JqZWN0IGFnYWluIGZyb20gdGhlIG1hcC5cbiAgICAgICAgICAgICAgICBkZWxldGUgY2FsbGJhY2tzTWFwW2NhbGxiYWNrSURdO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0aGUgZXJyb3IgY2FsbGJhY2sgaWYgZGVmaW5lZC5cbiAgICAgICAgICAgICAgICBpZiAoY2IuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY2IuZXJyb3IoXCJtZXRob2QgY2FsbCB0aW1lb3V0OiBubyBzZXJ2ZXIgcmVzcG9uc2UgcmVjZWl2ZWQgd2l0aGluIHRoZSB0aW1lb3V0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIG1ldGhvZENhbGxUaW1lb3V0KTtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBjYWxsYmFja3Mgd2l0aCB0aGUgSUQgdG8gdGhlIGNhbGxiYWNrcyBtYXAuXG4gICAgICAgICAgICBjYWxsYmFja3NNYXBbY2FsbGJhY2tJRF0gPSBjYjtcblxuICAgICAgICAgICAgLy8gQWRkIHRoZSBjYWxsYmFja3MgSUQgdG8gdGhlIG9wdGlvbnMuXG4gICAgICAgICAgICBvcHRzLmNhbGxiYWNrSUQgPSBjYWxsYmFja0lEO1xuXG4gICAgICAgICAgICAvLyBTZXQgdGhlIG9wdGlvbiBjYWxsYmFjayBmbGFncyBpZiB0aGUgY2FsbGJhY2tzIGFyZSBkZWZpbmVkLlxuICAgICAgICAgICAgb3B0cy5jYWxsYmFja1N1Y2Nlc3MgPSAoc3VjY2Vzc0NhbGxiYWNrICE9PSBmYWxzZSk7XG4gICAgICAgICAgICBvcHRzLmNhbGxiYWNrRXJyb3IgPSAoZXJyb3JDYWxsYmFjayAhPT0gZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFyc2hhbCB0aGUgb3B0aW9ucyB0byBKU09OLlxuICAgICAgICBvcHRzID0gSlNPTi5zdHJpbmdpZnkob3B0cyk7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgc2VydmVyIGZ1bmN0aW9uLlxuICAgICAgICBjYWxsQ2hhbm5lbC5zZW5kKHV0aWxzLm1hcnNoYWxWYWx1ZXMob3B0cywgcGFyYW1zKSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIC8vIFVuYmluZCBhbiBldmVudC5cbiAgICB2YXIgb2ZmRXZlbnQgPSBmdW5jdGlvbihtb2R1bGUsIGV2ZW50LCBpZCkge1xuICAgICAgICAvLyBPYnRhaW4gdGhlIG1vZHVsZSBldmVudHMuXG4gICAgICAgIHZhciBtb2R1bGVFdmVudHMgPSBldmVudHNNYXBbbW9kdWxlXTtcbiAgICAgICAgaWYgKCFtb2R1bGVFdmVudHMpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCB0aGUgZXZlbnQgb2JqZWN0LlxuICAgICAgICB2YXIgZXZlbnRPYmogPSBtb2R1bGVFdmVudHMuZXZlbnRzW2V2ZW50XTtcbiAgICAgICAgaWYgKCFldmVudE9iaikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBldmVudCBsaXN0ZW5lciBhZ2FpbiBmcm9tIHRoZSBtYXAuXG4gICAgICAgIGRlbGV0ZSBldmVudE9iai5saXN0ZW5lcnNbaWRdO1xuXG4gICAgICAgIC8vIFVuYmluZCB0aGUgc2VydmVyIGV2ZW50IGlmIHRoZXJlIGFyZSBubyBtb3JlIGxpc3RlbmVycy5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGV2ZW50T2JqLmxpc3RlbmVycykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBldmVudCBvYmplY3QgZnJvbSB0aGUgbW9kdWxlIGV2ZW50cy5cbiAgICAgICAgZGVsZXRlIG1vZHVsZUV2ZW50cy5ldmVudHNbZXZlbnRdO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZXZlbnQgb3B0aW9ucy5cbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICB0eXBlICAgOiBcIm9mZlwiLFxuICAgICAgICAgICAgbW9kdWxlIDogbW9kdWxlLFxuICAgICAgICAgICAgZXZlbnQgIDogZXZlbnRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYXJzaGFsIHRoZSBvcHRpb25zIHRvIEpTT04uXG4gICAgICAgIG9wdHMgPSBKU09OLnN0cmluZ2lmeShvcHRzKTtcblxuICAgICAgICAvLyBDYWxsIHRoZSBzZXJ2ZXIgZnVuY3Rpb24gdG8gdW5iaW5kIHRoZSBldmVudC5cbiAgICAgICAgZXZlbnRDaGFubmVsLnNlbmQob3B0cyk7XG4gICAgfTtcblxuICAgIHZhciBzZW5kQmluZEV2ZW50UmVxdWVzdCA9IGZ1bmN0aW9uKG1vZHVsZSwgZXZlbnQpIHtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBldmVudCBvcHRpb25zLlxuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIHR5cGUgICA6IFwib25cIixcbiAgICAgICAgICAgIG1vZHVsZSA6IG1vZHVsZSxcbiAgICAgICAgICAgIGV2ZW50ICA6IGV2ZW50XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFyc2hhbCB0aGUgb3B0aW9ucyB0byBKU09OLlxuICAgICAgICBvcHRzID0gSlNPTi5zdHJpbmdpZnkob3B0cyk7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgc2VydmVyIGZ1bmN0aW9uIHRvIGJpbmQgdGhlIGV2ZW50LlxuICAgICAgICBldmVudENoYW5uZWwuc2VuZChvcHRzKTtcbiAgICB9O1xuXG4gICAgLy8gTGlzdGVucyBvbiB0aGUgc3BlY2lmaWMgc2VydmVyLXNpZGUgZXZlbnQgYW5kIHRyaWdnZXJzIHRoZSBjYWxsYmFjay5cbiAgICB2YXIgb25FdmVudCA9IGZ1bmN0aW9uKG1vZHVsZSwgZXZlbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIE9idGFpbiB0aGUgbW9kdWxlIGV2ZW50cyBvciBjcmVhdGUgdGhlbSBpZiB0aGV5IGRvbid0IGV4aXN0LlxuICAgICAgICB2YXIgbW9kdWxlRXZlbnRzID0gZXZlbnRzTWFwW21vZHVsZV07XG4gICAgICAgIGlmICghbW9kdWxlRXZlbnRzKSB7XG4gICAgICAgICAgICBtb2R1bGVFdmVudHMgPSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzOiB7fVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGV2ZW50c01hcFttb2R1bGVdID0gbW9kdWxlRXZlbnRzO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IHRoZSBldmVudCBvYmplY3Qgb3IgY3JlYXRlIGl0IGlmIGl0IGRvZXMgbm90IGV4aXN0cy5cbiAgICAgICAgdmFyIGV2ZW50T2JqID0gbW9kdWxlRXZlbnRzLmV2ZW50c1tldmVudF07XG4gICAgICAgIGlmICghZXZlbnRPYmopIHtcbiAgICAgICAgICAgIGV2ZW50T2JqID0ge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyczoge31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBtb2R1bGVFdmVudHMuZXZlbnRzW2V2ZW50XSA9IGV2ZW50T2JqO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBDcmVhdGUgYSByYW5kb20gZXZlbnQgbGlzdGVuZXIgSUQgYW5kIGNoZWNrIGlmIGl0IGRvZXMgbm90IGV4aXN0IGFscmVhZHkuXG4gICAgICAgIHZhciBpZDtcbiAgICAgICAgd2hpbGUodHJ1ZSkge1xuICAgICAgICAgICAgaWQgPSB1dGlscy5yYW5kb21TdHJpbmcoZXZlbnRMaXN0ZW5lcklETGVuZ3RoKTtcbiAgICAgICAgICAgIGlmICghZXZlbnRPYmoubGlzdGVuZXJzW2lkXSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHRoZSBldmVudCBsaXN0ZW5lciB3aXRoIHRoZSBJRCB0byB0aGUgbWFwLlxuICAgICAgICBldmVudE9iai5saXN0ZW5lcnNbaWRdID0ge1xuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQmluZCB0aGUgZXZlbnQgaWYgbm90IGJvdW5kIGJlZm9yZS5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGV2ZW50T2JqLmxpc3RlbmVycykubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIHNlbmRCaW5kRXZlbnRSZXF1ZXN0KG1vZHVsZSwgZXZlbnQsIGlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgc2NvcGVcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIFVuYmluZCB0aGUgZXZlbnQgYWdhaW4uXG4gICAgICAgICAgICBvZmY6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIG9mZkV2ZW50KG1vZHVsZSwgZXZlbnQsIGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLy8gUmViaW5kIHRoZSBldmVudHMgb24gcmVjb25uZWN0aW9ucy5cbiAgICAvLyBEb24ndCB1c2UgdGhlIGNvbm5lY3RlZCBldmVudCBkaXJlY3RseSwgYmVjYXVzZSB0aGUgYXV0aGVudGljYXRpb25cbiAgICAvLyBzaG91bGQgYmUgaGFuZGxlZCBmaXJzdC5cbiAgICAkKHNvY2tldCkub24oXCJjb25uZWN0ZWRfYW5kX2F1dGhcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICQuZWFjaChldmVudHNNYXAsIGZ1bmN0aW9uKG1vZHVsZSwgbW9kdWxlRXZlbnRzKSB7XG4gICAgICAgICAgICAkLmVhY2gobW9kdWxlRXZlbnRzLmV2ZW50cywgZnVuY3Rpb24oZXZlbnQsIGV2ZW50T2JqKSB7XG4gICAgICAgICAgICAgICAgLy8gUmViaW5kIHRoZSBldmVudC5cbiAgICAgICAgICAgICAgICBzZW5kQmluZEV2ZW50UmVxdWVzdChtb2R1bGUsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG5cbiAgICAvKlxuICAgICAqIFJldHVybiB0aGUgYWN0dWFsIG1vZHVsZSBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24obW9kdWxlKSB7XG4gICAgICAgIC8vIFRoZSBtb2R1bGUgbmFtZSBoYXMgdG8gYmUgZGVmaW5lZC5cbiAgICAgICAgaWYgKCFtb2R1bGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogaW52YWxpZCBtb2R1bGUgY2FsbDogbW9kdWxlPSdcIiArIG1vZHVsZSArIFwiJ1wiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgbW9kdWxlIG9iamVjdCB3aXRoIHRoZSBtb2R1bGUgbWV0aG9kcy5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIGNhbGwgYSBtb2R1bGUgbWV0aG9kIG9uIHRoZSBzZXJ2ZXItc2lkZS5cbiAgICAgICAgICAgIGNhbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIFByZXBlbmQgdGhlIG1vZHVsZSB2YXJpYWJsZSB0byB0aGUgYXJndW1lbnRzIGFycmF5LlxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmNhbGwoYXJndW1lbnRzLCBtb2R1bGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgbWV0aG9kLlxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsTWV0aG9kLmFwcGx5KGNhbGxNZXRob2QsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvLyBvbiBsaXN0ZW5zIG9uIHRoZSBzcGVjaWZpYyBzZXJ2ZXItc2lkZSBldmVudCBhbmQgdHJpZ2dlcnMgdGhlIGZ1bmN0aW9uLlxuICAgICAgICAgICAgb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIC8vIFByZXBlbmQgdGhlIG1vZHVsZSB2YXJpYWJsZSB0byB0aGUgYXJndW1lbnRzIGFycmF5LlxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS51bnNoaWZ0LmNhbGwoYXJndW1lbnRzLCBtb2R1bGUpO1xuXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgbWV0aG9kLlxuICAgICAgICAgICAgICAgIHJldHVybiBvbkV2ZW50LmFwcGx5KG9uRXZlbnQsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH07XG59KSgpO1xuXG4gICAgLypcbiAqICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuICogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cblxuLypcbiAqICBUaGlzIGNvZGUgbGl2ZXMgaW5zaWRlIHRoZSBCaXRNb25zdGVyIGZ1bmN0aW9uLlxuICovXG5cbmJtLmF1dGggPSAoZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICAgKiBDb25zdGFudHNcbiAgICAgKi9cblxuICAgIHZhciBhdXRoVG9rZW5JRCA9IFwiQk1BdXRoVG9rZW5cIixcbiAgICAgICAgaHR0cEF1dGhVUkwgPSBcIi9iaXRtb25zdGVyL2F1dGhcIjtcblxuXG4gICAgLypcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKi9cblxuICAgIC8vIEdldCB0aGUgYXV0aGVudGljYXRpb24gbW9kdWxlLlxuICAgIHZhciBtb2R1bGUgICAgICA9IGJtLm1vZHVsZShcImF1dGhcIiksXG4gICAgICAgIGZpbmdlcnByaW50ID0gZmFsc2UsXG4gICAgICAgIGF1dGhVc2VySUQgID0gZmFsc2U7XG5cblxuICAgIC8qXG4gICAgICogVGhlIGFjdHVhbCBhdXRoZW50aWNhdGlvbiBvYmplY3QuXG4gICAgICovXG4gICAgdmFyIGluc3RhbmNlID0ge1xuICAgICAgICBsb2dpbjogICAgICAgICBsb2dpbixcbiAgICAgICAgbG9nb3V0OiAgICAgICAgbG9nb3V0LFxuICAgICAgICBnZXRVc2VySUQ6ICAgICBnZXRVc2VySUQsXG4gICAgICAgIGlzQXV0aDogICAgICAgIGlzQXV0aCxcblxuICAgICAgICAvLyBUcmlnZ2VyZWQgaWYgdGhlIHNlc3Npb24gaXMgYXV0aGVudGljYXRlZCAoQWZ0ZXIgYSBzdWNjZXNzZnVsIGxvZ2luKS5cbiAgICAgICAgb25BdXRoOiBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICAkKGluc3RhbmNlKS5vbignb25BdXRoJywgZik7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIFRyaWdnZXJlZCBpZiB0aGUgYXV0aGVudGljYXRpb24gc3RhdGUgY2hhbmdlcyAoTG9nZ2VkIGluIG9yIG91dCk6XG4gICAgICAgIG9uQXV0aENoYW5nZWQ6IGZ1bmN0aW9uKGYpIHtcbiAgICAgICAgICAgICQoaW5zdGFuY2UpLm9uKCdhdXRoQ2hhbmdlZCcsIGYpO1xuICAgICAgICB9XG4gICAgfTtcblxuXG5cbiAgICAvKlxuICAgICAqIFByaXZhdGUgTWV0aG9kc1xuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gZ2V0RmluZ2VycHJpbnQoKSB7XG4gICAgICAgIGlmICghZmluZ2VycHJpbnQpIHtcbiAgICAgICAgICAgIC8vIE9idGFpbiB0aGUgYnJvd3NlciBmaW5nZXJwcmludC5cbiAgICAgICAgICAgIGZpbmdlcnByaW50ID0gdXRpbHMuYnJvd3NlckZpbmdlcnByaW50KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmluZ2VycHJpbnQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXV0aFRva2VuKCkge1xuICAgICAgICB2YXIgdG9rZW47XG5cbiAgICAgICAgLy8gT2J0YWluIHRoZSBhdXRoIHRva2VuIGlmIHByZXNlbnQuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBsb2NhbCBzdG9yYWdlIGlzIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKHV0aWxzLnN0b3JhZ2VBdmFpbGFibGUoJ2xvY2FsU3RvcmFnZScpKSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIGZyb20gdGhlIGxvY2FsIHN0b3JhZ2UuXG4gICAgICAgICAgICB0b2tlbiA9IGxvY2FsU3RvcmFnZVthdXRoVG9rZW5JRF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRva2VuIGZyb20gdGhlIGNvb2tpZSBzdG9yYWdlLlxuICAgICAgICAgICAgaWYgKHV0aWxzLmNvb2tpZXMuaGFzSXRlbShhdXRoVG9rZW5JRCkpIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHV0aWxzLmNvb2tpZXMuZ2V0SXRlbShhdXRoVG9rZW5JRCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBsb2NhbCBzdG9yYWdlIGlzIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKHV0aWxzLnN0b3JhZ2VBdmFpbGFibGUoJ2xvY2FsU3RvcmFnZScpKSB7XG4gICAgICAgICAgICAvLyBTYXZlIHRoZSB0b2tlbiBpbiB0aGUgbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGF1dGhUb2tlbklELCB0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBVc2UgYSBjb29raWUgYXMgc3RvcmFnZSBhbHRlcm5hdGl2ZS5cbiAgICAgICAgICAgIC8vIFNldCBhbnkgY29va2llIHBhdGggYW5kIGRvbWFpbi5cbiAgICAgICAgICAgIC8vIEFsc28gc2V0IHRoZSBzZWN1cmUgSFRUUFMgZmxhZy4gVGhpcyBjb29raWUgaXMgb25seSB1c2VkIGluIGphdmFzY3JpcHQuXG4gICAgICAgICAgICB1dGlscy5jb29raWVzLnNldEl0ZW0oYXV0aFRva2VuSUQsIHRva2VuLCAoMSo2MCo2MCoyNCozMCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVsZXRlQXV0aFRva2VuKCkge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgbG9jYWwgc3RvcmFnZSBpcyBhdmFpbGFibGUuXG4gICAgICAgIGlmICh1dGlscy5zdG9yYWdlQXZhaWxhYmxlKCdsb2NhbFN0b3JhZ2UnKSkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIHRoZSB0b2tlbiBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlLlxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oYXV0aFRva2VuSUQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gVXNlIGEgY29va2llIGFzIHN0b3JhZ2UgYWx0ZXJuYXRpdmUuXG4gICAgICAgICAgICB1dGlscy5jb29raWVzLnJlbW92ZUl0ZW0oYXV0aFRva2VuSUQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gYXV0aGVudGljYXRlIHRoaXMgY2xpZW50IHdpdGggdGhlIHNhdmVkIGF1dGggZGF0YS5cbiAgICBmdW5jdGlvbiBhdXRoZW50aWNhdGUoY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgICAgICAgLy8gR2V0IHRoZSBhdXRoIHRva2VuLlxuICAgICAgICB2YXIgYXV0aFRva2VuID0gZ2V0QXV0aFRva2VuKCk7XG4gICAgICAgIGlmICghYXV0aFRva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2FsbEVycm9yQ2FsbGJhY2sgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICAgICAgICAgIHNldEN1cnJlbnRVc2VySUQoZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuLlxuICAgICAgICAgICAgZGVsZXRlQXV0aFRva2VuKCk7XG5cbiAgICAgICAgICAgIGlmIChlcnJvckNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuY2FsbENhdGNoKGVycm9yQ2FsbGJhY2ssIGVycik7XG4gICAgICAgICAgICAgICAgLy8gUmVzZXQgdG8gdHJpZ2dlciBvbmx5IG9uY2UuXG4gICAgICAgICAgICAgICAgZXJyb3JDYWxsYmFjayA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIEhUVFAgZGF0YS5cbiAgICAgICAgdmFyIGh0dHBEYXRhID0ge1xuICAgICAgICAgICAgdHlwZTogICAgICBcImF1dGhcIixcbiAgICAgICAgICAgIHNvY2tldElEOiAgc29ja2V0LnNvY2tldElEKClcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBTZW5kIHRoZSBodHRwIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QgdG8gY29uZmlybSB0aGUgY29va2llLlxuICAgICAgICB2YXIgcmVxWGhyID0gJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogaHR0cEF1dGhVUkwsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gUmVzZXQuXG4gICAgICAgICAgICAgICAgcmVxWGhyID0gZmFsc2U7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChyLCBtc2cpIHtcbiAgICAgICAgICAgICAgICAvLyBSZXNldC5cbiAgICAgICAgICAgICAgICByZXFYaHIgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGVycm9yIGNhbGxiYWNrLlxuICAgICAgICAgICAgICAgIHZhciBlcnIgPSBcIkhUVFAgYXV0aGVudGljYXRpb24gZmFpbGVkXCI7XG4gICAgICAgICAgICAgICAgaWYgKG1zZykgeyBlcnIgKz0gXCI6IFwiICsgbXNnOyB9XG4gICAgICAgICAgICAgICAgY2FsbEVycm9yQ2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGh0dHBEYXRhKSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IDcwMDBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtb2R1bGUgbWV0aG9kIHBhcmFtZXRlcnMuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgdG9rZW46ICAgICAgICAgYXV0aFRva2VuLFxuICAgICAgICAgICAgZmluZ2VycHJpbnQ6ICAgZ2V0RmluZ2VycHJpbnQoKVxuICAgICAgICB9O1xuXG4gICAgICAgIG1vZHVsZS5jYWxsKFwiYXV0aGVudGljYXRlXCIsIGRhdGEsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIC8vIFZhbGlkYXRlLCB0aGF0IGEgY29ycmVjdCB1c2VyIGlzIHJldHVybmVkLlxuICAgICAgICAgICAgaWYgKCFkYXRhLmlkKSB7XG4gICAgICAgICAgICAgICAgY2FsbEVycm9yQ2FsbGJhY2soXCJpbnZhbGlkIHVzZXIgZGF0YSByZWNlaXZlZFwiKTtcbiAgICAgICAgICAgICAgICBsb2dvdXQoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNldCB0aGUgY3VycmVudCBhdXRoZW50aWNhdGVkIHVzZXIuXG4gICAgICAgICAgICBzZXRDdXJyZW50VXNlcklEKGRhdGEuaWQpO1xuXG4gICAgICAgICAgICAvLyBDYWxsIHRoZSBzdWNjZXNzIGNhbGxiYWNrLlxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgdXRpbHMuY2FsbENhdGNoKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAvLyBLaWxsIHRoZSBhamF4IHJlcXVlc3QuXG4gICAgICAgICAgICBpZiAocmVxWGhyKSB7XG4gICAgICAgICAgICAgICAgcmVxWGhyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNhbGxFcnJvckNhbGxiYWNrKGVycik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ2luKHVzZXJuYW1lLCBwYXNzd29yZCwgY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spIHtcbiAgICAgICAgdmFyIHBlcmZvcm1Mb2dpbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNhbGxFcnJvckNhbGxiYWNrID0gZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgY2FsbGJhY2suXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdXRpbHMuY2FsbENhdGNoKGVycm9yQ2FsbGJhY2ssIGVycik7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc2V0IHRvIHRyaWdnZXIgb25seSBvbmNlLlxuICAgICAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICghdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgY2FsbEVycm9yQ2FsbGJhY2soXCJpbnZhbGlkIGxvZ2luIGNyZWRlbnRpYWxzXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhpcyBtZXRob2QgdHJpZ2dlcnMgdGhlIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QgYXMgc29vbiBhc1xuICAgICAgICAgICAgLy8gdGhlIGxvZ2luIGNhbGwgYW5kIHRoZSBIVFRQIHJlcXVlc3QgZmluaXNoZWQuXG4gICAgICAgICAgICB2YXIgdHJpZ2dlckF1dGhSZXF1ZXN0Q291bnQgPSAwO1xuICAgICAgICAgICAgdmFyIHRyaWdnZXJBdXRoUmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRyaWdnZXJBdXRoUmVxdWVzdENvdW50Kys7XG4gICAgICAgICAgICAgICAgaWYgKHRyaWdnZXJBdXRoUmVxdWVzdENvdW50IDwgMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRmluYWxseSBhdXRoZW50aWNhdGUgdGhlIHNlc3Npb24uXG4gICAgICAgICAgICAgICAgaWYgKCFhdXRoZW50aWNhdGUoY2FsbGJhY2ssIGVycm9yQ2FsbGJhY2spKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxFcnJvckNhbGxiYWNrKFwiYXV0aGVudGljYXRpb24gZmFpbGVkXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBIVFRQIGRhdGEuXG4gICAgICAgICAgICB2YXIgaHR0cERhdGEgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogICAgICBcImxvZ2luXCIsXG4gICAgICAgICAgICAgICAgc29ja2V0SUQ6ICBzb2NrZXQuc29ja2V0SUQoKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gU2VuZCB0aGUgaHR0cCBsb2dpbiByZXF1ZXN0IHRvIHNldCB0aGUgY29va2llLlxuICAgICAgICAgICAgLy8gV2UgZG9uJ3QgaGF2ZSBhY2NlcyB0aHJvdWdoIGphdmFzY3JpcHQuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgc2VjdXJpdHkgcHJlY2F1dGlvbi5cbiAgICAgICAgICAgIHZhciByZXFYaHIgPSAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogaHR0cEF1dGhVUkwsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBSZXNldC5cbiAgICAgICAgICAgICAgICAgICAgcmVxWGhyID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0aGUgYXV0aGVudGljYXRpb24gcmVxdWVzdCBhcyBzb29uIGFzIGFsbCByZXF1ZXN0cyBhcmUgcmVhZHkuXG4gICAgICAgICAgICAgICAgICAgIHRyaWdnZXJBdXRoUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uIChyLCBtc2cpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQuXG4gICAgICAgICAgICAgICAgICAgIHJlcVhociA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIGVycm9yIGNhbGxiYWNrLlxuICAgICAgICAgICAgICAgICAgICB2YXIgZXJyID0gXCJIVFRQIGF1dGhlbnRpY2F0aW9uIGZhaWxlZFwiO1xuICAgICAgICAgICAgICAgICAgICBpZiAobXNnKSB7IGVyciArPSBcIjogXCIgKyBtc2c7IH1cbiAgICAgICAgICAgICAgICAgICAgY2FsbEVycm9yQ2FsbGJhY2soZXJyKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGh0dHBEYXRhKSxcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiA3MDAwXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gQ3JlYXRlIHRoZSBtb2R1bGUgbWV0aG9kIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkLFxuICAgICAgICAgICAgICAgIGZpbmdlcnByaW50OiBnZXRGaW5nZXJwcmludCgpXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBtb2R1bGUuY2FsbChcImxvZ2luXCIsIGRhdGEsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgYXV0aCB0b2tlbiBpcyByZWNlaXZlZC5cbiAgICAgICAgICAgICAgICBpZiAoIWRhdGEudG9rZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbEVycm9yQ2FsbGJhY2soXCJsb2dpbiBmYWlsZWQ6IGludmFsaWQgYXV0aGVudGljYXRpb24gdG9rZW5cIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIGF1dGggdG9rZW4uXG4gICAgICAgICAgICAgICAgc2V0QXV0aFRva2VuKGRhdGEudG9rZW4pO1xuXG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciB0aGUgYXV0aGVudGljYXRpb24gcmVxdWVzdCBhcyBzb29uIGFzIGFsbCByZXF1ZXN0cyBhcmUgcmVhZHkuXG4gICAgICAgICAgICAgICAgdHJpZ2dlckF1dGhSZXF1ZXN0KCk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBLaWxsIHRoZSBhamF4IHJlcXVlc3QuXG4gICAgICAgICAgICAgICAgaWYgKHJlcVhocikge1xuICAgICAgICAgICAgICAgICAgICByZXFYaHIuYWJvcnQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBlcnJvciBjYWxsYmFjay5cbiAgICAgICAgICAgICAgICBjYWxsRXJyb3JDYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSWYgdGhlIHNvY2tldCBpcyBub3QgY29ubmVjdGVkIHlldCwgdGhlbiB0cmlnZ2VyIHRoZSBsb2dpblxuICAgICAgICAvLyBmaXJzdCBhcyBzb29uIGFzIGEgY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHRoZSBzb2NrZXRJRCgpIGlzIGVtcHR5LlxuICAgICAgICBpZiAoc29ja2V0LnN0YXRlKCkgIT09IFwiY29ubmVjdGVkXCIpIHtcbiAgICAgICAgICAgIHNvY2tldC5vbihcImNvbm5lY3RlZFwiLCBwZXJmb3JtTG9naW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVyZm9ybUxvZ2luKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICAgICAgc2V0Q3VycmVudFVzZXJJRChmYWxzZSk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICAgICAgZGVsZXRlQXV0aFRva2VuKCk7XG5cbiAgICAgICAgLy8gTG9nb3V0IG9uIHNlcnZlci1zaWRlLlxuICAgICAgICBtb2R1bGUuY2FsbChcImxvZ291dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIExvZ291dCBzdWNjZXNzZnVsIG9uIHNlcnZlci1zaWRlLlxuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogZmFpbGVkIHRvIGxvZ291dCBzb2NrZXQgc2Vzc2lvblwiKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyKTsgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcklEKHVzZXJJRCkge1xuICAgICAgICAvLyBTa2lwIGlmIG5vdGhpbmcgaGFzIGNoYW5nZWQuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IHRyaWdnZXJpbmcgdGhlIGV2ZW50cyBtdWx0aXBsZSB0aW1lcy5cbiAgICAgICAgaWYgKGF1dGhVc2VySUQgPT09IHVzZXJJRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoZSBuZXcgdXNlciBJRC5cbiAgICAgICAgYXV0aFVzZXJJRCA9IHVzZXJJRDtcblxuICAgICAgICAvLyBUcmlnZ2VyIHRoZSBldmVudHMuXG4gICAgICAgIGlmIChhdXRoVXNlcklEKSB7XG4gICAgICAgICAgICAkKGluc3RhbmNlKS50cmlnZ2VyKCdhdXRoQ2hhbmdlZCcsIFt0cnVlXSk7XG4gICAgICAgICAgICAkKGluc3RhbmNlKS50cmlnZ2VyKCdvbkF1dGgnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoaW5zdGFuY2UpLnRyaWdnZXIoJ2F1dGhDaGFuZ2VkJywgW2ZhbHNlXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIG5vdCBsb2dnZWQgaW4uXG4gICAgZnVuY3Rpb24gZ2V0VXNlcklEKCkge1xuICAgICAgICBpZiAoIWF1dGhVc2VySUQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXV0aFVzZXJJRDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0F1dGgoKSB7XG4gICAgICAgIGlmICghYXV0aFVzZXJJRCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemF0aW9uXG4gICAgICovXG5cbiAgICAvLyBBdXRoZW50aWNhdGUgYXMgc29vbiBhcyB0aGUgc29ja2V0IGNvbm5lY3RzLlxuICAgIHNvY2tldC5vbihcImNvbm5lY3RlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQXV0aGVudGljYXRlIHRoaXMgc29ja2V0IHNlc3Npb24gaWYgdGhlIGF1dGhUb2tlbiBpcyBwcmVzZW50LlxuICAgICAgICB2YXIgbm90QXV0aCA9IGF1dGhlbnRpY2F0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgdGhlIGN1c3RvbSBldmVudC5cbiAgICAgICAgICAgICQoc29ja2V0KS50cmlnZ2VyKFwiY29ubmVjdGVkX2FuZF9hdXRoXCIpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgdGhlIGN1c3RvbSBldmVudC5cbiAgICAgICAgICAgICQoc29ja2V0KS50cmlnZ2VyKFwiY29ubmVjdGVkX2FuZF9hdXRoXCIpO1xuXG4gICAgICAgICAgICAvLyBMb2cuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IGZhaWxlZCB0byBhdXRoZW50aWNhdGVcIik7XG4gICAgICAgICAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKFwiZXJyb3IgbWVzc2FnZTogXCIgKyBlcnIpOyB9XG5cbiAgICAgICAgICAgIC8vIFNob3cgYSBub3RpZmljYXRpb24uXG4gICAgICAgICAgICBibS5ub3RpZmljYXRpb24oe1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0ci5hdXRoLkZhaWxlZFRpdGxlLFxuICAgICAgICAgICAgICAgIHRleHQ6IHRyLmF1dGguRmFpbGVkVGV4dCxcbiAgICAgICAgICAgIH0pLnNob3coMTAwMDApO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUcmlnZ2VyIHRoZSBjdXN0b20gZXZlbnQgaWYgbm8gYXV0aGVudGljYXRpb24gd2FzIGRvbmUuXG4gICAgICAgIGlmICghbm90QXV0aCkge1xuICAgICAgICAgICAgJChzb2NrZXQpLnRyaWdnZXIoXCJjb25uZWN0ZWRfYW5kX2F1dGhcIik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEF1dGhlbnRpY2F0ZSBpZiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgIG1vZHVsZS5vbihcInJlYXV0aGVudGljYXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhdXRoZW50aWNhdGUodW5kZWZpbmVkLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIC8vIExvZy5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogZmFpbGVkIHRvIHJlYXV0aGVudGljYXRlXCIpO1xuICAgICAgICAgICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhcImVycm9yIG1lc3NhZ2U6IFwiICsgZXJyKTsgfVxuXG4gICAgICAgICAgICAvLyBTaG93IGEgbm90aWZpY2F0aW9uLlxuICAgICAgICAgICAgYm0ubm90aWZpY2F0aW9uKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdHIuYXV0aC5GYWlsZWRUaXRsZSxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ci5hdXRoLkZhaWxlZFRleHQsXG4gICAgICAgICAgICB9KS5zaG93KDEwMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuXG4gICAgIC8qXG4gICAgICAqIFJldHVybiB0aGUgYXV0aGVudGljYXRpb24gb2JqZWN0LlxuICAgICAgKi9cbiAgICAgcmV0dXJuIGluc3RhbmNlO1xufSkoKTtcblxuXG4gICAgLy8gUmV0dXJuIHRoZSBuZXdseSBjcmVhdGVkIEJpdE1vbnN0ZXIgb2JqZWN0LlxuICAgIHJldHVybiBibTtcbn07XG4iXSwiZmlsZSI6IkJpdE1vbnN0ZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==