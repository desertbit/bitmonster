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
"use strict";function q(a){throw a;}var s=void 0,u=!1;var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});
sjcl.cipher.aes=function(a){this.k[0][0][0]||this.D();var b,c,d,e,f=this.k[0][4],g=this.k[1];b=a.length;var h=1;4!==b&&(6!==b&&8!==b)&&q(new sjcl.exception.invalid("invalid aes key size"));this.b=[d=a.slice(0),e=[]];for(a=b;a<4*b+28;a++){c=d[a-1];if(0===a%b||8===b&&4===a%b)c=f[c>>>24]<<24^f[c>>16&255]<<16^f[c>>8&255]<<8^f[c&255],0===a%b&&(c=c<<8^c>>>24^h<<24,h=h<<1^283*(h>>7));d[a]=d[a-b]^c}for(b=0;a;b++,a--)c=d[b&3?a:a-4],e[b]=4>=a||4>b?c:g[0][f[c>>>24]]^g[1][f[c>>16&255]]^g[2][f[c>>8&255]]^g[3][f[c&
255]]};
sjcl.cipher.aes.prototype={encrypt:function(a){return w(this,a,0)},decrypt:function(a){return w(this,a,1)},k:[[[],[],[],[],[]],[[],[],[],[],[]]],D:function(){var a=this.k[0],b=this.k[1],c=a[4],d=b[4],e,f,g,h=[],l=[],k,n,m,p;for(e=0;0x100>e;e++)l[(h[e]=e<<1^283*(e>>7))^e]=e;for(f=g=0;!c[f];f^=k||1,g=l[g]||1){m=g^g<<1^g<<2^g<<3^g<<4;m=m>>8^m&255^99;c[f]=m;d[m]=f;n=h[e=h[k=h[f]]];p=0x1010101*n^0x10001*e^0x101*k^0x1010100*f;n=0x101*h[m]^0x1010100*m;for(e=0;4>e;e++)a[e][f]=n=n<<24^n>>>8,b[e][m]=p=p<<24^p>>>8}for(e=
0;5>e;e++)a[e]=a[e].slice(0),b[e]=b[e].slice(0)}};
function w(a,b,c){4!==b.length&&q(new sjcl.exception.invalid("invalid aes block size"));var d=a.b[c],e=b[0]^d[0],f=b[c?3:1]^d[1],g=b[2]^d[2];b=b[c?1:3]^d[3];var h,l,k,n=d.length/4-2,m,p=4,t=[0,0,0,0];h=a.k[c];a=h[0];var r=h[1],v=h[2],y=h[3],z=h[4];for(m=0;m<n;m++)h=a[e>>>24]^r[f>>16&255]^v[g>>8&255]^y[b&255]^d[p],l=a[f>>>24]^r[g>>16&255]^v[b>>8&255]^y[e&255]^d[p+1],k=a[g>>>24]^r[b>>16&255]^v[e>>8&255]^y[f&255]^d[p+2],b=a[b>>>24]^r[e>>16&255]^v[f>>8&255]^y[g&255]^d[p+3],p+=4,e=h,f=l,g=k;for(m=0;4>
m;m++)t[c?3&-m:m]=z[e>>>24]<<24^z[f>>16&255]<<16^z[g>>8&255]<<8^z[b&255]^d[p++],h=e,e=f,f=g,g=b,b=h;return t}
sjcl.bitArray={bitSlice:function(a,b,c){a=sjcl.bitArray.P(a.slice(b/32),32-(b&31)).slice(1);return c===s?a:sjcl.bitArray.clamp(a,c-b)},extract:function(a,b,c){var d=Math.floor(-b-c&31);return((b+c-1^b)&-32?a[b/32|0]<<32-d^a[b/32+1|0]>>>d:a[b/32|0]>>>d)&(1<<c)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var c=a[a.length-1],d=sjcl.bitArray.getPartial(c);return 32===d?a.concat(b):sjcl.bitArray.P(b,d,c|0,a.slice(0,a.length-1))},bitLength:function(a){var b=a.length;return 0===
b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var c=a.length;b&=31;0<c&&b&&(a[c-1]=sjcl.bitArray.partial(b,a[c-1]&2147483648>>b-1,1));return a},partial:function(a,b,c){return 32===a?b:(c?b|0:b<<32-a)+0x10000000000*a},getPartial:function(a){return Math.round(a/0x10000000000)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return u;var c=0,d;for(d=0;d<a.length;d++)c|=a[d]^b[d];return 0===
c},P:function(a,b,c,d){var e;e=0;for(d===s&&(d=[]);32<=b;b-=32)d.push(c),c=0;if(0===b)return d.concat(a);for(e=0;e<a.length;e++)d.push(c|a[e]>>>b),c=a[e]<<32-b;e=a.length?a[a.length-1]:0;a=sjcl.bitArray.getPartial(e);d.push(sjcl.bitArray.partial(b+a&31,32<b+a?c:d.pop(),1));return d},l:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,c;for(b=0;b<a.length;++b)c=a[b],a[b]=c>>>24|c>>>8&0xff00|(c&0xff00)<<8|c<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",c=sjcl.bitArray.bitLength(a),d,e;for(d=0;d<c/8;d++)0===(d&3)&&(e=a[d/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],c,d=0;for(c=0;c<a.length;c++)d=d<<8|a.charCodeAt(c),3===(c&3)&&(b.push(d),d=0);c&3&&b.push(sjcl.bitArray.partial(8*(c&3),d));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",c;for(c=0;c<a.length;c++)b+=((a[c]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,c=[],d;a=a.replace(/\s|0x/g,"");d=a.length;a+="00000000";for(b=0;b<a.length;b+=8)c.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(c,4*d)}};
sjcl.codec.base64={J:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(a,b,c){var d="",e=0,f=sjcl.codec.base64.J,g=0,h=sjcl.bitArray.bitLength(a);c&&(f=f.substr(0,62)+"-_");for(c=0;6*d.length<h;)d+=f.charAt((g^a[c]>>>e)>>>26),6>e?(g=a[c]<<6-e,e+=26,c++):(g<<=6,e-=6);for(;d.length&3&&!b;)d+="=";return d},toBits:function(a,b){a=a.replace(/\s|=/g,"");var c=[],d,e=0,f=sjcl.codec.base64.J,g=0,h;b&&(f=f.substr(0,62)+"-_");for(d=0;d<a.length;d++)h=f.indexOf(a.charAt(d)),
0>h&&q(new sjcl.exception.invalid("this isn't base64!")),26<e?(e-=26,c.push(g^h>>>e),g=h<<32-e):(e+=6,g^=h<<32-e);e&56&&c.push(sjcl.bitArray.partial(e&56,g,1));return c}};sjcl.codec.base64url={fromBits:function(a){return sjcl.codec.base64.fromBits(a,1,1)},toBits:function(a){return sjcl.codec.base64.toBits(a,1)}};sjcl.hash.sha256=function(a){this.b[0]||this.D();a?(this.r=a.r.slice(0),this.o=a.o.slice(0),this.h=a.h):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this.r=this.N.slice(0);this.o=[];this.h=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,c=this.o=sjcl.bitArray.concat(this.o,a);b=this.h;a=this.h=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)x(this,c.splice(0,16));return this},finalize:function(){var a,b=this.o,c=this.r,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this.h/
4294967296));for(b.push(this.h|0);b.length;)x(this,b.splice(0,16));this.reset();return c},N:[],b:[],D:function(){function a(a){return 0x100000000*(a-Math.floor(a))|0}var b=0,c=2,d;a:for(;64>b;c++){for(d=2;d*d<=c;d++)if(0===c%d)continue a;8>b&&(this.N[b]=a(Math.pow(c,0.5)));this.b[b]=a(Math.pow(c,1/3));b++}}};
function x(a,b){var c,d,e,f=b.slice(0),g=a.r,h=a.b,l=g[0],k=g[1],n=g[2],m=g[3],p=g[4],t=g[5],r=g[6],v=g[7];for(c=0;64>c;c++)16>c?d=f[c]:(d=f[c+1&15],e=f[c+14&15],d=f[c&15]=(d>>>7^d>>>18^d>>>3^d<<25^d<<14)+(e>>>17^e>>>19^e>>>10^e<<15^e<<13)+f[c&15]+f[c+9&15]|0),d=d+v+(p>>>6^p>>>11^p>>>25^p<<26^p<<21^p<<7)+(r^p&(t^r))+h[c],v=r,r=t,t=p,p=m+d|0,m=n,n=k,k=l,l=d+(k&n^m&(k^n))+(k>>>2^k>>>13^k>>>22^k<<30^k<<19^k<<10)|0;g[0]=g[0]+l|0;g[1]=g[1]+k|0;g[2]=g[2]+n|0;g[3]=g[3]+m|0;g[4]=g[4]+p|0;g[5]=g[5]+t|0;g[6]=
g[6]+r|0;g[7]=g[7]+v|0}
sjcl.mode.ccm={name:"ccm",encrypt:function(a,b,c,d,e){var f,g=b.slice(0),h=sjcl.bitArray,l=h.bitLength(c)/8,k=h.bitLength(g)/8;e=e||64;d=d||[];7>l&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(f=2;4>f&&k>>>8*f;f++);f<15-l&&(f=15-l);c=h.clamp(c,8*(15-f));b=sjcl.mode.ccm.L(a,b,c,d,e,f);g=sjcl.mode.ccm.p(a,g,c,b,e,f);return h.concat(g.data,g.tag)},decrypt:function(a,b,c,d,e){e=e||64;d=d||[];var f=sjcl.bitArray,g=f.bitLength(c)/8,h=f.bitLength(b),l=f.clamp(b,h-e),k=f.bitSlice(b,
h-e),h=(h-e)/8;7>g&&q(new sjcl.exception.invalid("ccm: iv must be at least 7 bytes"));for(b=2;4>b&&h>>>8*b;b++);b<15-g&&(b=15-g);c=f.clamp(c,8*(15-b));l=sjcl.mode.ccm.p(a,l,c,k,e,b);a=sjcl.mode.ccm.L(a,l.data,c,d,e,b);f.equal(l.tag,a)||q(new sjcl.exception.corrupt("ccm: tag doesn't match"));return l.data},L:function(a,b,c,d,e,f){var g=[],h=sjcl.bitArray,l=h.l;e/=8;(e%2||4>e||16<e)&&q(new sjcl.exception.invalid("ccm: invalid tag length"));(0xffffffff<d.length||0xffffffff<b.length)&&q(new sjcl.exception.bug("ccm: can't deal with 4GiB or more data"));
f=[h.partial(8,(d.length?64:0)|e-2<<2|f-1)];f=h.concat(f,c);f[3]|=h.bitLength(b)/8;f=a.encrypt(f);if(d.length){c=h.bitLength(d)/8;65279>=c?g=[h.partial(16,c)]:0xffffffff>=c&&(g=h.concat([h.partial(16,65534)],[c]));g=h.concat(g,d);for(d=0;d<g.length;d+=4)f=a.encrypt(l(f,g.slice(d,d+4).concat([0,0,0])))}for(d=0;d<b.length;d+=4)f=a.encrypt(l(f,b.slice(d,d+4).concat([0,0,0])));return h.clamp(f,8*e)},p:function(a,b,c,d,e,f){var g,h=sjcl.bitArray;g=h.l;var l=b.length,k=h.bitLength(b);c=h.concat([h.partial(8,
f-1)],c).concat([0,0,0]).slice(0,4);d=h.bitSlice(g(d,a.encrypt(c)),0,e);if(!l)return{tag:d,data:[]};for(g=0;g<l;g+=4)c[3]++,e=a.encrypt(c),b[g]^=e[0],b[g+1]^=e[1],b[g+2]^=e[2],b[g+3]^=e[3];return{tag:d,data:h.clamp(b,k)}}};
sjcl.mode.ocb2={name:"ocb2",encrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));var g,h=sjcl.mode.ocb2.H,l=sjcl.bitArray,k=l.l,n=[0,0,0,0];c=h(a.encrypt(c));var m,p=[];d=d||[];e=e||64;for(g=0;g+4<b.length;g+=4)m=b.slice(g,g+4),n=k(n,m),p=p.concat(k(c,a.encrypt(k(c,m)))),c=h(c);m=b.slice(g);b=l.bitLength(m);g=a.encrypt(k(c,[0,0,0,b]));m=l.clamp(k(m.concat([0,0,0]),g),b);n=k(n,k(m.concat([0,0,0]),g));n=a.encrypt(k(n,k(c,h(c))));d.length&&
(n=k(n,f?d:sjcl.mode.ocb2.pmac(a,d)));return p.concat(l.concat(m,l.clamp(n,e)))},decrypt:function(a,b,c,d,e,f){128!==sjcl.bitArray.bitLength(c)&&q(new sjcl.exception.invalid("ocb iv must be 128 bits"));e=e||64;var g=sjcl.mode.ocb2.H,h=sjcl.bitArray,l=h.l,k=[0,0,0,0],n=g(a.encrypt(c)),m,p,t=sjcl.bitArray.bitLength(b)-e,r=[];d=d||[];for(c=0;c+4<t/32;c+=4)m=l(n,a.decrypt(l(n,b.slice(c,c+4)))),k=l(k,m),r=r.concat(m),n=g(n);p=t-32*c;m=a.encrypt(l(n,[0,0,0,p]));m=l(m,h.clamp(b.slice(c),p).concat([0,0,0]));
k=l(k,m);k=a.encrypt(l(k,l(n,g(n))));d.length&&(k=l(k,f?d:sjcl.mode.ocb2.pmac(a,d)));h.equal(h.clamp(k,e),h.bitSlice(b,t))||q(new sjcl.exception.corrupt("ocb: tag doesn't match"));return r.concat(h.clamp(m,p))},pmac:function(a,b){var c,d=sjcl.mode.ocb2.H,e=sjcl.bitArray,f=e.l,g=[0,0,0,0],h=a.encrypt([0,0,0,0]),h=f(h,d(d(h)));for(c=0;c+4<b.length;c+=4)h=d(h),g=f(g,a.encrypt(f(h,b.slice(c,c+4))));c=b.slice(c);128>e.bitLength(c)&&(h=f(h,d(h)),c=e.concat(c,[-2147483648,0,0,0]));g=f(g,c);return a.encrypt(f(d(f(h,
d(h))),g))},H:function(a){return[a[0]<<1^a[1]>>>31,a[1]<<1^a[2]>>>31,a[2]<<1^a[3]>>>31,a[3]<<1^135*(a[0]>>>31)]}};
sjcl.mode.gcm={name:"gcm",encrypt:function(a,b,c,d,e){var f=b.slice(0);b=sjcl.bitArray;d=d||[];a=sjcl.mode.gcm.p(!0,a,f,d,c,e||128);return b.concat(a.data,a.tag)},decrypt:function(a,b,c,d,e){var f=b.slice(0),g=sjcl.bitArray,h=g.bitLength(f);e=e||128;d=d||[];e<=h?(b=g.bitSlice(f,h-e),f=g.bitSlice(f,0,h-e)):(b=f,f=[]);a=sjcl.mode.gcm.p(u,a,f,d,c,e);g.equal(a.tag,b)||q(new sjcl.exception.corrupt("gcm: tag doesn't match"));return a.data},Z:function(a,b){var c,d,e,f,g,h=sjcl.bitArray.l;e=[0,0,0,0];f=b.slice(0);
for(c=0;128>c;c++){(d=0!==(a[Math.floor(c/32)]&1<<31-c%32))&&(e=h(e,f));g=0!==(f[3]&1);for(d=3;0<d;d--)f[d]=f[d]>>>1|(f[d-1]&1)<<31;f[0]>>>=1;g&&(f[0]^=-0x1f000000)}return e},g:function(a,b,c){var d,e=c.length;b=b.slice(0);for(d=0;d<e;d+=4)b[0]^=0xffffffff&c[d],b[1]^=0xffffffff&c[d+1],b[2]^=0xffffffff&c[d+2],b[3]^=0xffffffff&c[d+3],b=sjcl.mode.gcm.Z(b,a);return b},p:function(a,b,c,d,e,f){var g,h,l,k,n,m,p,t,r=sjcl.bitArray;m=c.length;p=r.bitLength(c);t=r.bitLength(d);h=r.bitLength(e);g=b.encrypt([0,
0,0,0]);96===h?(e=e.slice(0),e=r.concat(e,[1])):(e=sjcl.mode.gcm.g(g,[0,0,0,0],e),e=sjcl.mode.gcm.g(g,e,[0,0,Math.floor(h/0x100000000),h&0xffffffff]));h=sjcl.mode.gcm.g(g,[0,0,0,0],d);n=e.slice(0);d=h.slice(0);a||(d=sjcl.mode.gcm.g(g,h,c));for(k=0;k<m;k+=4)n[3]++,l=b.encrypt(n),c[k]^=l[0],c[k+1]^=l[1],c[k+2]^=l[2],c[k+3]^=l[3];c=r.clamp(c,p);a&&(d=sjcl.mode.gcm.g(g,h,c));a=[Math.floor(t/0x100000000),t&0xffffffff,Math.floor(p/0x100000000),p&0xffffffff];d=sjcl.mode.gcm.g(g,d,a);l=b.encrypt(e);d[0]^=l[0];
d[1]^=l[1];d[2]^=l[2];d[3]^=l[3];return{tag:r.bitSlice(d,0,f),data:c}}};sjcl.misc.hmac=function(a,b){this.M=b=b||sjcl.hash.sha256;var c=[[],[]],d,e=b.prototype.blockSize/32;this.n=[new b,new b];a.length>e&&(a=b.hash(a));for(d=0;d<e;d++)c[0][d]=a[d]^909522486,c[1][d]=a[d]^1549556828;this.n[0].update(c[0]);this.n[1].update(c[1]);this.G=new b(this.n[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){this.Q&&q(new sjcl.exception.invalid("encrypt on already updated hmac called!"));this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this.G=new this.M(this.n[0]);this.Q=u};sjcl.misc.hmac.prototype.update=function(a){this.Q=!0;this.G.update(a)};sjcl.misc.hmac.prototype.digest=function(){var a=this.G.finalize(),a=(new this.M(this.n[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,c,d,e){c=c||1E3;(0>d||0>c)&&q(sjcl.exception.invalid("invalid params to pbkdf2"));"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var f,g,h,l,k=[],n=sjcl.bitArray;for(l=1;32*k.length<(d||1);l++){e=f=a.encrypt(n.concat(b,[l]));for(g=1;g<c;g++){f=a.encrypt(f);for(h=0;h<f.length;h++)e[h]^=f[h]}k=k.concat(e)}d&&(k=n.clamp(k,d));return k};
sjcl.prng=function(a){this.c=[new sjcl.hash.sha256];this.i=[0];this.F=0;this.s={};this.C=0;this.K={};this.O=this.d=this.j=this.W=0;this.b=[0,0,0,0,0,0,0,0];this.f=[0,0,0,0];this.A=s;this.B=a;this.q=u;this.w={progress:{},seeded:{}};this.m=this.V=0;this.t=1;this.u=2;this.S=0x10000;this.I=[0,48,64,96,128,192,0x100,384,512,768,1024];this.T=3E4;this.R=80};
sjcl.prng.prototype={randomWords:function(a,b){var c=[],d;d=this.isReady(b);var e;d===this.m&&q(new sjcl.exception.notReady("generator isn't seeded"));if(d&this.u){d=!(d&this.t);e=[];var f=0,g;this.O=e[0]=(new Date).valueOf()+this.T;for(g=0;16>g;g++)e.push(0x100000000*Math.random()|0);for(g=0;g<this.c.length&&!(e=e.concat(this.c[g].finalize()),f+=this.i[g],this.i[g]=0,!d&&this.F&1<<g);g++);this.F>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.i.push(0));this.d-=f;f>this.j&&(this.j=f);this.F++;
this.b=sjcl.hash.sha256.hash(this.b.concat(e));this.A=new sjcl.cipher.aes(this.b);for(d=0;4>d&&!(this.f[d]=this.f[d]+1|0,this.f[d]);d++);}for(d=0;d<a;d+=4)0===(d+1)%this.S&&A(this),e=B(this),c.push(e[0],e[1],e[2],e[3]);A(this);return c.slice(0,a)},setDefaultParanoia:function(a,b){0===a&&"Setting paranoia=0 will ruin your security; use it only for testing"!==b&&q("Setting paranoia=0 will ruin your security; use it only for testing");this.B=a},addEntropy:function(a,b,c){c=c||"user";var d,e,f=(new Date).valueOf(),
g=this.s[c],h=this.isReady(),l=0;d=this.K[c];d===s&&(d=this.K[c]=this.W++);g===s&&(g=this.s[c]=0);this.s[c]=(this.s[c]+1)%this.c.length;switch(typeof a){case "number":b===s&&(b=1);this.c[g].update([d,this.C++,1,b,f,1,a|0]);break;case "object":c=Object.prototype.toString.call(a);if("[object Uint32Array]"===c){e=[];for(c=0;c<a.length;c++)e.push(a[c]);a=e}else{"[object Array]"!==c&&(l=1);for(c=0;c<a.length&&!l;c++)"number"!==typeof a[c]&&(l=1)}if(!l){if(b===s)for(c=b=0;c<a.length;c++)for(e=a[c];0<e;)b++,
e>>>=1;this.c[g].update([d,this.C++,2,b,f,a.length].concat(a))}break;case "string":b===s&&(b=a.length);this.c[g].update([d,this.C++,3,b,f,a.length]);this.c[g].update(a);break;default:l=1}l&&q(new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string"));this.i[g]+=b;this.d+=b;h===this.m&&(this.isReady()!==this.m&&C("seeded",Math.max(this.j,this.d)),C("progress",this.getProgress()))},isReady:function(a){a=this.I[a!==s?a:this.B];return this.j&&this.j>=a?this.i[0]>this.R&&
(new Date).valueOf()>this.O?this.u|this.t:this.t:this.d>=a?this.u|this.m:this.m},getProgress:function(a){a=this.I[a?a:this.B];return this.j>=a?1:this.d>a?1:this.d/a},startCollectors:function(){this.q||(this.a={loadTimeCollector:D(this,this.aa),mouseCollector:D(this,this.ba),keyboardCollector:D(this,this.$),accelerometerCollector:D(this,this.U),touchCollector:D(this,this.da)},window.addEventListener?(window.addEventListener("load",this.a.loadTimeCollector,u),window.addEventListener("mousemove",this.a.mouseCollector,
u),window.addEventListener("keypress",this.a.keyboardCollector,u),window.addEventListener("devicemotion",this.a.accelerometerCollector,u),window.addEventListener("touchmove",this.a.touchCollector,u)):document.attachEvent?(document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)):q(new sjcl.exception.bug("can't attach event")),this.q=!0)},stopCollectors:function(){this.q&&(window.removeEventListener?
(window.removeEventListener("load",this.a.loadTimeCollector,u),window.removeEventListener("mousemove",this.a.mouseCollector,u),window.removeEventListener("keypress",this.a.keyboardCollector,u),window.removeEventListener("devicemotion",this.a.accelerometerCollector,u),window.removeEventListener("touchmove",this.a.touchCollector,u)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",
this.a.keyboardCollector)),this.q=u)},addEventListener:function(a,b){this.w[a][this.V++]=b},removeEventListener:function(a,b){var c,d,e=this.w[a],f=[];for(d in e)e.hasOwnProperty(d)&&e[d]===b&&f.push(d);for(c=0;c<f.length;c++)d=f[c],delete e[d]},$:function(){E(1)},ba:function(a){var b,c;try{b=a.x||a.clientX||a.offsetX||0,c=a.y||a.clientY||a.offsetY||0}catch(d){c=b=0}0!=b&&0!=c&&sjcl.random.addEntropy([b,c],2,"mouse");E(0)},da:function(a){a=a.touches[0]||a.changedTouches[0];sjcl.random.addEntropy([a.pageX||
a.clientX,a.pageY||a.clientY],1,"touch");E(0)},aa:function(){E(2)},U:function(a){a=a.accelerationIncludingGravity.x||a.accelerationIncludingGravity.y||a.accelerationIncludingGravity.z;if(window.orientation){var b=window.orientation;"number"===typeof b&&sjcl.random.addEntropy(b,1,"accelerometer")}a&&sjcl.random.addEntropy(a,2,"accelerometer");E(0)}};function C(a,b){var c,d=sjcl.random.w[a],e=[];for(c in d)d.hasOwnProperty(c)&&e.push(d[c]);for(c=0;c<e.length;c++)e[c](b)}
function E(a){"undefined"!==typeof window&&window.performance&&"function"===typeof window.performance.now?sjcl.random.addEntropy(window.performance.now(),a,"loadtime"):sjcl.random.addEntropy((new Date).valueOf(),a,"loadtime")}function A(a){a.b=B(a).concat(B(a));a.A=new sjcl.cipher.aes(a.b)}function B(a){for(var b=0;4>b&&!(a.f[b]=a.f[b]+1|0,a.f[b]);b++);return a.A.encrypt(a.f)}function D(a,b){return function(){b.apply(a,arguments)}}sjcl.random=new sjcl.prng(6);
a:try{var F,G,H,I;if(I="undefined"!==typeof module){var J;if(J=module.exports){var K;try{K=require("crypto")}catch(L){K=null}J=(G=K)&&G.randomBytes}I=J}if(I)F=G.randomBytes(128),F=new Uint32Array((new Uint8Array(F)).buffer),sjcl.random.addEntropy(F,1024,"crypto['randomBytes']");else if("undefined"!==typeof window&&"undefined"!==typeof Uint32Array){H=new Uint32Array(32);if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(H);else if(window.msCrypto&&window.msCrypto.getRandomValues)window.msCrypto.getRandomValues(H);
else break a;sjcl.random.addEntropy(H,1024,"crypto['getRandomValues']")}}catch(M){"undefined"!==typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(M))}
sjcl.json={defaults:{v:1,iter:1E3,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},Y:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json,f=e.e({iv:sjcl.random.randomWords(4,0)},e.defaults),g;e.e(f,c);c=f.adata;"string"===typeof f.salt&&(f.salt=sjcl.codec.base64.toBits(f.salt));"string"===typeof f.iv&&(f.iv=sjcl.codec.base64.toBits(f.iv));(!sjcl.mode[f.mode]||!sjcl.cipher[f.cipher]||"string"===typeof a&&100>=f.iter||64!==f.ts&&96!==f.ts&&128!==f.ts||128!==f.ks&&192!==f.ks&&0x100!==f.ks||2>f.iv.length||4<
f.iv.length)&&q(new sjcl.exception.invalid("json encrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,f),a=g.key.slice(0,f.ks/32),f.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.publicKey&&(g=a.kem(),f.kemtag=g.tag,a=g.key.slice(0,f.ks/32));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));"string"===typeof c&&(f.adata=c=sjcl.codec.utf8String.toBits(c));g=new sjcl.cipher[f.cipher](a);e.e(d,f);d.key=a;f.ct=sjcl.mode[f.mode].encrypt(g,b,f.iv,c,f.ts);return f},
encrypt:function(a,b,c,d){var e=sjcl.json,f=e.Y.apply(e,arguments);return e.encode(f)},X:function(a,b,c,d){c=c||{};d=d||{};var e=sjcl.json;b=e.e(e.e(e.e({},e.defaults),b),c,!0);var f,g;f=b.adata;"string"===typeof b.salt&&(b.salt=sjcl.codec.base64.toBits(b.salt));"string"===typeof b.iv&&(b.iv=sjcl.codec.base64.toBits(b.iv));(!sjcl.mode[b.mode]||!sjcl.cipher[b.cipher]||"string"===typeof a&&100>=b.iter||64!==b.ts&&96!==b.ts&&128!==b.ts||128!==b.ks&&192!==b.ks&&0x100!==b.ks||!b.iv||2>b.iv.length||4<b.iv.length)&&
q(new sjcl.exception.invalid("json decrypt: invalid parameters"));"string"===typeof a?(g=sjcl.misc.cachedPbkdf2(a,b),a=g.key.slice(0,b.ks/32),b.salt=g.salt):sjcl.ecc&&a instanceof sjcl.ecc.elGamal.secretKey&&(a=a.unkem(sjcl.codec.base64.toBits(b.kemtag)).slice(0,b.ks/32));"string"===typeof f&&(f=sjcl.codec.utf8String.toBits(f));g=new sjcl.cipher[b.cipher](a);f=sjcl.mode[b.mode].decrypt(g,b.ct,b.iv,f,b.ts);e.e(d,b);d.key=a;return 1===c.raw?f:sjcl.codec.utf8String.fromBits(f)},decrypt:function(a,b,
c,d){var e=sjcl.json;return e.X(a,e.decode(b),c,d)},encode:function(a){var b,c="{",d="";for(b in a)if(a.hasOwnProperty(b))switch(b.match(/^[a-z0-9]+$/i)||q(new sjcl.exception.invalid("json encode: invalid property name")),c+=d+'"'+b+'":',d=",",typeof a[b]){case "number":case "boolean":c+=a[b];break;case "string":c+='"'+escape(a[b])+'"';break;case "object":c+='"'+sjcl.codec.base64.fromBits(a[b],0)+'"';break;default:q(new sjcl.exception.bug("json encode: unsupported type"))}return c+"}"},decode:function(a){a=
a.replace(/\s/g,"");a.match(/^\{.*\}$/)||q(new sjcl.exception.invalid("json decode: this isn't json!"));a=a.replace(/^\{|\}$/g,"").split(/,/);var b={},c,d;for(c=0;c<a.length;c++)(d=a[c].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i))||q(new sjcl.exception.invalid("json decode: this isn't json!")),d[3]?b[d[2]]=parseInt(d[3],10):d[4]?b[d[2]]=d[2].match(/^(ct|adata|salt|iv)$/)?sjcl.codec.base64.toBits(d[4]):unescape(d[4]):d[5]&&(b[d[2]]="true"===
d[5]);return b},e:function(a,b,c){a===s&&(a={});if(b===s)return a;for(var d in b)b.hasOwnProperty(d)&&(c&&(a[d]!==s&&a[d]!==b[d])&&q(new sjcl.exception.invalid("required parameter overridden")),a[d]=b[d]);return a},fa:function(a,b){var c={},d;for(d in a)a.hasOwnProperty(d)&&a[d]!==b[d]&&(c[d]=a[d]);return c},ea:function(a,b){var c={},d;for(d=0;d<b.length;d++)a[b[d]]!==s&&(c[b[d]]=a[b[d]]);return c}};sjcl.encrypt=sjcl.json.encrypt;sjcl.decrypt=sjcl.json.decrypt;sjcl.misc.ca={};
sjcl.misc.cachedPbkdf2=function(a,b){var c=sjcl.misc.ca,d;b=b||{};d=b.iter||1E3;c=c[a]=c[a]||{};d=c[d]=c[d]||{firstSalt:b.salt&&b.salt.length?b.salt.slice(0):sjcl.random.randomWords(2,0)};c=b.salt===s?d.firstSalt:b.salt;d[c]=d[c]||sjcl.misc.pbkdf2(a,c,b.iter);return{key:d[c].slice(0),salt:c.slice(0)}};

var glue=function(e,n){"use strict";var t,o,i,c,r,a,s,u,l=function(){var t,o={};return o.open=function(){try{var i;i=e.match("^https://")?"wss"+e.substr(5):"ws"+e.substr(4),i+=n.baseURL+"ws",t=new WebSocket(i),t.onmessage=function(e){o.onMessage(e.data.toString())},t.onerror=function(e){var n="the websocket closed the connection with ";n+=e.code?"the error code: "+e.code:"an error.",o.onError(n)},t.onclose=function(){o.onClose()},t.onopen=function(){o.onOpen()}}catch(c){o.onError()}},o.send=function(e){t.send(e)},o.reset=function(){t&&t.close(),t=void 0},o},d=function(){var t,o,i,c=e+n.baseURL+"ajax",r=8e3,a=45e3,s={Timeout:"t",Closed:"c"},u={Delimiter:"&",Init:"i",Push:"u",Poll:"o"},l={},d=!1,f=!1,g=function(){i=function(){},d&&d.abort(),f&&f.abort()},v=function(){g(),l.onClose()},m=function(e){g(),e=e?"the ajax socket closed the connection with the error: "+e:"the ajax socket closed the connection with an error.",l.onError(e)},h=function(e,n){f=$.ajax({url:c,success:function(e){f=!1,n&&n(e)},error:function(e,n){f=!1,m(n)},type:"POST",data:e,dataType:"text",timeout:r})};return i=function(){d=$.ajax({url:c,success:function(e){if(d=!1,e==s.Timeout)return void i();if(e==s.Closed)return void v();var n=e.indexOf(u.Delimiter);return 0>n?void m("ajax socket: failed to split poll token from data!"):(o=e.substring(0,n),e=e.substr(n+1),i(),void l.onMessage(e))},error:function(e,n){d=!1,m(n)},type:"POST",data:u.Poll+t+u.Delimiter+o,dataType:"text",timeout:a})},l.open=function(){h(u.Init,function(e){var n=e.indexOf(u.Delimiter);return 0>n?void m("ajax socket: failed to split uid and poll token from data!"):(t=e.substring(0,n),o=e.substr(n+1),i(),void l.onOpen())})},l.send=function(e){h(u.Push+t+u.Delimiter+e)},l.reset=function(){g()},l},f="1.7.0",g="m",v={WebSocket:"WebSocket",AjaxSocket:"AjaxSocket"},m={Len:2,Init:"in",Ping:"pi",Pong:"po",Close:"cl",Invalid:"iv",DontAutoReconnect:"dr",ChannelData:"cd"},h={Disconnected:"disconnected",Connecting:"connecting",Reconnecting:"reconnecting",Connected:"connected"},p={baseURL:"/glue/",forceSocketType:!1,connectTimeout:1e4,pingInterval:35e3,pingReconnectTimeout:5e3,reconnect:!0,reconnectDelay:1e3,reconnectDelayMax:5e3,reconnectAttempts:10,resetSendBufferTimeout:1e4},b=!1,k=!1,D=h.Disconnected,T=0,x=!1,y=!1,S=!1,C=!1,M=[],w=!1,R=!1,O=!1,I=[],L="",P=function(){var e="&",n={};return n.unmarshalValues=function(n){if(!n)return!1;var t=n.indexOf(e),o=parseInt(n.substring(0,t),10);if(n=n.substring(t+1),0>o||o>n.length)return!1;var i=n.substr(0,o),c=n.substr(o);return{first:i,second:c}},n.marshalValues=function(n,t){return String(n.length)+e+n+t},n}(),j=function(){var e={},n={},t=function(e){var n={onMessageFunc:function(){}};return n.instance={onMessage:function(e){n.onMessageFunc=e},send:function(n,t){return n?a(m.ChannelData,P.marshalValues(e,n),t):-1}},n};return e.get=function(e){if(!e)return!1;var o=n[e];return o?o.instance:(o=t(e),n[e]=o,o.instance)},e.emitOnMessage=function(e,t){if(e&&t){var o=n[e];if(!o)return void console.log("glue: channel '"+e+"': emit onMessage event: channel does not exists");try{o.onMessageFunc(t)}catch(i){return void console.log("glue: channel '"+e+"': onMessage event call failed: "+i.message)}}},e}();r=function(e){return b?O?void b.send(e):void I.push(e):void 0};var A=function(){if(0!==I.length){for(var e=0;e<I.length;e++)r(I[e]);I=[]}},U=function(){R=!1,w!==!1&&(clearTimeout(w),w=!1)},W=function(){w!==!1||R||(w=setTimeout(function(){if(w=!1,R=!0,0!==M.length){for(var e,n=0;n<M.length;n++)if(e=M[n],e.discardCallback&&$.isFunction(e.discardCallback))try{e.discardCallback(e.data)}catch(t){console.log("glue: failed to call discard callback: "+t.message)}u("discard_send_buffer"),M=[]}},n.resetSendBufferTimeout))},E=function(){if(U(),0!==M.length){for(var e,n=0;n<M.length;n++)e=M[n],r(e.cmd+e.data);M=[]}};a=function(e,n,t){return n||(n=""),b&&D===h.Connected?(r(e+n),1):R?(t&&$.isFunction(t)&&t(n),-1):(W(),M.push({cmd:e,data:n,discardCallback:t}),0)};var F=function(){y!==!1&&(clearTimeout(y),y=!1)},q=function(){F(),y=setTimeout(function(){y=!1,u("connect_timeout"),s()},n.connectTimeout)},V=function(){S!==!1&&(clearTimeout(S),S=!1),C!==!1&&(clearTimeout(C),C=!1)},_=function(){V(),S=setTimeout(function(){S=!1,r(m.Ping),C=setTimeout(function(){C=!1,u("timeout"),s()},n.pingReconnectTimeout)},n.pingInterval)},z=function(){return k?void(b=o()):T>1?(o=d,b=o(),void(i=v.AjaxSocket)):(!n.forceSocketType&&window.WebSocket||n.forceSocketType===v.WebSocket?(o=l,i=v.WebSocket):(o=d,i=v.AjaxSocket),void(b=o()))},B=function(e){return e=JSON.parse(e),e.socketID?(L=e.socketID,O=!0,A(),D=h.Connected,u("connected"),void setTimeout(E,0)):(c(),void console.log("glue: socket initialization failed: invalid initialization data received"))},J=function(){z(),b.onOpen=function(){F(),T=0,k=!0,_();var e={version:f};e=JSON.stringify(e),b.send(m.Init+e)},b.onClose=function(){s()},b.onError=function(e){u("error",[e]),s()},b.onMessage=function(e){if(_(),e.length<m.Len)return void console.log("glue: received invalid data from server: data is too short.");var n=e.substr(0,m.Len);if(e=e.substr(m.Len),n===m.Ping)r(m.Pong);else if(n===m.Pong);else if(n===m.Invalid)console.log("glue: server replied with an invalid request notification!");else if(n===m.DontAutoReconnect)x=!0,console.log("glue: server replied with an don't automatically reconnect request. This might be due to an incompatible protocol version.");else if(n===m.Init)B(e);else if(n===m.ChannelData){var t=P.unmarshalValues(e);if(!t)return void console.log("glue: server requested an invalid channel data request: "+e);j.emitOnMessage(t.first,t.second)}else console.log("glue: received invalid data from server with command '"+n+"' and data '"+e+"'!")},setTimeout(function(){T>0?(D=h.Reconnecting,u("reconnecting")):(D=h.Connecting,u("connecting")),q(),b.open()},0)},N=function(){F(),V(),O=!1,L="",I=[],b&&(b.onOpen=b.onClose=b.onMessage=b.onError=function(){},b.reset(),b=!1)};if(s=function(){if(N(),n.reconnectAttempts>0&&T>n.reconnectAttempts||n.reconnect===!1||x)return D=h.Disconnected,void u("disconnected");T+=1;var e=n.reconnectDelay*T;e>n.reconnectDelayMax&&(e=n.reconnectDelayMax),setTimeout(function(){J()},e)},c=function(){b&&(r(m.Close),N(),D=h.Disconnected,u("disconnected"))},t=j.get(g),e||(e=window.location.protocol+"//"+window.location.host),!e.match("^http://")&&!e.match("^https://"))return void console.log("glue: invalid host: missing 'http://' or 'https://'!");n=$.extend(p,n),n.reconnectDelayMax<n.reconnectDelay&&(n.reconnectDelayMax=n.reconnectDelay),0!==n.baseURL.indexOf("/")&&(n.baseURL="/"+n.baseURL),"/"!==n.baseURL.slice(-1)&&(n.baseURL=n.baseURL+"/"),J();var H={version:function(){return f},type:function(){return i},state:function(){return D},socketID:function(){return L},send:function(e,n){t.send(e,n)},onMessage:function(e){t.onMessage(e)},on:function(){var e=$(H);e.on.apply(e,arguments)},reconnect:function(){D===h.Disconnected&&(T=0,x=!1,s())},close:function(){c()},channel:function(e){return j.get(e)}};return u=function(){var e=$(H);e.triggerHandler.apply(e,arguments)},H};

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

    // If host is undefined, then set it to an empty string.
    if (!host) {
        host = "";
    }

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

    var authTokenID = "BMAuthToken";


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

        // If not present, just return.
        if (!token) {
            return "";
        }

        // Decrypt. The password is not secure, but this is better than saving
        // the token in plaintext in the storage.
        // A possible extension would be to ask the user for a pin...
        token = sjcl.decrypt(getFingerprint(), token);

        return token;
    }

    function setAuthToken(token) {
        // Encrypt. The password is not secure, but this is better than saving
        // the token in plaintext in the storage.
        // A possible extension would be to ask the user for a pin...
        token = sjcl.encrypt(getFingerprint(), token);

        // Check if the local storage is available.
        if (utils.storageAvailable('localStorage')) {
            // Save the token in the local storage.
            localStorage.setItem(authTokenID, token);
        }
        else {
            // Use a cookie as storage alternative.
            // Set any cookie path and domain.
            // This cookie is only used in javascript.
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
    // Returns false if no authentication data is present.
    // If no authentication data is present, then the error callback is not triggered.
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

        // Create the module method parameters.
        var data = {
            token:         authToken,
            fingerprint:   getFingerprint()
        };

        // The success callback for the authentication request.
        var onSuccess = function(data) {
            // Validate, that a correct user is returned.
            if (!data.user || !data.user.id) {
                callErrorCallback("invalid user data received");
                logout();
                return;
            }

            // Check if the authentication token has changed.
            if (data.token) {
                // Set the new auth token.
                setAuthToken(data.token);
            }

            // Set the current authenticated user.
            setCurrentUserID(data.user.id);

            // Call the success callback.
            if (callback) {
                utils.callCatch(callback);
            }
        };

        // Perform the actual authentication.
        module.call("authenticate", data, onSuccess, function(err) {
            // On error, retry once again.
            // The authentication token might have changed just in that moment
            // in another tab session.
            module.call("authenticate", data, onSuccess, function(err) {
                callErrorCallback(err);
            });
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

                // Finally authenticate the session.
                if (!authenticate(callback, errorCallback)) {
                    callErrorCallback("authentication failed");
                    return;
                }
            }, function(err) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJCaXRNb25zdGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vLyBJbmNsdWRlIHRoZSByZXF1aXJlZCBsaWJyYXJpZXMgZGlyZWN0bHkuXG5cInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBxKGEpe3Rocm93IGE7fXZhciBzPXZvaWQgMCx1PSExO3ZhciBzamNsPXtjaXBoZXI6e30saGFzaDp7fSxrZXlleGNoYW5nZTp7fSxtb2RlOnt9LG1pc2M6e30sY29kZWM6e30sZXhjZXB0aW9uOntjb3JydXB0OmZ1bmN0aW9uKGEpe3RoaXMudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIkNPUlJVUFQ6IFwiK3RoaXMubWVzc2FnZX07dGhpcy5tZXNzYWdlPWF9LGludmFsaWQ6ZnVuY3Rpb24oYSl7dGhpcy50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiSU5WQUxJRDogXCIrdGhpcy5tZXNzYWdlfTt0aGlzLm1lc3NhZ2U9YX0sYnVnOmZ1bmN0aW9uKGEpe3RoaXMudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm5cIkJVRzogXCIrdGhpcy5tZXNzYWdlfTt0aGlzLm1lc3NhZ2U9YX0sbm90UmVhZHk6ZnVuY3Rpb24oYSl7dGhpcy50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiTk9UIFJFQURZOiBcIit0aGlzLm1lc3NhZ2V9O3RoaXMubWVzc2FnZT1hfX19O1xuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzJiYobW9kdWxlLmV4cG9ydHM9c2pjbCk7XCJmdW5jdGlvblwiPT09dHlwZW9mIGRlZmluZSYmZGVmaW5lKFtdLGZ1bmN0aW9uKCl7cmV0dXJuIHNqY2x9KTtcbnNqY2wuY2lwaGVyLmFlcz1mdW5jdGlvbihhKXt0aGlzLmtbMF1bMF1bMF18fHRoaXMuRCgpO3ZhciBiLGMsZCxlLGY9dGhpcy5rWzBdWzRdLGc9dGhpcy5rWzFdO2I9YS5sZW5ndGg7dmFyIGg9MTs0IT09YiYmKDYhPT1iJiY4IT09YikmJnEobmV3IHNqY2wuZXhjZXB0aW9uLmludmFsaWQoXCJpbnZhbGlkIGFlcyBrZXkgc2l6ZVwiKSk7dGhpcy5iPVtkPWEuc2xpY2UoMCksZT1bXV07Zm9yKGE9YjthPDQqYisyODthKyspe2M9ZFthLTFdO2lmKDA9PT1hJWJ8fDg9PT1iJiY0PT09YSViKWM9ZltjPj4+MjRdPDwyNF5mW2M+PjE2JjI1NV08PDE2XmZbYz4+OCYyNTVdPDw4XmZbYyYyNTVdLDA9PT1hJWImJihjPWM8PDheYz4+PjI0Xmg8PDI0LGg9aDw8MV4yODMqKGg+PjcpKTtkW2FdPWRbYS1iXV5jfWZvcihiPTA7YTtiKyssYS0tKWM9ZFtiJjM/YTphLTRdLGVbYl09ND49YXx8ND5iP2M6Z1swXVtmW2M+Pj4yNF1dXmdbMV1bZltjPj4xNiYyNTVdXV5nWzJdW2ZbYz4+OCYyNTVdXV5nWzNdW2ZbYyZcbjI1NV1dfTtcbnNqY2wuY2lwaGVyLmFlcy5wcm90b3R5cGU9e2VuY3J5cHQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHcodGhpcyxhLDApfSxkZWNyeXB0OmZ1bmN0aW9uKGEpe3JldHVybiB3KHRoaXMsYSwxKX0sazpbW1tdLFtdLFtdLFtdLFtdXSxbW10sW10sW10sW10sW11dXSxEOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5rWzBdLGI9dGhpcy5rWzFdLGM9YVs0XSxkPWJbNF0sZSxmLGcsaD1bXSxsPVtdLGssbixtLHA7Zm9yKGU9MDsweDEwMD5lO2UrKylsWyhoW2VdPWU8PDFeMjgzKihlPj43KSleZV09ZTtmb3IoZj1nPTA7IWNbZl07Zl49a3x8MSxnPWxbZ118fDEpe209Z15nPDwxXmc8PDJeZzw8M15nPDw0O209bT4+OF5tJjI1NV45OTtjW2ZdPW07ZFttXT1mO249aFtlPWhbaz1oW2ZdXV07cD0weDEwMTAxMDEqbl4weDEwMDAxKmVeMHgxMDEqa14weDEwMTAxMDAqZjtuPTB4MTAxKmhbbV1eMHgxMDEwMTAwKm07Zm9yKGU9MDs0PmU7ZSsrKWFbZV1bZl09bj1uPDwyNF5uPj4+OCxiW2VdW21dPXA9cDw8MjRecD4+Pjh9Zm9yKGU9XG4wOzU+ZTtlKyspYVtlXT1hW2VdLnNsaWNlKDApLGJbZV09YltlXS5zbGljZSgwKX19O1xuZnVuY3Rpb24gdyhhLGIsYyl7NCE9PWIubGVuZ3RoJiZxKG5ldyBzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwiaW52YWxpZCBhZXMgYmxvY2sgc2l6ZVwiKSk7dmFyIGQ9YS5iW2NdLGU9YlswXV5kWzBdLGY9YltjPzM6MV1eZFsxXSxnPWJbMl1eZFsyXTtiPWJbYz8xOjNdXmRbM107dmFyIGgsbCxrLG49ZC5sZW5ndGgvNC0yLG0scD00LHQ9WzAsMCwwLDBdO2g9YS5rW2NdO2E9aFswXTt2YXIgcj1oWzFdLHY9aFsyXSx5PWhbM10sej1oWzRdO2ZvcihtPTA7bTxuO20rKyloPWFbZT4+PjI0XV5yW2Y+PjE2JjI1NV1edltnPj44JjI1NV1eeVtiJjI1NV1eZFtwXSxsPWFbZj4+PjI0XV5yW2c+PjE2JjI1NV1edltiPj44JjI1NV1eeVtlJjI1NV1eZFtwKzFdLGs9YVtnPj4+MjRdXnJbYj4+MTYmMjU1XV52W2U+PjgmMjU1XV55W2YmMjU1XV5kW3ArMl0sYj1hW2I+Pj4yNF1ecltlPj4xNiYyNTVdXnZbZj4+OCYyNTVdXnlbZyYyNTVdXmRbcCszXSxwKz00LGU9aCxmPWwsZz1rO2ZvcihtPTA7ND5cbm07bSsrKXRbYz8zJi1tOm1dPXpbZT4+PjI0XTw8MjReeltmPj4xNiYyNTVdPDwxNl56W2c+PjgmMjU1XTw8OF56W2ImMjU1XV5kW3ArK10saD1lLGU9ZixmPWcsZz1iLGI9aDtyZXR1cm4gdH1cbnNqY2wuYml0QXJyYXk9e2JpdFNsaWNlOmZ1bmN0aW9uKGEsYixjKXthPXNqY2wuYml0QXJyYXkuUChhLnNsaWNlKGIvMzIpLDMyLShiJjMxKSkuc2xpY2UoMSk7cmV0dXJuIGM9PT1zP2E6c2pjbC5iaXRBcnJheS5jbGFtcChhLGMtYil9LGV4dHJhY3Q6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPU1hdGguZmxvb3IoLWItYyYzMSk7cmV0dXJuKChiK2MtMV5iKSYtMzI/YVtiLzMyfDBdPDwzMi1kXmFbYi8zMisxfDBdPj4+ZDphW2IvMzJ8MF0+Pj5kKSYoMTw8YyktMX0sY29uY2F0OmZ1bmN0aW9uKGEsYil7aWYoMD09PWEubGVuZ3RofHwwPT09Yi5sZW5ndGgpcmV0dXJuIGEuY29uY2F0KGIpO3ZhciBjPWFbYS5sZW5ndGgtMV0sZD1zamNsLmJpdEFycmF5LmdldFBhcnRpYWwoYyk7cmV0dXJuIDMyPT09ZD9hLmNvbmNhdChiKTpzamNsLmJpdEFycmF5LlAoYixkLGN8MCxhLnNsaWNlKDAsYS5sZW5ndGgtMSkpfSxiaXRMZW5ndGg6ZnVuY3Rpb24oYSl7dmFyIGI9YS5sZW5ndGg7cmV0dXJuIDA9PT1cbmI/MDozMiooYi0xKStzamNsLmJpdEFycmF5LmdldFBhcnRpYWwoYVtiLTFdKX0sY2xhbXA6ZnVuY3Rpb24oYSxiKXtpZigzMiphLmxlbmd0aDxiKXJldHVybiBhO2E9YS5zbGljZSgwLE1hdGguY2VpbChiLzMyKSk7dmFyIGM9YS5sZW5ndGg7YiY9MzE7MDxjJiZiJiYoYVtjLTFdPXNqY2wuYml0QXJyYXkucGFydGlhbChiLGFbYy0xXSYyMTQ3NDgzNjQ4Pj5iLTEsMSkpO3JldHVybiBhfSxwYXJ0aWFsOmZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gMzI9PT1hP2I6KGM/YnwwOmI8PDMyLWEpKzB4MTAwMDAwMDAwMDAqYX0sZ2V0UGFydGlhbDpmdW5jdGlvbihhKXtyZXR1cm4gTWF0aC5yb3VuZChhLzB4MTAwMDAwMDAwMDApfHwzMn0sZXF1YWw6ZnVuY3Rpb24oYSxiKXtpZihzamNsLmJpdEFycmF5LmJpdExlbmd0aChhKSE9PXNqY2wuYml0QXJyYXkuYml0TGVuZ3RoKGIpKXJldHVybiB1O3ZhciBjPTAsZDtmb3IoZD0wO2Q8YS5sZW5ndGg7ZCsrKWN8PWFbZF1eYltkXTtyZXR1cm4gMD09PVxuY30sUDpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZTtlPTA7Zm9yKGQ9PT1zJiYoZD1bXSk7MzI8PWI7Yi09MzIpZC5wdXNoKGMpLGM9MDtpZigwPT09YilyZXR1cm4gZC5jb25jYXQoYSk7Zm9yKGU9MDtlPGEubGVuZ3RoO2UrKylkLnB1c2goY3xhW2VdPj4+YiksYz1hW2VdPDwzMi1iO2U9YS5sZW5ndGg/YVthLmxlbmd0aC0xXTowO2E9c2pjbC5iaXRBcnJheS5nZXRQYXJ0aWFsKGUpO2QucHVzaChzamNsLmJpdEFycmF5LnBhcnRpYWwoYithJjMxLDMyPGIrYT9jOmQucG9wKCksMSkpO3JldHVybiBkfSxsOmZ1bmN0aW9uKGEsYil7cmV0dXJuW2FbMF1eYlswXSxhWzFdXmJbMV0sYVsyXV5iWzJdLGFbM11eYlszXV19LGJ5dGVzd2FwTTpmdW5jdGlvbihhKXt2YXIgYixjO2ZvcihiPTA7YjxhLmxlbmd0aDsrK2IpYz1hW2JdLGFbYl09Yz4+PjI0fGM+Pj44JjB4ZmYwMHwoYyYweGZmMDApPDw4fGM8PDI0O3JldHVybiBhfX07XG5zamNsLmNvZGVjLnV0ZjhTdHJpbmc9e2Zyb21CaXRzOmZ1bmN0aW9uKGEpe3ZhciBiPVwiXCIsYz1zamNsLmJpdEFycmF5LmJpdExlbmd0aChhKSxkLGU7Zm9yKGQ9MDtkPGMvODtkKyspMD09PShkJjMpJiYoZT1hW2QvNF0pLGIrPVN0cmluZy5mcm9tQ2hhckNvZGUoZT4+PjI0KSxlPDw9ODtyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVzY2FwZShiKSl9LHRvQml0czpmdW5jdGlvbihhKXthPXVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChhKSk7dmFyIGI9W10sYyxkPTA7Zm9yKGM9MDtjPGEubGVuZ3RoO2MrKylkPWQ8PDh8YS5jaGFyQ29kZUF0KGMpLDM9PT0oYyYzKSYmKGIucHVzaChkKSxkPTApO2MmMyYmYi5wdXNoKHNqY2wuYml0QXJyYXkucGFydGlhbCg4KihjJjMpLGQpKTtyZXR1cm4gYn19O1xuc2pjbC5jb2RlYy5oZXg9e2Zyb21CaXRzOmZ1bmN0aW9uKGEpe3ZhciBiPVwiXCIsYztmb3IoYz0wO2M8YS5sZW5ndGg7YysrKWIrPSgoYVtjXXwwKSsweGYwMDAwMDAwMDAwMCkudG9TdHJpbmcoMTYpLnN1YnN0cig0KTtyZXR1cm4gYi5zdWJzdHIoMCxzamNsLmJpdEFycmF5LmJpdExlbmd0aChhKS80KX0sdG9CaXRzOmZ1bmN0aW9uKGEpe3ZhciBiLGM9W10sZDthPWEucmVwbGFjZSgvXFxzfDB4L2csXCJcIik7ZD1hLmxlbmd0aDthKz1cIjAwMDAwMDAwXCI7Zm9yKGI9MDtiPGEubGVuZ3RoO2IrPTgpYy5wdXNoKHBhcnNlSW50KGEuc3Vic3RyKGIsOCksMTYpXjApO3JldHVybiBzamNsLmJpdEFycmF5LmNsYW1wKGMsNCpkKX19O1xuc2pjbC5jb2RlYy5iYXNlNjQ9e0o6XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIsZnJvbUJpdHM6ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPVwiXCIsZT0wLGY9c2pjbC5jb2RlYy5iYXNlNjQuSixnPTAsaD1zamNsLmJpdEFycmF5LmJpdExlbmd0aChhKTtjJiYoZj1mLnN1YnN0cigwLDYyKStcIi1fXCIpO2ZvcihjPTA7NipkLmxlbmd0aDxoOylkKz1mLmNoYXJBdCgoZ15hW2NdPj4+ZSk+Pj4yNiksNj5lPyhnPWFbY108PDYtZSxlKz0yNixjKyspOihnPDw9NixlLT02KTtmb3IoO2QubGVuZ3RoJjMmJiFiOylkKz1cIj1cIjtyZXR1cm4gZH0sdG9CaXRzOmZ1bmN0aW9uKGEsYil7YT1hLnJlcGxhY2UoL1xcc3w9L2csXCJcIik7dmFyIGM9W10sZCxlPTAsZj1zamNsLmNvZGVjLmJhc2U2NC5KLGc9MCxoO2ImJihmPWYuc3Vic3RyKDAsNjIpK1wiLV9cIik7Zm9yKGQ9MDtkPGEubGVuZ3RoO2QrKyloPWYuaW5kZXhPZihhLmNoYXJBdChkKSksXG4wPmgmJnEobmV3IHNqY2wuZXhjZXB0aW9uLmludmFsaWQoXCJ0aGlzIGlzbid0IGJhc2U2NCFcIikpLDI2PGU/KGUtPTI2LGMucHVzaChnXmg+Pj5lKSxnPWg8PDMyLWUpOihlKz02LGdePWg8PDMyLWUpO2UmNTYmJmMucHVzaChzamNsLmJpdEFycmF5LnBhcnRpYWwoZSY1NixnLDEpKTtyZXR1cm4gY319O3NqY2wuY29kZWMuYmFzZTY0dXJsPXtmcm9tQml0czpmdW5jdGlvbihhKXtyZXR1cm4gc2pjbC5jb2RlYy5iYXNlNjQuZnJvbUJpdHMoYSwxLDEpfSx0b0JpdHM6ZnVuY3Rpb24oYSl7cmV0dXJuIHNqY2wuY29kZWMuYmFzZTY0LnRvQml0cyhhLDEpfX07c2pjbC5oYXNoLnNoYTI1Nj1mdW5jdGlvbihhKXt0aGlzLmJbMF18fHRoaXMuRCgpO2E/KHRoaXMucj1hLnIuc2xpY2UoMCksdGhpcy5vPWEuby5zbGljZSgwKSx0aGlzLmg9YS5oKTp0aGlzLnJlc2V0KCl9O3NqY2wuaGFzaC5zaGEyNTYuaGFzaD1mdW5jdGlvbihhKXtyZXR1cm4obmV3IHNqY2wuaGFzaC5zaGEyNTYpLnVwZGF0ZShhKS5maW5hbGl6ZSgpfTtcbnNqY2wuaGFzaC5zaGEyNTYucHJvdG90eXBlPXtibG9ja1NpemU6NTEyLHJlc2V0OmZ1bmN0aW9uKCl7dGhpcy5yPXRoaXMuTi5zbGljZSgwKTt0aGlzLm89W107dGhpcy5oPTA7cmV0dXJuIHRoaXN9LHVwZGF0ZTpmdW5jdGlvbihhKXtcInN0cmluZ1wiPT09dHlwZW9mIGEmJihhPXNqY2wuY29kZWMudXRmOFN0cmluZy50b0JpdHMoYSkpO3ZhciBiLGM9dGhpcy5vPXNqY2wuYml0QXJyYXkuY29uY2F0KHRoaXMubyxhKTtiPXRoaXMuaDthPXRoaXMuaD1iK3NqY2wuYml0QXJyYXkuYml0TGVuZ3RoKGEpO2ZvcihiPTUxMitiJi01MTI7Yjw9YTtiKz01MTIpeCh0aGlzLGMuc3BsaWNlKDAsMTYpKTtyZXR1cm4gdGhpc30sZmluYWxpemU6ZnVuY3Rpb24oKXt2YXIgYSxiPXRoaXMubyxjPXRoaXMucixiPXNqY2wuYml0QXJyYXkuY29uY2F0KGIsW3NqY2wuYml0QXJyYXkucGFydGlhbCgxLDEpXSk7Zm9yKGE9Yi5sZW5ndGgrMjthJjE1O2ErKyliLnB1c2goMCk7Yi5wdXNoKE1hdGguZmxvb3IodGhpcy5oL1xuNDI5NDk2NzI5NikpO2ZvcihiLnB1c2godGhpcy5ofDApO2IubGVuZ3RoOyl4KHRoaXMsYi5zcGxpY2UoMCwxNikpO3RoaXMucmVzZXQoKTtyZXR1cm4gY30sTjpbXSxiOltdLEQ6ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKGEpe3JldHVybiAweDEwMDAwMDAwMCooYS1NYXRoLmZsb29yKGEpKXwwfXZhciBiPTAsYz0yLGQ7YTpmb3IoOzY0PmI7YysrKXtmb3IoZD0yO2QqZDw9YztkKyspaWYoMD09PWMlZCljb250aW51ZSBhOzg+YiYmKHRoaXMuTltiXT1hKE1hdGgucG93KGMsMC41KSkpO3RoaXMuYltiXT1hKE1hdGgucG93KGMsMS8zKSk7YisrfX19O1xuZnVuY3Rpb24geChhLGIpe3ZhciBjLGQsZSxmPWIuc2xpY2UoMCksZz1hLnIsaD1hLmIsbD1nWzBdLGs9Z1sxXSxuPWdbMl0sbT1nWzNdLHA9Z1s0XSx0PWdbNV0scj1nWzZdLHY9Z1s3XTtmb3IoYz0wOzY0PmM7YysrKTE2PmM/ZD1mW2NdOihkPWZbYysxJjE1XSxlPWZbYysxNCYxNV0sZD1mW2MmMTVdPShkPj4+N15kPj4+MTheZD4+PjNeZDw8MjVeZDw8MTQpKyhlPj4+MTdeZT4+PjE5XmU+Pj4xMF5lPDwxNV5lPDwxMykrZltjJjE1XStmW2MrOSYxNV18MCksZD1kK3YrKHA+Pj42XnA+Pj4xMV5wPj4+MjVecDw8MjZecDw8MjFecDw8NykrKHJecCYodF5yKSkraFtjXSx2PXIscj10LHQ9cCxwPW0rZHwwLG09bixuPWssaz1sLGw9ZCsoayZuXm0mKGtebikpKyhrPj4+Ml5rPj4+MTNeaz4+PjIyXms8PDMwXms8PDE5Xms8PDEwKXwwO2dbMF09Z1swXStsfDA7Z1sxXT1nWzFdK2t8MDtnWzJdPWdbMl0rbnwwO2dbM109Z1szXSttfDA7Z1s0XT1nWzRdK3B8MDtnWzVdPWdbNV0rdHwwO2dbNl09XG5nWzZdK3J8MDtnWzddPWdbN10rdnwwfVxuc2pjbC5tb2RlLmNjbT17bmFtZTpcImNjbVwiLGVuY3J5cHQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZixnPWIuc2xpY2UoMCksaD1zamNsLmJpdEFycmF5LGw9aC5iaXRMZW5ndGgoYykvOCxrPWguYml0TGVuZ3RoKGcpLzg7ZT1lfHw2NDtkPWR8fFtdOzc+bCYmcShuZXcgc2pjbC5leGNlcHRpb24uaW52YWxpZChcImNjbTogaXYgbXVzdCBiZSBhdCBsZWFzdCA3IGJ5dGVzXCIpKTtmb3IoZj0yOzQ+ZiYmaz4+PjgqZjtmKyspO2Y8MTUtbCYmKGY9MTUtbCk7Yz1oLmNsYW1wKGMsOCooMTUtZikpO2I9c2pjbC5tb2RlLmNjbS5MKGEsYixjLGQsZSxmKTtnPXNqY2wubW9kZS5jY20ucChhLGcsYyxiLGUsZik7cmV0dXJuIGguY29uY2F0KGcuZGF0YSxnLnRhZyl9LGRlY3J5cHQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXtlPWV8fDY0O2Q9ZHx8W107dmFyIGY9c2pjbC5iaXRBcnJheSxnPWYuYml0TGVuZ3RoKGMpLzgsaD1mLmJpdExlbmd0aChiKSxsPWYuY2xhbXAoYixoLWUpLGs9Zi5iaXRTbGljZShiLFxuaC1lKSxoPShoLWUpLzg7Nz5nJiZxKG5ldyBzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwiY2NtOiBpdiBtdXN0IGJlIGF0IGxlYXN0IDcgYnl0ZXNcIikpO2ZvcihiPTI7ND5iJiZoPj4+OCpiO2IrKyk7YjwxNS1nJiYoYj0xNS1nKTtjPWYuY2xhbXAoYyw4KigxNS1iKSk7bD1zamNsLm1vZGUuY2NtLnAoYSxsLGMsayxlLGIpO2E9c2pjbC5tb2RlLmNjbS5MKGEsbC5kYXRhLGMsZCxlLGIpO2YuZXF1YWwobC50YWcsYSl8fHEobmV3IHNqY2wuZXhjZXB0aW9uLmNvcnJ1cHQoXCJjY206IHRhZyBkb2Vzbid0IG1hdGNoXCIpKTtyZXR1cm4gbC5kYXRhfSxMOmZ1bmN0aW9uKGEsYixjLGQsZSxmKXt2YXIgZz1bXSxoPXNqY2wuYml0QXJyYXksbD1oLmw7ZS89ODsoZSUyfHw0PmV8fDE2PGUpJiZxKG5ldyBzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwiY2NtOiBpbnZhbGlkIHRhZyBsZW5ndGhcIikpOygweGZmZmZmZmZmPGQubGVuZ3RofHwweGZmZmZmZmZmPGIubGVuZ3RoKSYmcShuZXcgc2pjbC5leGNlcHRpb24uYnVnKFwiY2NtOiBjYW4ndCBkZWFsIHdpdGggNEdpQiBvciBtb3JlIGRhdGFcIikpO1xuZj1baC5wYXJ0aWFsKDgsKGQubGVuZ3RoPzY0OjApfGUtMjw8MnxmLTEpXTtmPWguY29uY2F0KGYsYyk7ZlszXXw9aC5iaXRMZW5ndGgoYikvODtmPWEuZW5jcnlwdChmKTtpZihkLmxlbmd0aCl7Yz1oLmJpdExlbmd0aChkKS84OzY1Mjc5Pj1jP2c9W2gucGFydGlhbCgxNixjKV06MHhmZmZmZmZmZj49YyYmKGc9aC5jb25jYXQoW2gucGFydGlhbCgxNiw2NTUzNCldLFtjXSkpO2c9aC5jb25jYXQoZyxkKTtmb3IoZD0wO2Q8Zy5sZW5ndGg7ZCs9NClmPWEuZW5jcnlwdChsKGYsZy5zbGljZShkLGQrNCkuY29uY2F0KFswLDAsMF0pKSl9Zm9yKGQ9MDtkPGIubGVuZ3RoO2QrPTQpZj1hLmVuY3J5cHQobChmLGIuc2xpY2UoZCxkKzQpLmNvbmNhdChbMCwwLDBdKSkpO3JldHVybiBoLmNsYW1wKGYsOCplKX0scDpmdW5jdGlvbihhLGIsYyxkLGUsZil7dmFyIGcsaD1zamNsLmJpdEFycmF5O2c9aC5sO3ZhciBsPWIubGVuZ3RoLGs9aC5iaXRMZW5ndGgoYik7Yz1oLmNvbmNhdChbaC5wYXJ0aWFsKDgsXG5mLTEpXSxjKS5jb25jYXQoWzAsMCwwXSkuc2xpY2UoMCw0KTtkPWguYml0U2xpY2UoZyhkLGEuZW5jcnlwdChjKSksMCxlKTtpZighbClyZXR1cm57dGFnOmQsZGF0YTpbXX07Zm9yKGc9MDtnPGw7Zys9NCljWzNdKyssZT1hLmVuY3J5cHQoYyksYltnXV49ZVswXSxiW2crMV1ePWVbMV0sYltnKzJdXj1lWzJdLGJbZyszXV49ZVszXTtyZXR1cm57dGFnOmQsZGF0YTpoLmNsYW1wKGIsayl9fX07XG5zamNsLm1vZGUub2NiMj17bmFtZTpcIm9jYjJcIixlbmNyeXB0OmZ1bmN0aW9uKGEsYixjLGQsZSxmKXsxMjghPT1zamNsLmJpdEFycmF5LmJpdExlbmd0aChjKSYmcShuZXcgc2pjbC5leGNlcHRpb24uaW52YWxpZChcIm9jYiBpdiBtdXN0IGJlIDEyOCBiaXRzXCIpKTt2YXIgZyxoPXNqY2wubW9kZS5vY2IyLkgsbD1zamNsLmJpdEFycmF5LGs9bC5sLG49WzAsMCwwLDBdO2M9aChhLmVuY3J5cHQoYykpO3ZhciBtLHA9W107ZD1kfHxbXTtlPWV8fDY0O2ZvcihnPTA7Zys0PGIubGVuZ3RoO2crPTQpbT1iLnNsaWNlKGcsZys0KSxuPWsobixtKSxwPXAuY29uY2F0KGsoYyxhLmVuY3J5cHQoayhjLG0pKSkpLGM9aChjKTttPWIuc2xpY2UoZyk7Yj1sLmJpdExlbmd0aChtKTtnPWEuZW5jcnlwdChrKGMsWzAsMCwwLGJdKSk7bT1sLmNsYW1wKGsobS5jb25jYXQoWzAsMCwwXSksZyksYik7bj1rKG4sayhtLmNvbmNhdChbMCwwLDBdKSxnKSk7bj1hLmVuY3J5cHQoayhuLGsoYyxoKGMpKSkpO2QubGVuZ3RoJiZcbihuPWsobixmP2Q6c2pjbC5tb2RlLm9jYjIucG1hYyhhLGQpKSk7cmV0dXJuIHAuY29uY2F0KGwuY29uY2F0KG0sbC5jbGFtcChuLGUpKSl9LGRlY3J5cHQ6ZnVuY3Rpb24oYSxiLGMsZCxlLGYpezEyOCE9PXNqY2wuYml0QXJyYXkuYml0TGVuZ3RoKGMpJiZxKG5ldyBzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwib2NiIGl2IG11c3QgYmUgMTI4IGJpdHNcIikpO2U9ZXx8NjQ7dmFyIGc9c2pjbC5tb2RlLm9jYjIuSCxoPXNqY2wuYml0QXJyYXksbD1oLmwsaz1bMCwwLDAsMF0sbj1nKGEuZW5jcnlwdChjKSksbSxwLHQ9c2pjbC5iaXRBcnJheS5iaXRMZW5ndGgoYiktZSxyPVtdO2Q9ZHx8W107Zm9yKGM9MDtjKzQ8dC8zMjtjKz00KW09bChuLGEuZGVjcnlwdChsKG4sYi5zbGljZShjLGMrNCkpKSksaz1sKGssbSkscj1yLmNvbmNhdChtKSxuPWcobik7cD10LTMyKmM7bT1hLmVuY3J5cHQobChuLFswLDAsMCxwXSkpO209bChtLGguY2xhbXAoYi5zbGljZShjKSxwKS5jb25jYXQoWzAsMCwwXSkpO1xuaz1sKGssbSk7az1hLmVuY3J5cHQobChrLGwobixnKG4pKSkpO2QubGVuZ3RoJiYoaz1sKGssZj9kOnNqY2wubW9kZS5vY2IyLnBtYWMoYSxkKSkpO2guZXF1YWwoaC5jbGFtcChrLGUpLGguYml0U2xpY2UoYix0KSl8fHEobmV3IHNqY2wuZXhjZXB0aW9uLmNvcnJ1cHQoXCJvY2I6IHRhZyBkb2Vzbid0IG1hdGNoXCIpKTtyZXR1cm4gci5jb25jYXQoaC5jbGFtcChtLHApKX0scG1hYzpmdW5jdGlvbihhLGIpe3ZhciBjLGQ9c2pjbC5tb2RlLm9jYjIuSCxlPXNqY2wuYml0QXJyYXksZj1lLmwsZz1bMCwwLDAsMF0saD1hLmVuY3J5cHQoWzAsMCwwLDBdKSxoPWYoaCxkKGQoaCkpKTtmb3IoYz0wO2MrNDxiLmxlbmd0aDtjKz00KWg9ZChoKSxnPWYoZyxhLmVuY3J5cHQoZihoLGIuc2xpY2UoYyxjKzQpKSkpO2M9Yi5zbGljZShjKTsxMjg+ZS5iaXRMZW5ndGgoYykmJihoPWYoaCxkKGgpKSxjPWUuY29uY2F0KGMsWy0yMTQ3NDgzNjQ4LDAsMCwwXSkpO2c9ZihnLGMpO3JldHVybiBhLmVuY3J5cHQoZihkKGYoaCxcbmQoaCkpKSxnKSl9LEg6ZnVuY3Rpb24oYSl7cmV0dXJuW2FbMF08PDFeYVsxXT4+PjMxLGFbMV08PDFeYVsyXT4+PjMxLGFbMl08PDFeYVszXT4+PjMxLGFbM108PDFeMTM1KihhWzBdPj4+MzEpXX19O1xuc2pjbC5tb2RlLmdjbT17bmFtZTpcImdjbVwiLGVuY3J5cHQ6ZnVuY3Rpb24oYSxiLGMsZCxlKXt2YXIgZj1iLnNsaWNlKDApO2I9c2pjbC5iaXRBcnJheTtkPWR8fFtdO2E9c2pjbC5tb2RlLmdjbS5wKCEwLGEsZixkLGMsZXx8MTI4KTtyZXR1cm4gYi5jb25jYXQoYS5kYXRhLGEudGFnKX0sZGVjcnlwdDpmdW5jdGlvbihhLGIsYyxkLGUpe3ZhciBmPWIuc2xpY2UoMCksZz1zamNsLmJpdEFycmF5LGg9Zy5iaXRMZW5ndGgoZik7ZT1lfHwxMjg7ZD1kfHxbXTtlPD1oPyhiPWcuYml0U2xpY2UoZixoLWUpLGY9Zy5iaXRTbGljZShmLDAsaC1lKSk6KGI9ZixmPVtdKTthPXNqY2wubW9kZS5nY20ucCh1LGEsZixkLGMsZSk7Zy5lcXVhbChhLnRhZyxiKXx8cShuZXcgc2pjbC5leGNlcHRpb24uY29ycnVwdChcImdjbTogdGFnIGRvZXNuJ3QgbWF0Y2hcIikpO3JldHVybiBhLmRhdGF9LFo6ZnVuY3Rpb24oYSxiKXt2YXIgYyxkLGUsZixnLGg9c2pjbC5iaXRBcnJheS5sO2U9WzAsMCwwLDBdO2Y9Yi5zbGljZSgwKTtcbmZvcihjPTA7MTI4PmM7YysrKXsoZD0wIT09KGFbTWF0aC5mbG9vcihjLzMyKV0mMTw8MzEtYyUzMikpJiYoZT1oKGUsZikpO2c9MCE9PShmWzNdJjEpO2ZvcihkPTM7MDxkO2QtLSlmW2RdPWZbZF0+Pj4xfChmW2QtMV0mMSk8PDMxO2ZbMF0+Pj49MTtnJiYoZlswXV49LTB4MWYwMDAwMDApfXJldHVybiBlfSxnOmZ1bmN0aW9uKGEsYixjKXt2YXIgZCxlPWMubGVuZ3RoO2I9Yi5zbGljZSgwKTtmb3IoZD0wO2Q8ZTtkKz00KWJbMF1ePTB4ZmZmZmZmZmYmY1tkXSxiWzFdXj0weGZmZmZmZmZmJmNbZCsxXSxiWzJdXj0weGZmZmZmZmZmJmNbZCsyXSxiWzNdXj0weGZmZmZmZmZmJmNbZCszXSxiPXNqY2wubW9kZS5nY20uWihiLGEpO3JldHVybiBifSxwOmZ1bmN0aW9uKGEsYixjLGQsZSxmKXt2YXIgZyxoLGwsayxuLG0scCx0LHI9c2pjbC5iaXRBcnJheTttPWMubGVuZ3RoO3A9ci5iaXRMZW5ndGgoYyk7dD1yLmJpdExlbmd0aChkKTtoPXIuYml0TGVuZ3RoKGUpO2c9Yi5lbmNyeXB0KFswLFxuMCwwLDBdKTs5Nj09PWg/KGU9ZS5zbGljZSgwKSxlPXIuY29uY2F0KGUsWzFdKSk6KGU9c2pjbC5tb2RlLmdjbS5nKGcsWzAsMCwwLDBdLGUpLGU9c2pjbC5tb2RlLmdjbS5nKGcsZSxbMCwwLE1hdGguZmxvb3IoaC8weDEwMDAwMDAwMCksaCYweGZmZmZmZmZmXSkpO2g9c2pjbC5tb2RlLmdjbS5nKGcsWzAsMCwwLDBdLGQpO249ZS5zbGljZSgwKTtkPWguc2xpY2UoMCk7YXx8KGQ9c2pjbC5tb2RlLmdjbS5nKGcsaCxjKSk7Zm9yKGs9MDtrPG07ays9NCluWzNdKyssbD1iLmVuY3J5cHQobiksY1trXV49bFswXSxjW2srMV1ePWxbMV0sY1trKzJdXj1sWzJdLGNbayszXV49bFszXTtjPXIuY2xhbXAoYyxwKTthJiYoZD1zamNsLm1vZGUuZ2NtLmcoZyxoLGMpKTthPVtNYXRoLmZsb29yKHQvMHgxMDAwMDAwMDApLHQmMHhmZmZmZmZmZixNYXRoLmZsb29yKHAvMHgxMDAwMDAwMDApLHAmMHhmZmZmZmZmZl07ZD1zamNsLm1vZGUuZ2NtLmcoZyxkLGEpO2w9Yi5lbmNyeXB0KGUpO2RbMF1ePWxbMF07XG5kWzFdXj1sWzFdO2RbMl1ePWxbMl07ZFszXV49bFszXTtyZXR1cm57dGFnOnIuYml0U2xpY2UoZCwwLGYpLGRhdGE6Y319fTtzamNsLm1pc2MuaG1hYz1mdW5jdGlvbihhLGIpe3RoaXMuTT1iPWJ8fHNqY2wuaGFzaC5zaGEyNTY7dmFyIGM9W1tdLFtdXSxkLGU9Yi5wcm90b3R5cGUuYmxvY2tTaXplLzMyO3RoaXMubj1bbmV3IGIsbmV3IGJdO2EubGVuZ3RoPmUmJihhPWIuaGFzaChhKSk7Zm9yKGQ9MDtkPGU7ZCsrKWNbMF1bZF09YVtkXV45MDk1MjI0ODYsY1sxXVtkXT1hW2RdXjE1NDk1NTY4Mjg7dGhpcy5uWzBdLnVwZGF0ZShjWzBdKTt0aGlzLm5bMV0udXBkYXRlKGNbMV0pO3RoaXMuRz1uZXcgYih0aGlzLm5bMF0pfTtcbnNqY2wubWlzYy5obWFjLnByb3RvdHlwZS5lbmNyeXB0PXNqY2wubWlzYy5obWFjLnByb3RvdHlwZS5tYWM9ZnVuY3Rpb24oYSl7dGhpcy5RJiZxKG5ldyBzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwiZW5jcnlwdCBvbiBhbHJlYWR5IHVwZGF0ZWQgaG1hYyBjYWxsZWQhXCIpKTt0aGlzLnVwZGF0ZShhKTtyZXR1cm4gdGhpcy5kaWdlc3QoYSl9O3NqY2wubWlzYy5obWFjLnByb3RvdHlwZS5yZXNldD1mdW5jdGlvbigpe3RoaXMuRz1uZXcgdGhpcy5NKHRoaXMublswXSk7dGhpcy5RPXV9O3NqY2wubWlzYy5obWFjLnByb3RvdHlwZS51cGRhdGU9ZnVuY3Rpb24oYSl7dGhpcy5RPSEwO3RoaXMuRy51cGRhdGUoYSl9O3NqY2wubWlzYy5obWFjLnByb3RvdHlwZS5kaWdlc3Q9ZnVuY3Rpb24oKXt2YXIgYT10aGlzLkcuZmluYWxpemUoKSxhPShuZXcgdGhpcy5NKHRoaXMublsxXSkpLnVwZGF0ZShhKS5maW5hbGl6ZSgpO3RoaXMucmVzZXQoKTtyZXR1cm4gYX07XG5zamNsLm1pc2MucGJrZGYyPWZ1bmN0aW9uKGEsYixjLGQsZSl7Yz1jfHwxRTM7KDA+ZHx8MD5jKSYmcShzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwiaW52YWxpZCBwYXJhbXMgdG8gcGJrZGYyXCIpKTtcInN0cmluZ1wiPT09dHlwZW9mIGEmJihhPXNqY2wuY29kZWMudXRmOFN0cmluZy50b0JpdHMoYSkpO1wic3RyaW5nXCI9PT10eXBlb2YgYiYmKGI9c2pjbC5jb2RlYy51dGY4U3RyaW5nLnRvQml0cyhiKSk7ZT1lfHxzamNsLm1pc2MuaG1hYzthPW5ldyBlKGEpO3ZhciBmLGcsaCxsLGs9W10sbj1zamNsLmJpdEFycmF5O2ZvcihsPTE7MzIqay5sZW5ndGg8KGR8fDEpO2wrKyl7ZT1mPWEuZW5jcnlwdChuLmNvbmNhdChiLFtsXSkpO2ZvcihnPTE7ZzxjO2crKyl7Zj1hLmVuY3J5cHQoZik7Zm9yKGg9MDtoPGYubGVuZ3RoO2grKyllW2hdXj1mW2hdfWs9ay5jb25jYXQoZSl9ZCYmKGs9bi5jbGFtcChrLGQpKTtyZXR1cm4ga307XG5zamNsLnBybmc9ZnVuY3Rpb24oYSl7dGhpcy5jPVtuZXcgc2pjbC5oYXNoLnNoYTI1Nl07dGhpcy5pPVswXTt0aGlzLkY9MDt0aGlzLnM9e307dGhpcy5DPTA7dGhpcy5LPXt9O3RoaXMuTz10aGlzLmQ9dGhpcy5qPXRoaXMuVz0wO3RoaXMuYj1bMCwwLDAsMCwwLDAsMCwwXTt0aGlzLmY9WzAsMCwwLDBdO3RoaXMuQT1zO3RoaXMuQj1hO3RoaXMucT11O3RoaXMudz17cHJvZ3Jlc3M6e30sc2VlZGVkOnt9fTt0aGlzLm09dGhpcy5WPTA7dGhpcy50PTE7dGhpcy51PTI7dGhpcy5TPTB4MTAwMDA7dGhpcy5JPVswLDQ4LDY0LDk2LDEyOCwxOTIsMHgxMDAsMzg0LDUxMiw3NjgsMTAyNF07dGhpcy5UPTNFNDt0aGlzLlI9ODB9O1xuc2pjbC5wcm5nLnByb3RvdHlwZT17cmFuZG9tV29yZHM6ZnVuY3Rpb24oYSxiKXt2YXIgYz1bXSxkO2Q9dGhpcy5pc1JlYWR5KGIpO3ZhciBlO2Q9PT10aGlzLm0mJnEobmV3IHNqY2wuZXhjZXB0aW9uLm5vdFJlYWR5KFwiZ2VuZXJhdG9yIGlzbid0IHNlZWRlZFwiKSk7aWYoZCZ0aGlzLnUpe2Q9IShkJnRoaXMudCk7ZT1bXTt2YXIgZj0wLGc7dGhpcy5PPWVbMF09KG5ldyBEYXRlKS52YWx1ZU9mKCkrdGhpcy5UO2ZvcihnPTA7MTY+ZztnKyspZS5wdXNoKDB4MTAwMDAwMDAwKk1hdGgucmFuZG9tKCl8MCk7Zm9yKGc9MDtnPHRoaXMuYy5sZW5ndGgmJiEoZT1lLmNvbmNhdCh0aGlzLmNbZ10uZmluYWxpemUoKSksZis9dGhpcy5pW2ddLHRoaXMuaVtnXT0wLCFkJiZ0aGlzLkYmMTw8Zyk7ZysrKTt0aGlzLkY+PTE8PHRoaXMuYy5sZW5ndGgmJih0aGlzLmMucHVzaChuZXcgc2pjbC5oYXNoLnNoYTI1NiksdGhpcy5pLnB1c2goMCkpO3RoaXMuZC09ZjtmPnRoaXMuaiYmKHRoaXMuaj1mKTt0aGlzLkYrKztcbnRoaXMuYj1zamNsLmhhc2guc2hhMjU2Lmhhc2godGhpcy5iLmNvbmNhdChlKSk7dGhpcy5BPW5ldyBzamNsLmNpcGhlci5hZXModGhpcy5iKTtmb3IoZD0wOzQ+ZCYmISh0aGlzLmZbZF09dGhpcy5mW2RdKzF8MCx0aGlzLmZbZF0pO2QrKyk7fWZvcihkPTA7ZDxhO2QrPTQpMD09PShkKzEpJXRoaXMuUyYmQSh0aGlzKSxlPUIodGhpcyksYy5wdXNoKGVbMF0sZVsxXSxlWzJdLGVbM10pO0EodGhpcyk7cmV0dXJuIGMuc2xpY2UoMCxhKX0sc2V0RGVmYXVsdFBhcmFub2lhOmZ1bmN0aW9uKGEsYil7MD09PWEmJlwiU2V0dGluZyBwYXJhbm9pYT0wIHdpbGwgcnVpbiB5b3VyIHNlY3VyaXR5OyB1c2UgaXQgb25seSBmb3IgdGVzdGluZ1wiIT09YiYmcShcIlNldHRpbmcgcGFyYW5vaWE9MCB3aWxsIHJ1aW4geW91ciBzZWN1cml0eTsgdXNlIGl0IG9ubHkgZm9yIHRlc3RpbmdcIik7dGhpcy5CPWF9LGFkZEVudHJvcHk6ZnVuY3Rpb24oYSxiLGMpe2M9Y3x8XCJ1c2VyXCI7dmFyIGQsZSxmPShuZXcgRGF0ZSkudmFsdWVPZigpLFxuZz10aGlzLnNbY10saD10aGlzLmlzUmVhZHkoKSxsPTA7ZD10aGlzLktbY107ZD09PXMmJihkPXRoaXMuS1tjXT10aGlzLlcrKyk7Zz09PXMmJihnPXRoaXMuc1tjXT0wKTt0aGlzLnNbY109KHRoaXMuc1tjXSsxKSV0aGlzLmMubGVuZ3RoO3N3aXRjaCh0eXBlb2YgYSl7Y2FzZSBcIm51bWJlclwiOmI9PT1zJiYoYj0xKTt0aGlzLmNbZ10udXBkYXRlKFtkLHRoaXMuQysrLDEsYixmLDEsYXwwXSk7YnJlYWs7Y2FzZSBcIm9iamVjdFwiOmM9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpO2lmKFwiW29iamVjdCBVaW50MzJBcnJheV1cIj09PWMpe2U9W107Zm9yKGM9MDtjPGEubGVuZ3RoO2MrKyllLnB1c2goYVtjXSk7YT1lfWVsc2V7XCJbb2JqZWN0IEFycmF5XVwiIT09YyYmKGw9MSk7Zm9yKGM9MDtjPGEubGVuZ3RoJiYhbDtjKyspXCJudW1iZXJcIiE9PXR5cGVvZiBhW2NdJiYobD0xKX1pZighbCl7aWYoYj09PXMpZm9yKGM9Yj0wO2M8YS5sZW5ndGg7YysrKWZvcihlPWFbY107MDxlOyliKyssXG5lPj4+PTE7dGhpcy5jW2ddLnVwZGF0ZShbZCx0aGlzLkMrKywyLGIsZixhLmxlbmd0aF0uY29uY2F0KGEpKX1icmVhaztjYXNlIFwic3RyaW5nXCI6Yj09PXMmJihiPWEubGVuZ3RoKTt0aGlzLmNbZ10udXBkYXRlKFtkLHRoaXMuQysrLDMsYixmLGEubGVuZ3RoXSk7dGhpcy5jW2ddLnVwZGF0ZShhKTticmVhaztkZWZhdWx0Omw9MX1sJiZxKG5ldyBzamNsLmV4Y2VwdGlvbi5idWcoXCJyYW5kb206IGFkZEVudHJvcHkgb25seSBzdXBwb3J0cyBudW1iZXIsIGFycmF5IG9mIG51bWJlcnMgb3Igc3RyaW5nXCIpKTt0aGlzLmlbZ10rPWI7dGhpcy5kKz1iO2g9PT10aGlzLm0mJih0aGlzLmlzUmVhZHkoKSE9PXRoaXMubSYmQyhcInNlZWRlZFwiLE1hdGgubWF4KHRoaXMuaix0aGlzLmQpKSxDKFwicHJvZ3Jlc3NcIix0aGlzLmdldFByb2dyZXNzKCkpKX0saXNSZWFkeTpmdW5jdGlvbihhKXthPXRoaXMuSVthIT09cz9hOnRoaXMuQl07cmV0dXJuIHRoaXMuaiYmdGhpcy5qPj1hP3RoaXMuaVswXT50aGlzLlImJlxuKG5ldyBEYXRlKS52YWx1ZU9mKCk+dGhpcy5PP3RoaXMudXx0aGlzLnQ6dGhpcy50OnRoaXMuZD49YT90aGlzLnV8dGhpcy5tOnRoaXMubX0sZ2V0UHJvZ3Jlc3M6ZnVuY3Rpb24oYSl7YT10aGlzLklbYT9hOnRoaXMuQl07cmV0dXJuIHRoaXMuaj49YT8xOnRoaXMuZD5hPzE6dGhpcy5kL2F9LHN0YXJ0Q29sbGVjdG9yczpmdW5jdGlvbigpe3RoaXMucXx8KHRoaXMuYT17bG9hZFRpbWVDb2xsZWN0b3I6RCh0aGlzLHRoaXMuYWEpLG1vdXNlQ29sbGVjdG9yOkQodGhpcyx0aGlzLmJhKSxrZXlib2FyZENvbGxlY3RvcjpEKHRoaXMsdGhpcy4kKSxhY2NlbGVyb21ldGVyQ29sbGVjdG9yOkQodGhpcyx0aGlzLlUpLHRvdWNoQ29sbGVjdG9yOkQodGhpcyx0aGlzLmRhKX0sd2luZG93LmFkZEV2ZW50TGlzdGVuZXI/KHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLHRoaXMuYS5sb2FkVGltZUNvbGxlY3Rvcix1KSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHRoaXMuYS5tb3VzZUNvbGxlY3RvcixcbnUpLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIix0aGlzLmEua2V5Ym9hcmRDb2xsZWN0b3IsdSksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2Vtb3Rpb25cIix0aGlzLmEuYWNjZWxlcm9tZXRlckNvbGxlY3Rvcix1KSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLHRoaXMuYS50b3VjaENvbGxlY3Rvcix1KSk6ZG9jdW1lbnQuYXR0YWNoRXZlbnQ/KGRvY3VtZW50LmF0dGFjaEV2ZW50KFwib25sb2FkXCIsdGhpcy5hLmxvYWRUaW1lQ29sbGVjdG9yKSxkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ubW91c2Vtb3ZlXCIsdGhpcy5hLm1vdXNlQ29sbGVjdG9yKSxkb2N1bWVudC5hdHRhY2hFdmVudChcImtleXByZXNzXCIsdGhpcy5hLmtleWJvYXJkQ29sbGVjdG9yKSk6cShuZXcgc2pjbC5leGNlcHRpb24uYnVnKFwiY2FuJ3QgYXR0YWNoIGV2ZW50XCIpKSx0aGlzLnE9ITApfSxzdG9wQ29sbGVjdG9yczpmdW5jdGlvbigpe3RoaXMucSYmKHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyP1xuKHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibG9hZFwiLHRoaXMuYS5sb2FkVGltZUNvbGxlY3Rvcix1KSx3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHRoaXMuYS5tb3VzZUNvbGxlY3Rvcix1KSx3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsdGhpcy5hLmtleWJvYXJkQ29sbGVjdG9yLHUpLHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiZGV2aWNlbW90aW9uXCIsdGhpcy5hLmFjY2VsZXJvbWV0ZXJDb2xsZWN0b3IsdSksd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIix0aGlzLmEudG91Y2hDb2xsZWN0b3IsdSkpOmRvY3VtZW50LmRldGFjaEV2ZW50JiYoZG9jdW1lbnQuZGV0YWNoRXZlbnQoXCJvbmxvYWRcIix0aGlzLmEubG9hZFRpbWVDb2xsZWN0b3IpLGRvY3VtZW50LmRldGFjaEV2ZW50KFwib25tb3VzZW1vdmVcIix0aGlzLmEubW91c2VDb2xsZWN0b3IpLGRvY3VtZW50LmRldGFjaEV2ZW50KFwia2V5cHJlc3NcIixcbnRoaXMuYS5rZXlib2FyZENvbGxlY3RvcikpLHRoaXMucT11KX0sYWRkRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbihhLGIpe3RoaXMud1thXVt0aGlzLlYrK109Yn0scmVtb3ZlRXZlbnRMaXN0ZW5lcjpmdW5jdGlvbihhLGIpe3ZhciBjLGQsZT10aGlzLndbYV0sZj1bXTtmb3IoZCBpbiBlKWUuaGFzT3duUHJvcGVydHkoZCkmJmVbZF09PT1iJiZmLnB1c2goZCk7Zm9yKGM9MDtjPGYubGVuZ3RoO2MrKylkPWZbY10sZGVsZXRlIGVbZF19LCQ6ZnVuY3Rpb24oKXtFKDEpfSxiYTpmdW5jdGlvbihhKXt2YXIgYixjO3RyeXtiPWEueHx8YS5jbGllbnRYfHxhLm9mZnNldFh8fDAsYz1hLnl8fGEuY2xpZW50WXx8YS5vZmZzZXRZfHwwfWNhdGNoKGQpe2M9Yj0wfTAhPWImJjAhPWMmJnNqY2wucmFuZG9tLmFkZEVudHJvcHkoW2IsY10sMixcIm1vdXNlXCIpO0UoMCl9LGRhOmZ1bmN0aW9uKGEpe2E9YS50b3VjaGVzWzBdfHxhLmNoYW5nZWRUb3VjaGVzWzBdO3NqY2wucmFuZG9tLmFkZEVudHJvcHkoW2EucGFnZVh8fFxuYS5jbGllbnRYLGEucGFnZVl8fGEuY2xpZW50WV0sMSxcInRvdWNoXCIpO0UoMCl9LGFhOmZ1bmN0aW9uKCl7RSgyKX0sVTpmdW5jdGlvbihhKXthPWEuYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54fHxhLmFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueXx8YS5hY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lno7aWYod2luZG93Lm9yaWVudGF0aW9uKXt2YXIgYj13aW5kb3cub3JpZW50YXRpb247XCJudW1iZXJcIj09PXR5cGVvZiBiJiZzamNsLnJhbmRvbS5hZGRFbnRyb3B5KGIsMSxcImFjY2VsZXJvbWV0ZXJcIil9YSYmc2pjbC5yYW5kb20uYWRkRW50cm9weShhLDIsXCJhY2NlbGVyb21ldGVyXCIpO0UoMCl9fTtmdW5jdGlvbiBDKGEsYil7dmFyIGMsZD1zamNsLnJhbmRvbS53W2FdLGU9W107Zm9yKGMgaW4gZClkLmhhc093blByb3BlcnR5KGMpJiZlLnB1c2goZFtjXSk7Zm9yKGM9MDtjPGUubGVuZ3RoO2MrKyllW2NdKGIpfVxuZnVuY3Rpb24gRShhKXtcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmd2luZG93LnBlcmZvcm1hbmNlJiZcImZ1bmN0aW9uXCI9PT10eXBlb2Ygd2luZG93LnBlcmZvcm1hbmNlLm5vdz9zamNsLnJhbmRvbS5hZGRFbnRyb3B5KHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSxhLFwibG9hZHRpbWVcIik6c2pjbC5yYW5kb20uYWRkRW50cm9weSgobmV3IERhdGUpLnZhbHVlT2YoKSxhLFwibG9hZHRpbWVcIil9ZnVuY3Rpb24gQShhKXthLmI9QihhKS5jb25jYXQoQihhKSk7YS5BPW5ldyBzamNsLmNpcGhlci5hZXMoYS5iKX1mdW5jdGlvbiBCKGEpe2Zvcih2YXIgYj0wOzQ+YiYmIShhLmZbYl09YS5mW2JdKzF8MCxhLmZbYl0pO2IrKyk7cmV0dXJuIGEuQS5lbmNyeXB0KGEuZil9ZnVuY3Rpb24gRChhLGIpe3JldHVybiBmdW5jdGlvbigpe2IuYXBwbHkoYSxhcmd1bWVudHMpfX1zamNsLnJhbmRvbT1uZXcgc2pjbC5wcm5nKDYpO1xuYTp0cnl7dmFyIEYsRyxILEk7aWYoST1cInVuZGVmaW5lZFwiIT09dHlwZW9mIG1vZHVsZSl7dmFyIEo7aWYoSj1tb2R1bGUuZXhwb3J0cyl7dmFyIEs7dHJ5e0s9cmVxdWlyZShcImNyeXB0b1wiKX1jYXRjaChMKXtLPW51bGx9Sj0oRz1LKSYmRy5yYW5kb21CeXRlc31JPUp9aWYoSSlGPUcucmFuZG9tQnl0ZXMoMTI4KSxGPW5ldyBVaW50MzJBcnJheSgobmV3IFVpbnQ4QXJyYXkoRikpLmJ1ZmZlciksc2pjbC5yYW5kb20uYWRkRW50cm9weShGLDEwMjQsXCJjcnlwdG9bJ3JhbmRvbUJ5dGVzJ11cIik7ZWxzZSBpZihcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBVaW50MzJBcnJheSl7SD1uZXcgVWludDMyQXJyYXkoMzIpO2lmKHdpbmRvdy5jcnlwdG8mJndpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKXdpbmRvdy5jcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKEgpO2Vsc2UgaWYod2luZG93Lm1zQ3J5cHRvJiZ3aW5kb3cubXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKXdpbmRvdy5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMoSCk7XG5lbHNlIGJyZWFrIGE7c2pjbC5yYW5kb20uYWRkRW50cm9weShILDEwMjQsXCJjcnlwdG9bJ2dldFJhbmRvbVZhbHVlcyddXCIpfX1jYXRjaChNKXtcInVuZGVmaW5lZFwiIT09dHlwZW9mIHdpbmRvdyYmd2luZG93LmNvbnNvbGUmJihjb25zb2xlLmxvZyhcIlRoZXJlIHdhcyBhbiBlcnJvciBjb2xsZWN0aW5nIGVudHJvcHkgZnJvbSB0aGUgYnJvd3NlcjpcIiksY29uc29sZS5sb2coTSkpfVxuc2pjbC5qc29uPXtkZWZhdWx0czp7djoxLGl0ZXI6MUUzLGtzOjEyOCx0czo2NCxtb2RlOlwiY2NtXCIsYWRhdGE6XCJcIixjaXBoZXI6XCJhZXNcIn0sWTpmdW5jdGlvbihhLGIsYyxkKXtjPWN8fHt9O2Q9ZHx8e307dmFyIGU9c2pjbC5qc29uLGY9ZS5lKHtpdjpzamNsLnJhbmRvbS5yYW5kb21Xb3Jkcyg0LDApfSxlLmRlZmF1bHRzKSxnO2UuZShmLGMpO2M9Zi5hZGF0YTtcInN0cmluZ1wiPT09dHlwZW9mIGYuc2FsdCYmKGYuc2FsdD1zamNsLmNvZGVjLmJhc2U2NC50b0JpdHMoZi5zYWx0KSk7XCJzdHJpbmdcIj09PXR5cGVvZiBmLml2JiYoZi5pdj1zamNsLmNvZGVjLmJhc2U2NC50b0JpdHMoZi5pdikpOyghc2pjbC5tb2RlW2YubW9kZV18fCFzamNsLmNpcGhlcltmLmNpcGhlcl18fFwic3RyaW5nXCI9PT10eXBlb2YgYSYmMTAwPj1mLml0ZXJ8fDY0IT09Zi50cyYmOTYhPT1mLnRzJiYxMjghPT1mLnRzfHwxMjghPT1mLmtzJiYxOTIhPT1mLmtzJiYweDEwMCE9PWYua3N8fDI+Zi5pdi5sZW5ndGh8fDQ8XG5mLml2Lmxlbmd0aCkmJnEobmV3IHNqY2wuZXhjZXB0aW9uLmludmFsaWQoXCJqc29uIGVuY3J5cHQ6IGludmFsaWQgcGFyYW1ldGVyc1wiKSk7XCJzdHJpbmdcIj09PXR5cGVvZiBhPyhnPXNqY2wubWlzYy5jYWNoZWRQYmtkZjIoYSxmKSxhPWcua2V5LnNsaWNlKDAsZi5rcy8zMiksZi5zYWx0PWcuc2FsdCk6c2pjbC5lY2MmJmEgaW5zdGFuY2VvZiBzamNsLmVjYy5lbEdhbWFsLnB1YmxpY0tleSYmKGc9YS5rZW0oKSxmLmtlbXRhZz1nLnRhZyxhPWcua2V5LnNsaWNlKDAsZi5rcy8zMikpO1wic3RyaW5nXCI9PT10eXBlb2YgYiYmKGI9c2pjbC5jb2RlYy51dGY4U3RyaW5nLnRvQml0cyhiKSk7XCJzdHJpbmdcIj09PXR5cGVvZiBjJiYoZi5hZGF0YT1jPXNqY2wuY29kZWMudXRmOFN0cmluZy50b0JpdHMoYykpO2c9bmV3IHNqY2wuY2lwaGVyW2YuY2lwaGVyXShhKTtlLmUoZCxmKTtkLmtleT1hO2YuY3Q9c2pjbC5tb2RlW2YubW9kZV0uZW5jcnlwdChnLGIsZi5pdixjLGYudHMpO3JldHVybiBmfSxcbmVuY3J5cHQ6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9c2pjbC5qc29uLGY9ZS5ZLmFwcGx5KGUsYXJndW1lbnRzKTtyZXR1cm4gZS5lbmNvZGUoZil9LFg6ZnVuY3Rpb24oYSxiLGMsZCl7Yz1jfHx7fTtkPWR8fHt9O3ZhciBlPXNqY2wuanNvbjtiPWUuZShlLmUoZS5lKHt9LGUuZGVmYXVsdHMpLGIpLGMsITApO3ZhciBmLGc7Zj1iLmFkYXRhO1wic3RyaW5nXCI9PT10eXBlb2YgYi5zYWx0JiYoYi5zYWx0PXNqY2wuY29kZWMuYmFzZTY0LnRvQml0cyhiLnNhbHQpKTtcInN0cmluZ1wiPT09dHlwZW9mIGIuaXYmJihiLml2PXNqY2wuY29kZWMuYmFzZTY0LnRvQml0cyhiLml2KSk7KCFzamNsLm1vZGVbYi5tb2RlXXx8IXNqY2wuY2lwaGVyW2IuY2lwaGVyXXx8XCJzdHJpbmdcIj09PXR5cGVvZiBhJiYxMDA+PWIuaXRlcnx8NjQhPT1iLnRzJiY5NiE9PWIudHMmJjEyOCE9PWIudHN8fDEyOCE9PWIua3MmJjE5MiE9PWIua3MmJjB4MTAwIT09Yi5rc3x8IWIuaXZ8fDI+Yi5pdi5sZW5ndGh8fDQ8Yi5pdi5sZW5ndGgpJiZcbnEobmV3IHNqY2wuZXhjZXB0aW9uLmludmFsaWQoXCJqc29uIGRlY3J5cHQ6IGludmFsaWQgcGFyYW1ldGVyc1wiKSk7XCJzdHJpbmdcIj09PXR5cGVvZiBhPyhnPXNqY2wubWlzYy5jYWNoZWRQYmtkZjIoYSxiKSxhPWcua2V5LnNsaWNlKDAsYi5rcy8zMiksYi5zYWx0PWcuc2FsdCk6c2pjbC5lY2MmJmEgaW5zdGFuY2VvZiBzamNsLmVjYy5lbEdhbWFsLnNlY3JldEtleSYmKGE9YS51bmtlbShzamNsLmNvZGVjLmJhc2U2NC50b0JpdHMoYi5rZW10YWcpKS5zbGljZSgwLGIua3MvMzIpKTtcInN0cmluZ1wiPT09dHlwZW9mIGYmJihmPXNqY2wuY29kZWMudXRmOFN0cmluZy50b0JpdHMoZikpO2c9bmV3IHNqY2wuY2lwaGVyW2IuY2lwaGVyXShhKTtmPXNqY2wubW9kZVtiLm1vZGVdLmRlY3J5cHQoZyxiLmN0LGIuaXYsZixiLnRzKTtlLmUoZCxiKTtkLmtleT1hO3JldHVybiAxPT09Yy5yYXc/ZjpzamNsLmNvZGVjLnV0ZjhTdHJpbmcuZnJvbUJpdHMoZil9LGRlY3J5cHQ6ZnVuY3Rpb24oYSxiLFxuYyxkKXt2YXIgZT1zamNsLmpzb247cmV0dXJuIGUuWChhLGUuZGVjb2RlKGIpLGMsZCl9LGVuY29kZTpmdW5jdGlvbihhKXt2YXIgYixjPVwie1wiLGQ9XCJcIjtmb3IoYiBpbiBhKWlmKGEuaGFzT3duUHJvcGVydHkoYikpc3dpdGNoKGIubWF0Y2goL15bYS16MC05XSskL2kpfHxxKG5ldyBzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwianNvbiBlbmNvZGU6IGludmFsaWQgcHJvcGVydHkgbmFtZVwiKSksYys9ZCsnXCInK2IrJ1wiOicsZD1cIixcIix0eXBlb2YgYVtiXSl7Y2FzZSBcIm51bWJlclwiOmNhc2UgXCJib29sZWFuXCI6Yys9YVtiXTticmVhaztjYXNlIFwic3RyaW5nXCI6Yys9J1wiJytlc2NhcGUoYVtiXSkrJ1wiJzticmVhaztjYXNlIFwib2JqZWN0XCI6Yys9J1wiJytzamNsLmNvZGVjLmJhc2U2NC5mcm9tQml0cyhhW2JdLDApKydcIic7YnJlYWs7ZGVmYXVsdDpxKG5ldyBzamNsLmV4Y2VwdGlvbi5idWcoXCJqc29uIGVuY29kZTogdW5zdXBwb3J0ZWQgdHlwZVwiKSl9cmV0dXJuIGMrXCJ9XCJ9LGRlY29kZTpmdW5jdGlvbihhKXthPVxuYS5yZXBsYWNlKC9cXHMvZyxcIlwiKTthLm1hdGNoKC9eXFx7LipcXH0kLyl8fHEobmV3IHNqY2wuZXhjZXB0aW9uLmludmFsaWQoXCJqc29uIGRlY29kZTogdGhpcyBpc24ndCBqc29uIVwiKSk7YT1hLnJlcGxhY2UoL15cXHt8XFx9JC9nLFwiXCIpLnNwbGl0KC8sLyk7dmFyIGI9e30sYyxkO2ZvcihjPTA7YzxhLmxlbmd0aDtjKyspKGQ9YVtjXS5tYXRjaCgvXlxccyooPzooW1wiJ10/KShbYS16XVthLXowLTldKilcXDEpXFxzKjpcXHMqKD86KC0/XFxkKyl8XCIoW2EtejAtOStcXC8lKl8uQD1cXC1dKilcInwodHJ1ZXxmYWxzZSkpJC9pKSl8fHEobmV3IHNqY2wuZXhjZXB0aW9uLmludmFsaWQoXCJqc29uIGRlY29kZTogdGhpcyBpc24ndCBqc29uIVwiKSksZFszXT9iW2RbMl1dPXBhcnNlSW50KGRbM10sMTApOmRbNF0/YltkWzJdXT1kWzJdLm1hdGNoKC9eKGN0fGFkYXRhfHNhbHR8aXYpJC8pP3NqY2wuY29kZWMuYmFzZTY0LnRvQml0cyhkWzRdKTp1bmVzY2FwZShkWzRdKTpkWzVdJiYoYltkWzJdXT1cInRydWVcIj09PVxuZFs1XSk7cmV0dXJuIGJ9LGU6ZnVuY3Rpb24oYSxiLGMpe2E9PT1zJiYoYT17fSk7aWYoYj09PXMpcmV0dXJuIGE7Zm9yKHZhciBkIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShkKSYmKGMmJihhW2RdIT09cyYmYVtkXSE9PWJbZF0pJiZxKG5ldyBzamNsLmV4Y2VwdGlvbi5pbnZhbGlkKFwicmVxdWlyZWQgcGFyYW1ldGVyIG92ZXJyaWRkZW5cIikpLGFbZF09YltkXSk7cmV0dXJuIGF9LGZhOmZ1bmN0aW9uKGEsYil7dmFyIGM9e30sZDtmb3IoZCBpbiBhKWEuaGFzT3duUHJvcGVydHkoZCkmJmFbZF0hPT1iW2RdJiYoY1tkXT1hW2RdKTtyZXR1cm4gY30sZWE6ZnVuY3Rpb24oYSxiKXt2YXIgYz17fSxkO2ZvcihkPTA7ZDxiLmxlbmd0aDtkKyspYVtiW2RdXSE9PXMmJihjW2JbZF1dPWFbYltkXV0pO3JldHVybiBjfX07c2pjbC5lbmNyeXB0PXNqY2wuanNvbi5lbmNyeXB0O3NqY2wuZGVjcnlwdD1zamNsLmpzb24uZGVjcnlwdDtzamNsLm1pc2MuY2E9e307XG5zamNsLm1pc2MuY2FjaGVkUGJrZGYyPWZ1bmN0aW9uKGEsYil7dmFyIGM9c2pjbC5taXNjLmNhLGQ7Yj1ifHx7fTtkPWIuaXRlcnx8MUUzO2M9Y1thXT1jW2FdfHx7fTtkPWNbZF09Y1tkXXx8e2ZpcnN0U2FsdDpiLnNhbHQmJmIuc2FsdC5sZW5ndGg/Yi5zYWx0LnNsaWNlKDApOnNqY2wucmFuZG9tLnJhbmRvbVdvcmRzKDIsMCl9O2M9Yi5zYWx0PT09cz9kLmZpcnN0U2FsdDpiLnNhbHQ7ZFtjXT1kW2NdfHxzamNsLm1pc2MucGJrZGYyKGEsYyxiLml0ZXIpO3JldHVybntrZXk6ZFtjXS5zbGljZSgwKSxzYWx0OmMuc2xpY2UoMCl9fTtcblxudmFyIGdsdWU9ZnVuY3Rpb24oZSxuKXtcInVzZSBzdHJpY3RcIjt2YXIgdCxvLGksYyxyLGEscyx1LGw9ZnVuY3Rpb24oKXt2YXIgdCxvPXt9O3JldHVybiBvLm9wZW49ZnVuY3Rpb24oKXt0cnl7dmFyIGk7aT1lLm1hdGNoKFwiXmh0dHBzOi8vXCIpP1wid3NzXCIrZS5zdWJzdHIoNSk6XCJ3c1wiK2Uuc3Vic3RyKDQpLGkrPW4uYmFzZVVSTCtcIndzXCIsdD1uZXcgV2ViU29ja2V0KGkpLHQub25tZXNzYWdlPWZ1bmN0aW9uKGUpe28ub25NZXNzYWdlKGUuZGF0YS50b1N0cmluZygpKX0sdC5vbmVycm9yPWZ1bmN0aW9uKGUpe3ZhciBuPVwidGhlIHdlYnNvY2tldCBjbG9zZWQgdGhlIGNvbm5lY3Rpb24gd2l0aCBcIjtuKz1lLmNvZGU/XCJ0aGUgZXJyb3IgY29kZTogXCIrZS5jb2RlOlwiYW4gZXJyb3IuXCIsby5vbkVycm9yKG4pfSx0Lm9uY2xvc2U9ZnVuY3Rpb24oKXtvLm9uQ2xvc2UoKX0sdC5vbm9wZW49ZnVuY3Rpb24oKXtvLm9uT3BlbigpfX1jYXRjaChjKXtvLm9uRXJyb3IoKX19LG8uc2VuZD1mdW5jdGlvbihlKXt0LnNlbmQoZSl9LG8ucmVzZXQ9ZnVuY3Rpb24oKXt0JiZ0LmNsb3NlKCksdD12b2lkIDB9LG99LGQ9ZnVuY3Rpb24oKXt2YXIgdCxvLGksYz1lK24uYmFzZVVSTCtcImFqYXhcIixyPThlMyxhPTQ1ZTMscz17VGltZW91dDpcInRcIixDbG9zZWQ6XCJjXCJ9LHU9e0RlbGltaXRlcjpcIiZcIixJbml0OlwiaVwiLFB1c2g6XCJ1XCIsUG9sbDpcIm9cIn0sbD17fSxkPSExLGY9ITEsZz1mdW5jdGlvbigpe2k9ZnVuY3Rpb24oKXt9LGQmJmQuYWJvcnQoKSxmJiZmLmFib3J0KCl9LHY9ZnVuY3Rpb24oKXtnKCksbC5vbkNsb3NlKCl9LG09ZnVuY3Rpb24oZSl7ZygpLGU9ZT9cInRoZSBhamF4IHNvY2tldCBjbG9zZWQgdGhlIGNvbm5lY3Rpb24gd2l0aCB0aGUgZXJyb3I6IFwiK2U6XCJ0aGUgYWpheCBzb2NrZXQgY2xvc2VkIHRoZSBjb25uZWN0aW9uIHdpdGggYW4gZXJyb3IuXCIsbC5vbkVycm9yKGUpfSxoPWZ1bmN0aW9uKGUsbil7Zj0kLmFqYXgoe3VybDpjLHN1Y2Nlc3M6ZnVuY3Rpb24oZSl7Zj0hMSxuJiZuKGUpfSxlcnJvcjpmdW5jdGlvbihlLG4pe2Y9ITEsbShuKX0sdHlwZTpcIlBPU1RcIixkYXRhOmUsZGF0YVR5cGU6XCJ0ZXh0XCIsdGltZW91dDpyfSl9O3JldHVybiBpPWZ1bmN0aW9uKCl7ZD0kLmFqYXgoe3VybDpjLHN1Y2Nlc3M6ZnVuY3Rpb24oZSl7aWYoZD0hMSxlPT1zLlRpbWVvdXQpcmV0dXJuIHZvaWQgaSgpO2lmKGU9PXMuQ2xvc2VkKXJldHVybiB2b2lkIHYoKTt2YXIgbj1lLmluZGV4T2YodS5EZWxpbWl0ZXIpO3JldHVybiAwPm4/dm9pZCBtKFwiYWpheCBzb2NrZXQ6IGZhaWxlZCB0byBzcGxpdCBwb2xsIHRva2VuIGZyb20gZGF0YSFcIik6KG89ZS5zdWJzdHJpbmcoMCxuKSxlPWUuc3Vic3RyKG4rMSksaSgpLHZvaWQgbC5vbk1lc3NhZ2UoZSkpfSxlcnJvcjpmdW5jdGlvbihlLG4pe2Q9ITEsbShuKX0sdHlwZTpcIlBPU1RcIixkYXRhOnUuUG9sbCt0K3UuRGVsaW1pdGVyK28sZGF0YVR5cGU6XCJ0ZXh0XCIsdGltZW91dDphfSl9LGwub3Blbj1mdW5jdGlvbigpe2godS5Jbml0LGZ1bmN0aW9uKGUpe3ZhciBuPWUuaW5kZXhPZih1LkRlbGltaXRlcik7cmV0dXJuIDA+bj92b2lkIG0oXCJhamF4IHNvY2tldDogZmFpbGVkIHRvIHNwbGl0IHVpZCBhbmQgcG9sbCB0b2tlbiBmcm9tIGRhdGEhXCIpOih0PWUuc3Vic3RyaW5nKDAsbiksbz1lLnN1YnN0cihuKzEpLGkoKSx2b2lkIGwub25PcGVuKCkpfSl9LGwuc2VuZD1mdW5jdGlvbihlKXtoKHUuUHVzaCt0K3UuRGVsaW1pdGVyK2UpfSxsLnJlc2V0PWZ1bmN0aW9uKCl7ZygpfSxsfSxmPVwiMS43LjBcIixnPVwibVwiLHY9e1dlYlNvY2tldDpcIldlYlNvY2tldFwiLEFqYXhTb2NrZXQ6XCJBamF4U29ja2V0XCJ9LG09e0xlbjoyLEluaXQ6XCJpblwiLFBpbmc6XCJwaVwiLFBvbmc6XCJwb1wiLENsb3NlOlwiY2xcIixJbnZhbGlkOlwiaXZcIixEb250QXV0b1JlY29ubmVjdDpcImRyXCIsQ2hhbm5lbERhdGE6XCJjZFwifSxoPXtEaXNjb25uZWN0ZWQ6XCJkaXNjb25uZWN0ZWRcIixDb25uZWN0aW5nOlwiY29ubmVjdGluZ1wiLFJlY29ubmVjdGluZzpcInJlY29ubmVjdGluZ1wiLENvbm5lY3RlZDpcImNvbm5lY3RlZFwifSxwPXtiYXNlVVJMOlwiL2dsdWUvXCIsZm9yY2VTb2NrZXRUeXBlOiExLGNvbm5lY3RUaW1lb3V0OjFlNCxwaW5nSW50ZXJ2YWw6MzVlMyxwaW5nUmVjb25uZWN0VGltZW91dDo1ZTMscmVjb25uZWN0OiEwLHJlY29ubmVjdERlbGF5OjFlMyxyZWNvbm5lY3REZWxheU1heDo1ZTMscmVjb25uZWN0QXR0ZW1wdHM6MTAscmVzZXRTZW5kQnVmZmVyVGltZW91dDoxZTR9LGI9ITEsaz0hMSxEPWguRGlzY29ubmVjdGVkLFQ9MCx4PSExLHk9ITEsUz0hMSxDPSExLE09W10sdz0hMSxSPSExLE89ITEsST1bXSxMPVwiXCIsUD1mdW5jdGlvbigpe3ZhciBlPVwiJlwiLG49e307cmV0dXJuIG4udW5tYXJzaGFsVmFsdWVzPWZ1bmN0aW9uKG4pe2lmKCFuKXJldHVybiExO3ZhciB0PW4uaW5kZXhPZihlKSxvPXBhcnNlSW50KG4uc3Vic3RyaW5nKDAsdCksMTApO2lmKG49bi5zdWJzdHJpbmcodCsxKSwwPm98fG8+bi5sZW5ndGgpcmV0dXJuITE7dmFyIGk9bi5zdWJzdHIoMCxvKSxjPW4uc3Vic3RyKG8pO3JldHVybntmaXJzdDppLHNlY29uZDpjfX0sbi5tYXJzaGFsVmFsdWVzPWZ1bmN0aW9uKG4sdCl7cmV0dXJuIFN0cmluZyhuLmxlbmd0aCkrZStuK3R9LG59KCksaj1mdW5jdGlvbigpe3ZhciBlPXt9LG49e30sdD1mdW5jdGlvbihlKXt2YXIgbj17b25NZXNzYWdlRnVuYzpmdW5jdGlvbigpe319O3JldHVybiBuLmluc3RhbmNlPXtvbk1lc3NhZ2U6ZnVuY3Rpb24oZSl7bi5vbk1lc3NhZ2VGdW5jPWV9LHNlbmQ6ZnVuY3Rpb24obix0KXtyZXR1cm4gbj9hKG0uQ2hhbm5lbERhdGEsUC5tYXJzaGFsVmFsdWVzKGUsbiksdCk6LTF9fSxufTtyZXR1cm4gZS5nZXQ9ZnVuY3Rpb24oZSl7aWYoIWUpcmV0dXJuITE7dmFyIG89bltlXTtyZXR1cm4gbz9vLmluc3RhbmNlOihvPXQoZSksbltlXT1vLG8uaW5zdGFuY2UpfSxlLmVtaXRPbk1lc3NhZ2U9ZnVuY3Rpb24oZSx0KXtpZihlJiZ0KXt2YXIgbz1uW2VdO2lmKCFvKXJldHVybiB2b2lkIGNvbnNvbGUubG9nKFwiZ2x1ZTogY2hhbm5lbCAnXCIrZStcIic6IGVtaXQgb25NZXNzYWdlIGV2ZW50OiBjaGFubmVsIGRvZXMgbm90IGV4aXN0c1wiKTt0cnl7by5vbk1lc3NhZ2VGdW5jKHQpfWNhdGNoKGkpe3JldHVybiB2b2lkIGNvbnNvbGUubG9nKFwiZ2x1ZTogY2hhbm5lbCAnXCIrZStcIic6IG9uTWVzc2FnZSBldmVudCBjYWxsIGZhaWxlZDogXCIraS5tZXNzYWdlKX19fSxlfSgpO3I9ZnVuY3Rpb24oZSl7cmV0dXJuIGI/Tz92b2lkIGIuc2VuZChlKTp2b2lkIEkucHVzaChlKTp2b2lkIDB9O3ZhciBBPWZ1bmN0aW9uKCl7aWYoMCE9PUkubGVuZ3RoKXtmb3IodmFyIGU9MDtlPEkubGVuZ3RoO2UrKylyKElbZV0pO0k9W119fSxVPWZ1bmN0aW9uKCl7Uj0hMSx3IT09ITEmJihjbGVhclRpbWVvdXQodyksdz0hMSl9LFc9ZnVuY3Rpb24oKXt3IT09ITF8fFJ8fCh3PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtpZih3PSExLFI9ITAsMCE9PU0ubGVuZ3RoKXtmb3IodmFyIGUsbj0wO248TS5sZW5ndGg7bisrKWlmKGU9TVtuXSxlLmRpc2NhcmRDYWxsYmFjayYmJC5pc0Z1bmN0aW9uKGUuZGlzY2FyZENhbGxiYWNrKSl0cnl7ZS5kaXNjYXJkQ2FsbGJhY2soZS5kYXRhKX1jYXRjaCh0KXtjb25zb2xlLmxvZyhcImdsdWU6IGZhaWxlZCB0byBjYWxsIGRpc2NhcmQgY2FsbGJhY2s6IFwiK3QubWVzc2FnZSl9dShcImRpc2NhcmRfc2VuZF9idWZmZXJcIiksTT1bXX19LG4ucmVzZXRTZW5kQnVmZmVyVGltZW91dCkpfSxFPWZ1bmN0aW9uKCl7aWYoVSgpLDAhPT1NLmxlbmd0aCl7Zm9yKHZhciBlLG49MDtuPE0ubGVuZ3RoO24rKyllPU1bbl0scihlLmNtZCtlLmRhdGEpO009W119fTthPWZ1bmN0aW9uKGUsbix0KXtyZXR1cm4gbnx8KG49XCJcIiksYiYmRD09PWguQ29ubmVjdGVkPyhyKGUrbiksMSk6Uj8odCYmJC5pc0Z1bmN0aW9uKHQpJiZ0KG4pLC0xKTooVygpLE0ucHVzaCh7Y21kOmUsZGF0YTpuLGRpc2NhcmRDYWxsYmFjazp0fSksMCl9O3ZhciBGPWZ1bmN0aW9uKCl7eSE9PSExJiYoY2xlYXJUaW1lb3V0KHkpLHk9ITEpfSxxPWZ1bmN0aW9uKCl7RigpLHk9c2V0VGltZW91dChmdW5jdGlvbigpe3k9ITEsdShcImNvbm5lY3RfdGltZW91dFwiKSxzKCl9LG4uY29ubmVjdFRpbWVvdXQpfSxWPWZ1bmN0aW9uKCl7UyE9PSExJiYoY2xlYXJUaW1lb3V0KFMpLFM9ITEpLEMhPT0hMSYmKGNsZWFyVGltZW91dChDKSxDPSExKX0sXz1mdW5jdGlvbigpe1YoKSxTPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtTPSExLHIobS5QaW5nKSxDPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtDPSExLHUoXCJ0aW1lb3V0XCIpLHMoKX0sbi5waW5nUmVjb25uZWN0VGltZW91dCl9LG4ucGluZ0ludGVydmFsKX0sej1mdW5jdGlvbigpe3JldHVybiBrP3ZvaWQoYj1vKCkpOlQ+MT8obz1kLGI9bygpLHZvaWQoaT12LkFqYXhTb2NrZXQpKTooIW4uZm9yY2VTb2NrZXRUeXBlJiZ3aW5kb3cuV2ViU29ja2V0fHxuLmZvcmNlU29ja2V0VHlwZT09PXYuV2ViU29ja2V0PyhvPWwsaT12LldlYlNvY2tldCk6KG89ZCxpPXYuQWpheFNvY2tldCksdm9pZChiPW8oKSkpfSxCPWZ1bmN0aW9uKGUpe3JldHVybiBlPUpTT04ucGFyc2UoZSksZS5zb2NrZXRJRD8oTD1lLnNvY2tldElELE89ITAsQSgpLEQ9aC5Db25uZWN0ZWQsdShcImNvbm5lY3RlZFwiKSx2b2lkIHNldFRpbWVvdXQoRSwwKSk6KGMoKSx2b2lkIGNvbnNvbGUubG9nKFwiZ2x1ZTogc29ja2V0IGluaXRpYWxpemF0aW9uIGZhaWxlZDogaW52YWxpZCBpbml0aWFsaXphdGlvbiBkYXRhIHJlY2VpdmVkXCIpKX0sSj1mdW5jdGlvbigpe3ooKSxiLm9uT3Blbj1mdW5jdGlvbigpe0YoKSxUPTAsaz0hMCxfKCk7dmFyIGU9e3ZlcnNpb246Zn07ZT1KU09OLnN0cmluZ2lmeShlKSxiLnNlbmQobS5Jbml0K2UpfSxiLm9uQ2xvc2U9ZnVuY3Rpb24oKXtzKCl9LGIub25FcnJvcj1mdW5jdGlvbihlKXt1KFwiZXJyb3JcIixbZV0pLHMoKX0sYi5vbk1lc3NhZ2U9ZnVuY3Rpb24oZSl7aWYoXygpLGUubGVuZ3RoPG0uTGVuKXJldHVybiB2b2lkIGNvbnNvbGUubG9nKFwiZ2x1ZTogcmVjZWl2ZWQgaW52YWxpZCBkYXRhIGZyb20gc2VydmVyOiBkYXRhIGlzIHRvbyBzaG9ydC5cIik7dmFyIG49ZS5zdWJzdHIoMCxtLkxlbik7aWYoZT1lLnN1YnN0cihtLkxlbiksbj09PW0uUGluZylyKG0uUG9uZyk7ZWxzZSBpZihuPT09bS5Qb25nKTtlbHNlIGlmKG49PT1tLkludmFsaWQpY29uc29sZS5sb2coXCJnbHVlOiBzZXJ2ZXIgcmVwbGllZCB3aXRoIGFuIGludmFsaWQgcmVxdWVzdCBub3RpZmljYXRpb24hXCIpO2Vsc2UgaWYobj09PW0uRG9udEF1dG9SZWNvbm5lY3QpeD0hMCxjb25zb2xlLmxvZyhcImdsdWU6IHNlcnZlciByZXBsaWVkIHdpdGggYW4gZG9uJ3QgYXV0b21hdGljYWxseSByZWNvbm5lY3QgcmVxdWVzdC4gVGhpcyBtaWdodCBiZSBkdWUgdG8gYW4gaW5jb21wYXRpYmxlIHByb3RvY29sIHZlcnNpb24uXCIpO2Vsc2UgaWYobj09PW0uSW5pdClCKGUpO2Vsc2UgaWYobj09PW0uQ2hhbm5lbERhdGEpe3ZhciB0PVAudW5tYXJzaGFsVmFsdWVzKGUpO2lmKCF0KXJldHVybiB2b2lkIGNvbnNvbGUubG9nKFwiZ2x1ZTogc2VydmVyIHJlcXVlc3RlZCBhbiBpbnZhbGlkIGNoYW5uZWwgZGF0YSByZXF1ZXN0OiBcIitlKTtqLmVtaXRPbk1lc3NhZ2UodC5maXJzdCx0LnNlY29uZCl9ZWxzZSBjb25zb2xlLmxvZyhcImdsdWU6IHJlY2VpdmVkIGludmFsaWQgZGF0YSBmcm9tIHNlcnZlciB3aXRoIGNvbW1hbmQgJ1wiK24rXCInIGFuZCBkYXRhICdcIitlK1wiJyFcIil9LHNldFRpbWVvdXQoZnVuY3Rpb24oKXtUPjA/KEQ9aC5SZWNvbm5lY3RpbmcsdShcInJlY29ubmVjdGluZ1wiKSk6KEQ9aC5Db25uZWN0aW5nLHUoXCJjb25uZWN0aW5nXCIpKSxxKCksYi5vcGVuKCl9LDApfSxOPWZ1bmN0aW9uKCl7RigpLFYoKSxPPSExLEw9XCJcIixJPVtdLGImJihiLm9uT3Blbj1iLm9uQ2xvc2U9Yi5vbk1lc3NhZ2U9Yi5vbkVycm9yPWZ1bmN0aW9uKCl7fSxiLnJlc2V0KCksYj0hMSl9O2lmKHM9ZnVuY3Rpb24oKXtpZihOKCksbi5yZWNvbm5lY3RBdHRlbXB0cz4wJiZUPm4ucmVjb25uZWN0QXR0ZW1wdHN8fG4ucmVjb25uZWN0PT09ITF8fHgpcmV0dXJuIEQ9aC5EaXNjb25uZWN0ZWQsdm9pZCB1KFwiZGlzY29ubmVjdGVkXCIpO1QrPTE7dmFyIGU9bi5yZWNvbm5lY3REZWxheSpUO2U+bi5yZWNvbm5lY3REZWxheU1heCYmKGU9bi5yZWNvbm5lY3REZWxheU1heCksc2V0VGltZW91dChmdW5jdGlvbigpe0ooKX0sZSl9LGM9ZnVuY3Rpb24oKXtiJiYocihtLkNsb3NlKSxOKCksRD1oLkRpc2Nvbm5lY3RlZCx1KFwiZGlzY29ubmVjdGVkXCIpKX0sdD1qLmdldChnKSxlfHwoZT13aW5kb3cubG9jYXRpb24ucHJvdG9jb2wrXCIvL1wiK3dpbmRvdy5sb2NhdGlvbi5ob3N0KSwhZS5tYXRjaChcIl5odHRwOi8vXCIpJiYhZS5tYXRjaChcIl5odHRwczovL1wiKSlyZXR1cm4gdm9pZCBjb25zb2xlLmxvZyhcImdsdWU6IGludmFsaWQgaG9zdDogbWlzc2luZyAnaHR0cDovLycgb3IgJ2h0dHBzOi8vJyFcIik7bj0kLmV4dGVuZChwLG4pLG4ucmVjb25uZWN0RGVsYXlNYXg8bi5yZWNvbm5lY3REZWxheSYmKG4ucmVjb25uZWN0RGVsYXlNYXg9bi5yZWNvbm5lY3REZWxheSksMCE9PW4uYmFzZVVSTC5pbmRleE9mKFwiL1wiKSYmKG4uYmFzZVVSTD1cIi9cIituLmJhc2VVUkwpLFwiL1wiIT09bi5iYXNlVVJMLnNsaWNlKC0xKSYmKG4uYmFzZVVSTD1uLmJhc2VVUkwrXCIvXCIpLEooKTt2YXIgSD17dmVyc2lvbjpmdW5jdGlvbigpe3JldHVybiBmfSx0eXBlOmZ1bmN0aW9uKCl7cmV0dXJuIGl9LHN0YXRlOmZ1bmN0aW9uKCl7cmV0dXJuIER9LHNvY2tldElEOmZ1bmN0aW9uKCl7cmV0dXJuIEx9LHNlbmQ6ZnVuY3Rpb24oZSxuKXt0LnNlbmQoZSxuKX0sb25NZXNzYWdlOmZ1bmN0aW9uKGUpe3Qub25NZXNzYWdlKGUpfSxvbjpmdW5jdGlvbigpe3ZhciBlPSQoSCk7ZS5vbi5hcHBseShlLGFyZ3VtZW50cyl9LHJlY29ubmVjdDpmdW5jdGlvbigpe0Q9PT1oLkRpc2Nvbm5lY3RlZCYmKFQ9MCx4PSExLHMoKSl9LGNsb3NlOmZ1bmN0aW9uKCl7YygpfSxjaGFubmVsOmZ1bmN0aW9uKGUpe3JldHVybiBqLmdldChlKX19O3JldHVybiB1PWZ1bmN0aW9uKCl7dmFyIGU9JChIKTtlLnRyaWdnZXJIYW5kbGVyLmFwcGx5KGUsYXJndW1lbnRzKX0sSH07XG5cbi8vIEluY2x1ZGUgdGhlIHBvbHlmaWxscy5cbi8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vLyBPYmplY3Qua2V5cyBwb2x5ZmlsbC5cbi8vIEZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2tleXNcbmlmICghT2JqZWN0LmtleXMpIHtcbiAgT2JqZWN0LmtleXMgPSAoZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICAgIGhhc0RvbnRFbnVtQnVnID0gISh7IHRvU3RyaW5nOiBudWxsIH0pLnByb3BlcnR5SXNFbnVtZXJhYmxlKCd0b1N0cmluZycpLFxuICAgICAgICBkb250RW51bXMgPSBbXG4gICAgICAgICAgJ3RvU3RyaW5nJyxcbiAgICAgICAgICAndG9Mb2NhbGVTdHJpbmcnLFxuICAgICAgICAgICd2YWx1ZU9mJyxcbiAgICAgICAgICAnaGFzT3duUHJvcGVydHknLFxuICAgICAgICAgICdpc1Byb3RvdHlwZU9mJyxcbiAgICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICAgICAgICdjb25zdHJ1Y3RvcidcbiAgICAgICAgXSxcbiAgICAgICAgZG9udEVudW1zTGVuZ3RoID0gZG9udEVudW1zLmxlbmd0aDtcblxuICAgIHJldHVybiBmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyAmJiAodHlwZW9mIG9iaiAhPT0gJ2Z1bmN0aW9uJyB8fCBvYmogPT09IG51bGwpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5rZXlzIGNhbGxlZCBvbiBub24tb2JqZWN0Jyk7XG4gICAgICB9XG5cbiAgICAgIHZhciByZXN1bHQgPSBbXSwgcHJvcCwgaTtcblxuICAgICAgZm9yIChwcm9wIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2gocHJvcCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0RvbnRFbnVtQnVnKSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBkb250RW51bXNMZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgZG9udEVudW1zW2ldKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goZG9udEVudW1zW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfSgpKTtcbn1cblxuXG5cbnZhciBCaXRNb25zdGVyID0gZnVuY3Rpb24oaG9zdCkge1xuICAgIC8vIFR1cm4gb24gc3RyaWN0IG1vZGUuXG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLy8gQml0TW9uc3RlciBvYmplY3RcbiAgICB2YXIgYm0gPSB7fTtcblxuICAgIC8vIElmIGhvc3QgaXMgdW5kZWZpbmVkLCB0aGVuIHNldCBpdCB0byBhbiBlbXB0eSBzdHJpbmcuXG4gICAgaWYgKCFob3N0KSB7XG4gICAgICAgIGhvc3QgPSBcIlwiO1xuICAgIH1cblxuICAgIC8vIEluY2x1ZGUgdGhlIGRlcGVuZGVuY2llcy5cbiAgICAvKlxuKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuKlxuKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4qICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbipcbiogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4qXG4qICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4qL1xuXG4vKlxuICogIFRoaXMgY29kZSBsaXZlcyBpbnNpZGUgdGhlIEJpdE1vbnN0ZXIgZnVuY3Rpb24uXG4gKi9cblxudmFyIHV0aWxzID0gKGZ1bmN0aW9uKCkge1xuICAgIC8qXG4gICAgICogQ29uc3RhbnRzXG4gICAgICovXG5cbiAgICB2YXIgRGVsaW1pdGVyID0gXCImXCI7XG5cblxuXG4gICAgLypcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKi9cblxuICAgICB2YXIgaW5zdGFuY2UgPSB7fTsgLy8gT3VyIHB1YmxpYyBpbnN0YW5jZSBvYmplY3QgcmV0dXJuZWQgYnkgdGhpcyBmdW5jdGlvbi5cblxuXG5cbiAgICAgLypcbiAgICAgICogUHJpdmF0ZSBNZXRob2RzXG4gICAgICAqL1xuXG4gICAgIC8qKlxuICAgICAgKiBKUyBJbXBsZW1lbnRhdGlvbiBvZiBNdXJtdXJIYXNoMyAocjEzNikgKGFzIG9mIE1heSAyMCwgMjAxMSlcbiAgICAgICpcbiAgICAgICogQGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmdhcnkuY291cnRAZ21haWwuY29tXCI+R2FyeSBDb3VydDwvYT5cbiAgICAgICogQHNlZSBodHRwOi8vZ2l0aHViLmNvbS9nYXJ5Y291cnQvbXVybXVyaGFzaC1qc1xuICAgICAgKiBAYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86YWFwcGxlYnlAZ21haWwuY29tXCI+QXVzdGluIEFwcGxlYnk8L2E+XG4gICAgICAqIEBzZWUgaHR0cDovL3NpdGVzLmdvb2dsZS5jb20vc2l0ZS9tdXJtdXJoYXNoL1xuICAgICAgKlxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IEFTQ0lJIG9ubHlcbiAgICAgICogQHBhcmFtIHtudW1iZXJ9IHNlZWQgUG9zaXRpdmUgaW50ZWdlciBvbmx5XG4gICAgICAqIEByZXR1cm4ge251bWJlcn0gMzItYml0IHBvc2l0aXZlIGludGVnZXIgaGFzaFxuICAgICAgKi9cbiAgICAgdmFyIG11cm11cmhhc2gzXzMyX2djID0gZnVuY3Rpb24oa2V5LCBzZWVkKSB7XG4gICAgIFx0dmFyIHJlbWFpbmRlciwgYnl0ZXMsIGgxLCBoMWIsIGMxLCBjMWIsIGMyLCBjMmIsIGsxLCBpO1xuXG4gICAgIFx0cmVtYWluZGVyID0ga2V5Lmxlbmd0aCAmIDM7IC8vIGtleS5sZW5ndGggJSA0XG4gICAgIFx0Ynl0ZXMgPSBrZXkubGVuZ3RoIC0gcmVtYWluZGVyO1xuICAgICBcdGgxID0gc2VlZDtcbiAgICAgXHRjMSA9IDB4Y2M5ZTJkNTE7XG4gICAgIFx0YzIgPSAweDFiODczNTkzO1xuICAgICBcdGkgPSAwO1xuXG4gICAgIFx0d2hpbGUgKGkgPCBieXRlcykge1xuICAgICBcdCAgXHRrMSA9XG4gICAgIFx0ICBcdCAgKChrZXkuY2hhckNvZGVBdChpKSAmIDB4ZmYpKSB8XG4gICAgIFx0ICBcdCAgKChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgOCkgfFxuICAgICBcdCAgXHQgICgoa2V5LmNoYXJDb2RlQXQoKytpKSAmIDB4ZmYpIDw8IDE2KSB8XG4gICAgIFx0ICBcdCAgKChrZXkuY2hhckNvZGVBdCgrK2kpICYgMHhmZikgPDwgMjQpO1xuICAgICBcdFx0KytpO1xuXG4gICAgIFx0XHRrMSA9ICgoKChrMSAmIDB4ZmZmZikgKiBjMSkgKyAoKCgoazEgPj4+IDE2KSAqIGMxKSAmIDB4ZmZmZikgPDwgMTYpKSkgJiAweGZmZmZmZmZmO1xuICAgICBcdFx0azEgPSAoazEgPDwgMTUpIHwgKGsxID4+PiAxNyk7XG4gICAgIFx0XHRrMSA9ICgoKChrMSAmIDB4ZmZmZikgKiBjMikgKyAoKCgoazEgPj4+IDE2KSAqIGMyKSAmIDB4ZmZmZikgPDwgMTYpKSkgJiAweGZmZmZmZmZmO1xuXG4gICAgIFx0XHRoMSBePSBrMTtcbiAgICAgICAgICAgICBoMSA9IChoMSA8PCAxMykgfCAoaDEgPj4+IDE5KTtcbiAgICAgXHRcdGgxYiA9ICgoKChoMSAmIDB4ZmZmZikgKiA1KSArICgoKChoMSA+Pj4gMTYpICogNSkgJiAweGZmZmYpIDw8IDE2KSkpICYgMHhmZmZmZmZmZjtcbiAgICAgXHRcdGgxID0gKCgoaDFiICYgMHhmZmZmKSArIDB4NmI2NCkgKyAoKCgoaDFiID4+PiAxNikgKyAweGU2NTQpICYgMHhmZmZmKSA8PCAxNikpO1xuICAgICBcdH1cblxuICAgICBcdGsxID0gMDtcblxuICAgICBcdHN3aXRjaCAocmVtYWluZGVyKSB7XG4gICAgIFx0XHRjYXNlIDM6IGsxIF49IChrZXkuY2hhckNvZGVBdChpICsgMikgJiAweGZmKSA8PCAxNjtcbiAgICAgXHRcdGNhc2UgMjogazEgXj0gKGtleS5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4ZmYpIDw8IDg7XG4gICAgIFx0XHRjYXNlIDE6IGsxIF49IChrZXkuY2hhckNvZGVBdChpKSAmIDB4ZmYpO1xuXG4gICAgIFx0XHRrMSA9ICgoKGsxICYgMHhmZmZmKSAqIGMxKSArICgoKChrMSA+Pj4gMTYpICogYzEpICYgMHhmZmZmKSA8PCAxNikpICYgMHhmZmZmZmZmZjtcbiAgICAgXHRcdGsxID0gKGsxIDw8IDE1KSB8IChrMSA+Pj4gMTcpO1xuICAgICBcdFx0azEgPSAoKChrMSAmIDB4ZmZmZikgKiBjMikgKyAoKCgoazEgPj4+IDE2KSAqIGMyKSAmIDB4ZmZmZikgPDwgMTYpKSAmIDB4ZmZmZmZmZmY7XG4gICAgIFx0XHRoMSBePSBrMTtcbiAgICAgXHR9XG5cbiAgICAgXHRoMSBePSBrZXkubGVuZ3RoO1xuXG4gICAgIFx0aDEgXj0gaDEgPj4+IDE2O1xuICAgICBcdGgxID0gKCgoaDEgJiAweGZmZmYpICogMHg4NWViY2E2YikgKyAoKCgoaDEgPj4+IDE2KSAqIDB4ODVlYmNhNmIpICYgMHhmZmZmKSA8PCAxNikpICYgMHhmZmZmZmZmZjtcbiAgICAgXHRoMSBePSBoMSA+Pj4gMTM7XG4gICAgIFx0aDEgPSAoKCgoaDEgJiAweGZmZmYpICogMHhjMmIyYWUzNSkgKyAoKCgoaDEgPj4+IDE2KSAqIDB4YzJiMmFlMzUpICYgMHhmZmZmKSA8PCAxNikpKSAmIDB4ZmZmZmZmZmY7XG4gICAgIFx0aDEgXj0gaDEgPj4+IDE2O1xuXG4gICAgIFx0cmV0dXJuIGgxID4+PiAwO1xuICAgIH07XG5cblxuXG4gICAgLypcbiAgICAgKiBQdWJsaWMgTWV0aG9kc1xuICAgICAqL1xuXG4gICAgLy8gc3RvcmFnZUF2YWlsYWJsZSB0ZXN0cyBpZiB0aGUgc3RvcmFnZSB0eXBlIGlzIHN1cHBvcnRlZC5cbiAgICBpbnN0YW5jZS5zdG9yYWdlQXZhaWxhYmxlID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdmFyIHN0b3JhZ2UgPSB3aW5kb3dbdHlwZV0sXG4gICAgICAgICAgICB4ID0gJ19fc3RvcmFnZV90ZXN0X18nO1xuICAgICAgICAgICAgc3RvcmFnZS5zZXRJdGVtKHgsIHgpO1xuICAgICAgICAgICAgc3RvcmFnZS5yZW1vdmVJdGVtKHgpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIGNhbGxDYXRjaCBjYWxscyBhIGNhbGxiYWNrIGFuZCBjYXRjaGVzIGV4Y2VwdGlvbnMgd2hpY2ggYXJlIGxvZ2dlZC5cbiAgICAvLyBBcmd1bWVudHMgYXJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2suXG4gICAgaW5zdGFuY2UuY2FsbENhdGNoID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBmaXJzdCBhcmd1bWVudC5cbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNoaWZ0LmNhbGwoYXJndW1lbnRzKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoY2FsbGJhY2ssIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogY2F0Y2hlZCBleGNlcHRpb24gd2hpbGUgY2FsbGluZyBjYWxsYmFjazpcIik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpbnN0YW5jZS5yYW5kb21TdHJpbmcgPSBmdW5jdGlvbihsZW4pIHtcbiAgICAgICAgdmFyIHRleHQgPSBcIlwiO1xuICAgICAgICB2YXIgcG9zc2libGUgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XG5cbiAgICAgICAgZm9yKCB2YXIgaT0wOyBpIDwgbGVuOyBpKysgKSB7XG4gICAgICAgICAgICB0ZXh0ICs9IHBvc3NpYmxlLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBwb3NzaWJsZS5sZW5ndGgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICAvLyB1bm1hcnNoYWxWYWx1ZXMgc3BsaXRzIHR3byB2YWx1ZXMgZnJvbSBhIHNpbmdsZSBzdHJpbmcuXG4gICAgLy8gVGhpcyBmdW5jdGlvbiBpcyBjaGFpbmFibGUgdG8gZXh0cmFjdCBtdWx0aXBsZSB2YWx1ZXMuXG4gICAgLy8gQW4gb2JqZWN0IHdpdGggdHdvIHN0cmluZ3MgKGZpcnN0LCBzZWNvbmQpIGlzIHJldHVybmVkLlxuICAgIGluc3RhbmNlLnVubWFyc2hhbFZhbHVlcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBGaW5kIHRoZSBkZWxpbWl0ZXIgcG9zaXRpb24uXG4gICAgICAgIHZhciBwb3MgPSBkYXRhLmluZGV4T2YoRGVsaW1pdGVyKTtcblxuICAgICAgICAvLyBFeHRyYWN0IHRoZSB2YWx1ZSBsZW5ndGggaW50ZWdlciBvZiB0aGUgZmlyc3QgdmFsdWUuXG4gICAgICAgIHZhciBsZW4gPSBwYXJzZUludChkYXRhLnN1YnN0cmluZygwLCBwb3MpLCAxMCk7XG4gICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cmluZyhwb3MgKyAxKTtcblxuICAgICAgICAvLyBWYWxpZGF0ZSB0aGUgbGVuZ3RoLlxuICAgICAgICBpZiAobGVuIDwgMCB8fCBsZW4gPiBkYXRhLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHNwbGl0IHRoZSBmaXJzdCB2YWx1ZSBmcm9tIHRoZSBzZWNvbmQuXG4gICAgICAgIHZhciBmaXJzdFYgPSBkYXRhLnN1YnN0cigwLCBsZW4pO1xuICAgICAgICB2YXIgc2Vjb25kViA9IGRhdGEuc3Vic3RyKGxlbik7XG5cbiAgICAgICAgLy8gUmV0dXJuIGFuIG9iamVjdCB3aXRoIGJvdGggdmFsdWVzLlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlyc3Q6ICBmaXJzdFYsXG4gICAgICAgICAgICBzZWNvbmQ6IHNlY29uZFZcbiAgICAgICAgfTtcbiAgICB9O1xuXG4gICAgLy8gbWFyc2hhbFZhbHVlcyBqb2lucyB0d28gdmFsdWVzIGludG8gYSBzaW5nbGUgc3RyaW5nLlxuICAgIC8vIFRoZXkgY2FuIGJlIGRlY29kZWQgYnkgdGhlIHVubWFyc2hhbFZhbHVlcyBmdW5jdGlvbi5cbiAgICBpbnN0YW5jZS5tYXJzaGFsVmFsdWVzID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKGZpcnN0Lmxlbmd0aCkgKyBEZWxpbWl0ZXIgKyBmaXJzdCArIHNlY29uZDtcbiAgICB9O1xuXG4gICAgaW5zdGFuY2UuYnJvd3NlckZpbmdlcnByaW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFNvdXJjZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9jYXJsby9qcXVlcnktYnJvd3Nlci1maW5nZXJwcmludFxuICAgICAgICAvLyBUT0RPOiBJbXByb3ZlIHRoZSBmaW5nZXJwcmludGluZy5cbiAgICAgICAgdmFyIGZpbmdlcnByaW50ID0gW1xuICAgICAgICAgICAgbmF2aWdhdG9yLnVzZXJBZ2VudCxcbiAgICAgICAgICAgICggbmV3IERhdGUoKSApLmdldFRpbWV6b25lT2Zmc2V0KCksXG4gICAgICAgICAgICAhIXdpbmRvdy5zZXNzaW9uU3RvcmFnZSxcbiAgICAgICAgICAgICEhd2luZG93LmxvY2FsU3RvcmFnZSxcbiAgICAgICAgICAgICQubWFwKCBuYXZpZ2F0b3IucGx1Z2lucywgZnVuY3Rpb24ocCkge1xuICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgIHAubmFtZSxcbiAgICAgICAgICAgICAgICBwLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgICQubWFwKCBwLCBmdW5jdGlvbihtdCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgbXQudHlwZSwgbXQuc3VmZml4ZXMgXS5qb2luKFwiflwiKTtcbiAgICAgICAgICAgICAgICB9KS5qb2luKFwiLFwiKVxuICAgICAgICAgICAgICBdLmpvaW4oXCI6OlwiKTtcbiAgICAgICAgICAgIH0pLmpvaW4oXCI7XCIpXG4gICAgICBdLmpvaW4oXCIjIyNcIik7XG5cbiAgICAgIHJldHVybiBTdHJpbmcobXVybXVyaGFzaDNfMzJfZ2MoZmluZ2VycHJpbnQsIDB4ODA4MDgwODApKTtcbiAgICB9O1xuXG4gICAgLy8gQSBjb21wbGV0ZSBjb29raWVzIHJlYWRlci93cml0ZXIgZnJhbWV3b3JrIHdpdGggZnVsbCB1bmljb2RlIHN1cHBvcnQuXG4gICAgLy8gU291cmNlIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL2RvY3VtZW50LmNvb2tpZVxuICAgIGluc3RhbmNlLmNvb2tpZXMgPSB7XG4gICAgICBnZXRJdGVtOiBmdW5jdGlvbiAoc0tleSkge1xuICAgICAgICBpZiAoIXNLZXkpIHsgcmV0dXJuIG51bGw7IH1cbiAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUucmVwbGFjZShuZXcgUmVnRXhwKFwiKD86KD86XnwuKjspXFxcXHMqXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc0tleSkucmVwbGFjZSgvW1xcLVxcLlxcK1xcKl0vZywgXCJcXFxcJCZcIikgKyBcIlxcXFxzKlxcXFw9XFxcXHMqKFteO10qKS4qJCl8Xi4qJFwiKSwgXCIkMVwiKSkgfHwgbnVsbDtcbiAgICAgIH0sXG4gICAgICBzZXRJdGVtOiBmdW5jdGlvbiAoc0tleSwgc1ZhbHVlLCB2RW5kLCBzUGF0aCwgc0RvbWFpbiwgYlNlY3VyZSkge1xuICAgICAgICBpZiAoIXNLZXkgfHwgL14oPzpleHBpcmVzfG1heFxcLWFnZXxwYXRofGRvbWFpbnxzZWN1cmUpJC9pLnRlc3Qoc0tleSkpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICAgIHZhciBzRXhwaXJlcyA9IFwiXCI7XG4gICAgICAgIGlmICh2RW5kKSB7XG4gICAgICAgICAgc3dpdGNoICh2RW5kLmNvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICBjYXNlIE51bWJlcjpcbiAgICAgICAgICAgICAgc0V4cGlyZXMgPSB2RW5kID09PSBJbmZpbml0eSA/IFwiOyBleHBpcmVzPUZyaSwgMzEgRGVjIDk5OTkgMjM6NTk6NTkgR01UXCIgOiBcIjsgbWF4LWFnZT1cIiArIHZFbmQ7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBTdHJpbmc6XG4gICAgICAgICAgICAgIHNFeHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyB2RW5kO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRGF0ZTpcbiAgICAgICAgICAgICAgc0V4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIHZFbmQudG9VVENTdHJpbmcoKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGRvY3VtZW50LmNvb2tpZSA9IGVuY29kZVVSSUNvbXBvbmVudChzS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNWYWx1ZSkgKyBzRXhwaXJlcyArIChzRG9tYWluID8gXCI7IGRvbWFpbj1cIiArIHNEb21haW4gOiBcIlwiKSArIChzUGF0aCA/IFwiOyBwYXRoPVwiICsgc1BhdGggOiBcIlwiKSArIChiU2VjdXJlID8gXCI7IHNlY3VyZVwiIDogXCJcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIHJlbW92ZUl0ZW06IGZ1bmN0aW9uIChzS2V5LCBzUGF0aCwgc0RvbWFpbikge1xuICAgICAgICBpZiAoIXRoaXMuaGFzSXRlbShzS2V5KSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgZG9jdW1lbnQuY29va2llID0gZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpICsgXCI9OyBleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UXCIgKyAoc0RvbWFpbiA/IFwiOyBkb21haW49XCIgKyBzRG9tYWluIDogXCJcIikgKyAoc1BhdGggPyBcIjsgcGF0aD1cIiArIHNQYXRoIDogXCJcIik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIGhhc0l0ZW06IGZ1bmN0aW9uIChzS2V5KSB7XG4gICAgICAgIGlmICghc0tleSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgICAgcmV0dXJuIChuZXcgUmVnRXhwKFwiKD86Xnw7XFxcXHMqKVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNLZXkpLnJlcGxhY2UoL1tcXC1cXC5cXCtcXCpdL2csIFwiXFxcXCQmXCIpICsgXCJcXFxccypcXFxcPVwiKSkudGVzdChkb2N1bWVudC5jb29raWUpO1xuICAgICAgfSxcbiAgICAgIGtleXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFLZXlzID0gZG9jdW1lbnQuY29va2llLnJlcGxhY2UoLygoPzpefFxccyo7KVteXFw9XSspKD89O3wkKXxeXFxzKnxcXHMqKD86XFw9W147XSopPyg/OlxcMXwkKS9nLCBcIlwiKS5zcGxpdCgvXFxzKig/OlxcPVteO10qKT87XFxzKi8pO1xuICAgICAgICBmb3IgKHZhciBuTGVuID0gYUtleXMubGVuZ3RoLCBuSWR4ID0gMDsgbklkeCA8IG5MZW47IG5JZHgrKykgeyBhS2V5c1tuSWR4XSA9IGRlY29kZVVSSUNvbXBvbmVudChhS2V5c1tuSWR4XSk7IH1cbiAgICAgICAgcmV0dXJuIGFLZXlzO1xuICAgICAgfVxuICAgIH07XG5cblxuICAgIHJldHVybiBpbnN0YW5jZTtcbn0pKCk7XG5cbiAgICAvKlxuICogIEJpdE1vbnN0ZXIgLSBBIE1vbnN0ZXIgaGFuZGxpbmcgeW91ciBCaXRzXG4gKiAgQ29weXJpZ2h0IChDKSAyMDE1ICBSb2xhbmQgU2luZ2VyIDxyb2xhbmQuc2luZ2VyW2F0XWRlc2VydGJpdC5jb20+XG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuLypcbiAqICBUaGlzIGNvZGUgbGl2ZXMgaW5zaWRlIHRoZSBCaXRNb25zdGVyIGZ1bmN0aW9uLlxuICovXG5cblxuLy8gQSBsaXN0IG9mIGF2YWlsYWJsZSB0cmFuc2xhdGlvbnMuXG52YXIgdHJhbnNsYXRpb25zID0ge1xuXHRlbjogLypcbiAqICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuICogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbntcblx0c29ja2V0OiB7XG5cdFx0Q29ubkxvc3RUaXRsZTogXCJDb25uZWN0aW9uIExvc3RcIixcblx0XHRDb25uTG9zdFRleHQ6ICBcIlRyeWluZyB0byByZWNvbm5lY3QgdG8gU2VydmVyLi4uXCIsXG5cdFx0RGlzY2FyZE5vdFNlbmREYXRhVGl0bGU6IFwiVW5zZW5kIERhdGFcIixcblx0XHREaXNjYXJkTm90U2VuZERhdGFUZXh0OiBcIk5vdCBhbGwgZGF0YSBtZXNzYWdlcyBjb3VsZCBiZSB0cmFuc21pdHRlZCB0byB0aGUgc2VydmVyIVwiLFxuXHRcdERpc2Nvbm5lY3RlZFRpdGxlOiBcIkRpc2Nvbm5lY3RlZCBmcm9tIFNlcnZlclwiLFxuXHRcdERpc2Nvbm5lY3RlZFRleHQ6IFwiQ2xpY2sgaGVyZSB0byByZWNvbm5lY3QuXCIsXG5cdH0sXG5cdGF1dGg6IHtcblx0XHRGYWlsZWRUaXRsZTogXCJBdXRoZW50aWNhdGlvbiBmYWlsZWRcIixcblx0XHRGYWlsZWRUZXh0OiAgXCJGYWlsZWQgdG8gYXV0aGVudGljYXRlIHRoaXMgc2Vzc2lvbi5cIlxuXHR9XG59XG5cbn07XG5cbi8vIFRoZSBjdXJyZW50IHRyYW5zbGF0aW9uLlxudmFyIHRyID0gdHJhbnNsYXRpb25zWydlbiddO1xuXG4vLyBPYnRhaW4gdGhlIGxvY2FsZS5cbnZhciBsb2NhbGUgPSAobmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5icm93c2VyTGFuZ3VhZ2UpLnNwbGl0KCctJylbMF07XG5cbi8vIFNldCB0byB0aGUgY3VycmVudCBsb2NhbGUuXG5pZiAobG9jYWxlICYmIHRyYW5zbGF0aW9uc1tsb2NhbGVdKSB7XG5cdHRyID0gdHJhbnNsYXRpb25zW2xvY2FsZV07XG59XG5cbiAgICAvKlxuICogIEJpdE1vbnN0ZXIgLSBBIE1vbnN0ZXIgaGFuZGxpbmcgeW91ciBCaXRzXG4gKiAgQ29weXJpZ2h0IChDKSAyMDE1ICBSb2xhbmQgU2luZ2VyIDxyb2xhbmQuc2luZ2VyW2F0XWRlc2VydGJpdC5jb20+XG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBmcmVlIHNvZnR3YXJlOiB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5XG4gKiAgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbiAqICB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBlaXRoZXIgdmVyc2lvbiAzIG9mIHRoZSBMaWNlbnNlLCBvclxuICogIChhdCB5b3VyIG9wdGlvbikgYW55IGxhdGVyIHZlcnNpb24uXG4gKlxuICogIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiAgTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiAgU2VlIHRoZVxuICogIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG4gKiAgYWxvbmcgd2l0aCB0aGlzIHByb2dyYW0uICBJZiBub3QsIHNlZSA8aHR0cDovL3d3dy5nbnUub3JnL2xpY2Vuc2VzLz4uXG4gKi9cblxuLypcbiAqICBUaGlzIGNvZGUgbGl2ZXMgaW5zaWRlIHRoZSBCaXRNb25zdGVyIGZ1bmN0aW9uLlxuICovXG5cblxuYm0ubm90aWZpY2F0aW9uID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAvKlxuICAgICAqIENvbnN0YW50c1xuICAgICAqL1xuXG4gICAgIHZhciBEZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgIHRpdGxlICAgICAgICAgOiBcIlwiLFxuICAgICAgICAgdGV4dCAgICAgICAgICA6IFwiXCIsXG4gICAgICAgICBkZXN0cm95T25DbG9zZTogdHJ1ZSxcbiAgICAgICAgIGhpZGVDbG9zZSAgICAgOiBmYWxzZVxuICAgICB9O1xuXG5cblxuICAgIC8qXG4gICAgICogVmFyaWFibGVzXG4gICAgICovXG5cbiAgICAgdmFyIGlkICAgICAgICAgPSBcImJtLW5vdGlmaWNhdGlvbi1cIiArIHV0aWxzLnJhbmRvbVN0cmluZygxNCksXG4gICAgICAgICB0aW1lb3V0ICAgID0gZmFsc2UsXG4gXHRcdCB3aWRnZXRCb2R5ID0gXHQnPGRpdiBpZD1cIicgKyBpZCArICdcIiBjbGFzcz1cImJtLW5vdGlmaWNhdGlvblwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2PjxiPjwvYj48Yj48L2I+PGI+PC9iPjxiPjwvYj48L2Rpdj4nICtcbiBcdFx0XHRcdFx0XHRcdCc8cD48L3A+JyArXG4gXHRcdFx0XHRcdFx0XHQnPHNwYW4+PC9zcGFuPicgK1xuIFx0XHRcdFx0XHRcdCc8L2Rpdj4nO1xuXG5cblxuICAgIC8qXG4gICAgICogUHJpdmF0ZSBGdW5jdGlvbnNcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIGdldFdpZGdldCgpIHtcbiAgICAgICAgLy8gVHJ5IHRvIG9idGFpbiB0aGUgd2lkZ2V0IG9iamVjdC5cbiAgICAgICAgdmFyIHdpZGdldCA9ICQoJyMnICsgaWQpO1xuXG4gICAgICAgIC8vIFJldHVybiBpdCBpZiBpdCBleGlzdHMuXG4gICAgICAgIGlmICh3aWRnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ3JlYXRlIGl0IGFuZCBwcmVwZW5kIGl0IHRvIHRoZSBkb2N1bWVudCBib2R5LlxuICAgICAgICB3aWRnZXQgPSAkKHdpZGdldEJvZHkpO1xuICAgICAgICAkKCdib2R5JykucHJlcGVuZCh3aWRnZXQpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLmhpZGVDbG9zZSkge1xuICAgICAgICAgICAgJCgnIycgKyBpZCArICcgPiBkaXYnKS5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIEJpbmQgY2xvc2UgZXZlbnRzLlxuICAgICAgICAgICAgJCgnIycgKyBpZCArICcgPiBkaXYnKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucy5kZXN0cm95T25DbG9zZSkge1xuICAgICAgICAgICAgICAgICAgICBkZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd2lkZ2V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRpdGxlKHN0cikge1xuICAgICAgICBnZXRXaWRnZXQoKS5maW5kKFwicFwiKS50ZXh0KHN0cik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VGV4dChzdHIpIHtcbiAgICAgICAgZ2V0V2lkZ2V0KCkuZmluZChcInNwYW5cIikudGV4dChzdHIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0b3BUaW1lb3V0KCkge1xuICAgICAgICAvLyBTdG9wIHRoZSB0aW1lb3V0LlxuICAgICAgICBpZiAodGltZW91dCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE9wdGlvbmFsbHkgcGFzcyBhIGR1cmF0aW9uIHdoaWNoIGhpZGVzIHRoZSB3aWRnZXQgYWdhaW4uXG4gICAgZnVuY3Rpb24gc2hvdyhkdXJhdGlvbikge1xuICAgICAgICAvLyBHZXQgdGhlIHdpZGdldC5cbiAgICAgICAgdmFyIHdpZGdldCA9IGdldFdpZGdldCgpO1xuXG4gICAgICAgIC8vIFN0b3AgdGhlIHRpbWVvdXQuXG4gICAgICAgIHN0b3BUaW1lb3V0KCk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBjbGFzc2VzIGlmIHByZXNlbnQuXG4gICAgICAgIHdpZGdldC5yZW1vdmVDbGFzcygnaGlkZScpO1xuICAgICAgICB3aWRnZXQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcblxuICAgICAgICAvLyBTaG93IGl0IGJ5IGFkZGluZyB0aGUgc2hvdyBjbGFzcy5cbiAgICAgICAgd2lkZ2V0LmFkZENsYXNzKCdzaG93Jyk7XG5cbiAgICAgICAgLy8gSGlkZSBhZ2FpbiBhZnRlciBhIHRpbWVvdXQgZHVyYXRpb24gaWYgZGVmaW5lZC5cbiAgICAgICAgaWYgKGR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGhpZGUoKTtcbiAgICAgICAgICAgIH0sIGR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgICAgIC8vIEdldCB0aGUgd2lkZ2V0LlxuICAgICAgICB2YXIgd2lkZ2V0ID0gZ2V0V2lkZ2V0KCk7XG5cbiAgICAgICAgLy8gU3RvcCB0aGUgdGltZW91dC5cbiAgICAgICAgc3RvcFRpbWVvdXQoKTtcblxuICAgICAgICAvLyBIaWRlIGl0IGJ5IHJlbW92aW5nIHRoZSBjbGFzcy5cbiAgICAgICAgd2lkZ2V0LmFkZENsYXNzKCdoaWRlJyk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBjbGFzc2VzIGFmdGVyIGEgc2hvcnQgZHVyYXRpb24uXG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGltZW91dCA9IGZhbHNlO1xuICAgICAgICAgICAgd2lkZ2V0LnJlbW92ZUNsYXNzKCdoaWRlJyk7XG4gICAgICAgICAgICB3aWRnZXQucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICAgICAgLy8gR2V0IHRoZSB3aWRnZXQuXG4gICAgICAgIHZhciB3aWRnZXQgPSBnZXRXaWRnZXQoKTtcblxuICAgICAgICAvLyBTdG9wIHRoZSB0aW1lb3V0LlxuICAgICAgICBzdG9wVGltZW91dCgpO1xuXG4gICAgICAgIC8vIEhpZGUgaXQgYnkgcmVtb3ZpbmcgdGhlIGNsYXNzLlxuICAgICAgICB3aWRnZXQuYWRkQ2xhc3MoJ2hpZGUnKTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIG9iamVjdCBhZnRlciBhIHNob3J0IGR1cmF0aW9uLlxuICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHdpZGdldC5yZW1vdmUoKTtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgfVxuXG5cblxuICAgIC8qXG4gICAgICogSW5pdGlhbGl6YXRpb25cbiAgICAgKi9cblxuICAgIC8vIE1lcmdlIHRoZSBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHQgb3B0aW9ucy5cbiAgICBvcHRpb25zID0gJC5leHRlbmQoRGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgLy8gVGhpcyBjYWxsIGNyZWF0ZXMgdGhlIHdpZGdldCBvbmNlLlxuICAgIGdldFdpZGdldCgpO1xuXG4gICAgLy8gU2V0IHRoZSBkZWZhdWx0IHRpdGxlIGFuZCB0ZXh0LlxuICAgIHNldFRpdGxlKG9wdGlvbnMudGl0bGUpO1xuICAgIHNldFRleHQob3B0aW9ucy50ZXh0KTtcblxuXG5cbiAgICAvLyBSZXR1cm4gdGhlIHB1YmxpYyBvYmplY3QuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc2V0VGl0bGU6IHNldFRpdGxlLFxuICAgICAgICBzZXRUZXh0IDogc2V0VGV4dCxcbiAgICAgICAgc2hvdyAgICA6IHNob3csXG4gICAgICAgIGhpZGUgICAgOiBoaWRlLFxuICAgICAgICBkZXN0cm95IDogZGVzdHJveSxcblxuICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICBnZXRXaWRnZXQoKS5hZGRDbGFzcygnYm0tY2xpY2thYmxlJykub24oJ2NsaWNrJywgZik7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuICAgIC8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG4vKlxuICogIFRoaXMgY29kZSBsaXZlcyBpbnNpZGUgdGhlIEJpdE1vbnN0ZXIgZnVuY3Rpb24uXG4gKi9cblxuXG52YXIgY29ubmxvc3QgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qXG4gICAgICogVmFyaWFibGVzXG4gICAgICovXG5cblx0dmFyIGluc3RhbmNlID0ge30sIC8vIE91ciBwdWJsaWMgaW5zdGFuY2Ugb2JqZWN0IHJldHVybmVkIGJ5IHRoaXMgZnVuY3Rpb24uXG5cdFx0dGltZW91dCA9IGZhbHNlO1xuXG5cdHZhciBub3RpZnkgPSBibS5ub3RpZmljYXRpb24oe1xuXHRcdHRpdGxlOiB0ci5zb2NrZXQuQ29ubkxvc3RUaXRsZSxcblx0XHR0ZXh0OiB0ci5zb2NrZXQuQ29ubkxvc3RUZXh0LFxuXHRcdGRlc3Ryb3lPbkNsb3NlOiBmYWxzZSxcblx0XHRoaWRlQ2xvc2U6IHRydWVcblx0fSk7XG5cblxuXG5cbiAgICAvKlxuICAgICAqIFB1YmxpYyBNZXRob2RzXG4gICAgICovXG5cbiAgICBpbnN0YW5jZS5zaG93ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRpbWVvdXQgIT09IGZhbHNlKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHR0aW1lb3V0ID0gZmFsc2U7XG5cdFx0XHRub3RpZnkuc2hvdygpO1xuXHRcdH0sIDE1MDApO1xuICAgIH07XG5cblx0aW5zdGFuY2UuaGlkZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aW1lb3V0ICE9PSBmYWxzZSkge1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0dGltZW91dCA9IGZhbHNlO1xuXHRcdH1cblxuXHRcdG5vdGlmeS5oaWRlKCk7XG5cdH07XG5cblxuXHRyZXR1cm4gaW5zdGFuY2U7XG59KSgpO1xuXG4gICAgLypcbiAqICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuICogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cblxuLypcbiAqICBUaGlzIGNvZGUgbGl2ZXMgaW5zaWRlIHRoZSBCaXRNb25zdGVyIGZ1bmN0aW9uLlxuICovXG5cbmJtLnNjb3BlID0gKGZ1bmN0aW9uKCkge1xuICAgIC8qXG4gICAgICogVmFyaWFibGVzXG4gICAgICovXG5cbiAgICAvLyBBIG1hcCBob2xkaW5nIHRoZSBzY29wZXMuXG4gICAgdmFyIHNjb3BlTWFwID0ge307XG5cbiAgICAvKlxuICAgICAqIFJldHVybiB0aGUgYWN0dWFsIG1vZHVsZSBmdW5jdGlvbi5cbiAgICAgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgLy8gVGhlIG1vZHVsZSBuYW1lIGhhcyB0byBiZSBkZWZpbmVkLlxuICAgICAgICBpZiAoIXNjb3BlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IGludmFsaWQgc2NvcGUgY2FsbDogc2NvcGU9J1wiICsgc2NvcGUgKyBcIidcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPYnRhaW4gdGhlIHNjb3BlIG9iamVjdC5cbiAgICAgICAgdmFyIHMgPSBzY29wZU1hcFtzY29wZV07XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBzY29wZSBpZiBpdCBkb2VzIG5vdCBleGlzdHMuXG4gICAgICAgIGlmICghcykge1xuICAgICAgICAgICAgcyA9IHtcbiAgICAgICAgICAgICAgICBldmVudHM6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIG5ldyBwYXNzZWQgZXZlbnRzIHRvIHRoZSBzY29wZS5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGFzc2VkIGFyZ3VtZW50IGlzIG9mIHR5cGUgZXZlbnQgd2l0aFxuICAgICAgICAgICAgLy8gdGhlIG9mZiBmdW5jdGlvbi5cbiAgICAgICAgICAgIGlmICghJC5pc0Z1bmN0aW9uKGUub2ZmKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogaW52YWxpZCBzY29wZSBjYWxsOiBwYXNzZWQgaW52YWxpZCBhcmd1bWVudDogc2tpcHBpbmcgYXJndW1lbnQuLi5cIik7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHMuZXZlbnRzLnB1c2goZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBVcGRhdGUvYWRkIHRoZSBzY29wZSB0byB0aGUgbWFwLlxuICAgICAgICBzY29wZU1hcFtzY29wZV0gPSBzO1xuXG4gICAgICAgIC8vIFJldHVybiB0aGUgbW9kdWxlIG9iamVjdCB3aXRoIHRoZSBtb2R1bGUgbWV0aG9kcy5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC8vIFVuYmluZCBhbGwgZXZlbnRzIGluIHRoZSBzY29wZS5cbiAgICAgICAgICAgIG9mZjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgb2ZmIG1ldGhvZCBmb3IgYWxsIGV2ZW50cyBpbiB0aGUgc2NvcGUuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBzLmV2ZW50c1tpXS5vZmYoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIHNjb3BlIGZyb20gdGhlIG1hcC5cbiAgICAgICAgICAgICAgICBkZWxldGUgc2NvcGVNYXBbc2NvcGVdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH07XG59KSgpO1xuXG4gICAgLypcbiAqICBCaXRNb25zdGVyIC0gQSBNb25zdGVyIGhhbmRsaW5nIHlvdXIgQml0c1xuICogIENvcHlyaWdodCAoQykgMjAxNSAgUm9sYW5kIFNpbmdlciA8cm9sYW5kLnNpbmdlclthdF1kZXNlcnRiaXQuY29tPlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuICogIGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYXMgcHVibGlzaGVkIGJ5XG4gKiAgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgZWl0aGVyIHZlcnNpb24gMyBvZiB0aGUgTGljZW5zZSwgb3JcbiAqICAoYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuICpcbiAqICBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqICBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gIFNlZSB0aGVcbiAqICBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqICBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZVxuICogIGFsb25nIHdpdGggdGhpcyBwcm9ncmFtLiAgSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuICovXG5cbi8qXG4gKiAgVGhpcyBjb2RlIGxpdmVzIGluc2lkZSB0aGUgQml0TW9uc3RlciBmdW5jdGlvbi5cbiAqL1xuXG5cbnZhciBzb2NrZXQgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8qXG4gICAgICogU29ja2V0IEluaXRpYWxpemF0aW9uXG4gICAgICovXG5cblx0Ly8gQ3JlYXRlIHRoZSBnbHVlIHNvY2tldCBhbmQgY29ubmVjdCB0byB0aGUgc2VydmVyLlxuICAgIC8vIE9wdGlvbmFsIHBhc3MgYSBob3N0IHN0cmluZy4gVGhpcyBob3N0IHN0cmluZyBpcyBkZWZpbmVkIGluIHRoZSBtYWluIEJpdE1vbnN0ZXIgZmlsZS5cbiAgICB2YXIgc29ja2V0ID0gZ2x1ZShob3N0LCB7XG4gICAgICAgIGJhc2VVUkw6IFwiL2JpdG1vbnN0ZXIvXCJcbiAgICB9KTtcbiAgICBpZiAoIXNvY2tldCkge1xuICAgIFx0Y29uc29sZS5sb2coXCJCaXRNb25zdGVyOiBmYWlsZWQgdG8gaW5pdGlhbGl6ZSBzb2NrZXQhXCIpO1xuICAgIFx0cmV0dXJuO1xuICAgIH1cblxuICAgIHNvY2tldC5vbihcImNvbm5lY3RlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29ubmxvc3QuaGlkZSgpO1xuICAgIH0pO1xuXG4gICAgc29ja2V0Lm9uKFwiY29ubmVjdGluZ1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgY29ubmxvc3Quc2hvdygpO1xuICAgIH0pO1xuXG4gICAgc29ja2V0Lm9uKFwicmVjb25uZWN0aW5nXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25ubG9zdC5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oXCJkaXNjb25uZWN0ZWRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbm5sb3N0LmhpZGUoKTtcblxuICAgICAgICB2YXIgbm90aWZ5ID0gYm0ubm90aWZpY2F0aW9uKHtcbiAgICAgICAgICAgIHRpdGxlOiB0ci5zb2NrZXQuRGlzY29ubmVjdGVkVGl0bGUsXG4gICAgICAgICAgICB0ZXh0OiB0ci5zb2NrZXQuRGlzY29ubmVjdGVkVGV4dCxcbiAgICAgICAgICAgIGhpZGVDbG9zZTogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICBub3RpZnkub25DbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIG5vdGlmeS5kZXN0cm95KCk7XG4gICAgICAgICAgICBzb2NrZXQucmVjb25uZWN0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5vdGlmeS5zaG93KCk7XG4gICAgfSk7XG5cbiAgICBzb2NrZXQub24oXCJlcnJvclwiLCBmdW5jdGlvbihlLCBtc2cpIHtcbiAgICAgICAgLy8gSnVzdCBsb2cgdGhlIGVycm9yLlxuICAgICAgICBjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IHNvY2tldCBlcnJvcjogXCIgKyBtc2cpO1xuICAgIH0pO1xuXG4gICAgc29ja2V0Lm9uKFwiZGlzY2FyZF9zZW5kX2J1ZmZlclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYm0ubm90aWZpY2F0aW9uKHtcbiAgICBcdFx0dGl0bGU6IHRyLnNvY2tldC5EaXNjYXJkTm90U2VuZERhdGFUaXRsZSxcbiAgICBcdFx0dGV4dDogdHIuc29ja2V0LkRpc2NhcmROb3RTZW5kRGF0YVRleHRcbiAgICBcdH0pLnNob3coKTtcbiAgICB9KTtcblxuXG4gICAgLy8gUmV0dXJuIHRoZSBuZXdseSBjcmVhdGVkIHNvY2tldC5cbiAgICByZXR1cm4gc29ja2V0O1xufSkoKTtcblxuICAgIC8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5cbi8qXG4gKiAgVGhpcyBjb2RlIGxpdmVzIGluc2lkZSB0aGUgQml0TW9uc3RlciBmdW5jdGlvbi5cbiAqL1xuXG5ibS5tb2R1bGUgPSAoZnVuY3Rpb24oKSB7XG4gICAgLypcbiAgICAgKiBDb25zdGFudHNcbiAgICAgKi9cblxuICAgIHZhciBjYWxsYmFja0lETGVuZ3RoICAgICAgPSAxNCxcbiAgICAgICAgZXZlbnRMaXN0ZW5lcklETGVuZ3RoID0gMTAsXG4gICAgICAgIG1ldGhvZENhbGxUaW1lb3V0ICAgICA9IDEyMDAwOyAvLyAxMiBzZWNvbmRzXG5cblxuXG4gICAgLypcbiAgICAgKiBWYXJpYWJsZXNcbiAgICAgKi9cblxuICAgICAvLyBPYnRhaW4gdGhlIHNvY2tldCBjb21tdW5pY2F0aW9uIGNoYW5uZWxzLlxuICAgICB2YXIgY2FsbENoYW5uZWwgICAgPSBzb2NrZXQuY2hhbm5lbChcImNhbGxcIiksXG4gICAgICAgICBldmVudENoYW5uZWwgICA9IHNvY2tldC5jaGFubmVsKFwiZXZlbnRcIik7XG5cbiAgICAgLy8gQSBtYXAgaG9sZGluZyBhbGwgY2FsbGJhY2tzIGFuZCBldmVudHMuXG4gICAgIHZhciBjYWxsYmFja3NNYXAgICA9IHt9LFxuICAgICAgICAgZXZlbnRzTWFwICAgICAgPSB7fTtcblxuXG5cbiAgICAgLypcbiAgICAgICogSW5pdGlhbGl6YXRpb25cbiAgICAgICovXG5cbiAgICAgLy8gSGFuZGxlIHJlY2VpdmVkIG1lc3NhZ2VzIGZyb20gdGhlIGNhbGwgY2hhbm5lbC5cbiAgICAgY2FsbENoYW5uZWwub25NZXNzYWdlKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgIC8vIERlZmluZSBhIG1ldGhvZCB0byBwcmludCBlcnJvciBtZXNzYWdlcy5cbiAgICAgICAgIHZhciBsb2dFcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogcmVjZWl2ZWQgaW52YWxpZCBjYWxsIHJlcXVlc3QgZnJvbSBzZXJ2ZXIuXCIpO1xuICAgICAgICAgfTtcblxuICAgICAgICAgLy8gUGFyc2UgdGhlIEpTT04gdG8gYW4gb2JqZWN0LlxuICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG5cbiAgICAgICAgIC8vIFRoZSBjYWxsYmFjayBJRCBoYXMgdG8gYmUgYWx3YXlzIGRlZmluZWQuXG4gICAgICAgICBpZiAoIWRhdGEuY2FsbGJhY2tJRCB8fCBTdHJpbmcoZGF0YS5jYWxsYmFja0lEKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICBsb2dFcnJvcigpO1xuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gT2J0YWluIHRoZSBjYWxsYmFjayBvYmplY3QuXG4gICAgICAgICB2YXIgY2IgPSBjYWxsYmFja3NNYXBbZGF0YS5jYWxsYmFja0lEXTtcbiAgICAgICAgIGlmICghY2IpIHtcbiAgICAgICAgICAgICBsb2dFcnJvcigpO1xuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gUmVtb3ZlIHRoZSBjYWxsYmFjayBvYmplY3QgZnJvbSB0aGUgbWFwLlxuICAgICAgICAgZGVsZXRlIGNhbGxiYWNrc01hcFtkYXRhLmNhbGxiYWNrSURdO1xuXG4gICAgICAgICAvLyBTdG9wIHRoZSB0aW1lb3V0LlxuICAgICAgICAgaWYgKGNiLnRpbWVvdXQpIHtcbiAgICAgICAgICAgICBjbGVhclRpbWVvdXQoY2IudGltZW91dCk7XG4gICAgICAgICAgICAgY2IudGltZW91dCA9IGZhbHNlO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLyBEZXRlcm1pbmQgdGhlIHJlcXVlc3QgdHlwZSBhbmQgY2FsbCB0aGUgY2FsbGJhY2suXG4gICAgICAgICBpZiAoZGF0YS50eXBlID09PSBcImNsZWFudXBcIikge1xuICAgICAgICAgICAgIC8vIEp1c3QgcmV0dXJuLiBUaGUgY2FsbGJhY2sgb2JqZWN0IHdhcyBhbHJlYWR5IHJlbW92ZWQgZnJvbSB0aGUgbWFwLlxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIH1cbiAgICAgICAgIGVsc2UgaWYgKGRhdGEudHlwZSA9PT0gXCJzdWNjZXNzXCIgJiYgY2Iuc3VjY2Vzcykge1xuICAgICAgICAgICAgIHV0aWxzLmNhbGxDYXRjaChjYi5zdWNjZXNzLCBkYXRhLmRhdGEpO1xuICAgICAgICAgfVxuICAgICAgICAgZWxzZSBpZiAoZGF0YS50eXBlID09PSBcImVycm9yXCIgJiYgY2IuZXJyb3IpIHtcbiAgICAgICAgICAgICB1dGlscy5jYWxsQ2F0Y2goY2IuZXJyb3IsIGRhdGEubWVzc2FnZSk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICBsb2dFcnJvcigpO1xuICAgICAgICAgfVxuICAgICB9KTtcblxuICAgICAvLyBIYW5kbGUgcmVjZWl2ZWQgbWVzc2FnZXMgZnJvbSB0aGUgZXZlbnQgY2hhbm5lbC5cbiAgICAgZXZlbnRDaGFubmVsLm9uTWVzc2FnZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAvLyBEZWZpbmUgYSBtZXRob2QgdG8gcHJpbnQgZXJyb3IgbWVzc2FnZXMuXG4gICAgICAgICB2YXIgbG9nRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IHJlY2VpdmVkIGludmFsaWQgZXZlbnQgcmVxdWVzdCBmcm9tIHNlcnZlci5cIik7XG4gICAgICAgICB9O1xuXG4gICAgICAgICAvLyBQYXJzZSB0aGUgSlNPTiB0byBhbiBvYmplY3QuXG4gICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShkYXRhKTtcblxuICAgICAgICAgLy8gQ2hlY2sgZm9yIHRoZSByZXF1aXJlZCB2YWx1ZXMuXG4gICAgICAgICBpZiAoIWRhdGEubW9kdWxlIHx8ICFkYXRhLmV2ZW50KSB7XG4gICAgICAgICAgICAgbG9nRXJyb3IoKTtcbiAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICB9XG5cbiAgICAgICAgIC8vIE9idGFpbiB0aGUgbW9kdWxlIGV2ZW50cy5cbiAgICAgICAgIHZhciBtb2R1bGVFdmVudHMgPSBldmVudHNNYXBbZGF0YS5tb2R1bGVdO1xuICAgICAgICAgaWYgKCFtb2R1bGVFdmVudHMpIHtcbiAgICAgICAgICAgICAvLyBEb24ndCBsb2cgdGhlIGVycm9yLiBUaGUgZXZlbnQgd2FzIHVuYm91bmQuXG4gICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgfVxuXG4gICAgICAgICAvLyBHZXQgdGhlIGV2ZW50IG9iamVjdC5cbiAgICAgICAgIHZhciBldmVudE9iaiA9IG1vZHVsZUV2ZW50cy5ldmVudHNbZGF0YS5ldmVudF07XG4gICAgICAgICBpZiAoIWV2ZW50T2JqKSB7XG4gICAgICAgICAgICAgLy8gRG9uJ3QgbG9nIHRoZSBlcnJvci4gVGhlIGV2ZW50IHdhcyB1bmJvdW5kLlxuICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgIH1cblxuICAgICAgICAgLy8gRGV0ZXJtaW5kIHRoZSBldmVudCB0eXBlLlxuICAgICAgICAgaWYgKGRhdGEudHlwZSA9PT0gXCJ0cmlnZ2VyXCIpIHtcbiAgICAgICAgICAgICAvLyBQYXJzZSB0aGUgSlNPTiBkYXRhIHZhbHVlIGlmIHByZXNlbnQuXG4gICAgICAgICAgICAgdmFyIGV2ZW50RGF0YTtcbiAgICAgICAgICAgICBpZiAoZGF0YS5kYXRhKSB7XG4gICAgICAgICAgICAgICAgIGV2ZW50RGF0YSA9IEpTT04ucGFyc2UoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAvLyBDcmVhdGUgYSBzaGFsbG93IGNvcHkgdG8gYWxsb3cgbXV0YXRpb25zIGluc2lkZSB0aGUgaXRlcmF0aW9uLlxuICAgICAgICAgICAgIHZhciBsaXN0ZW5lcnMgPSBqUXVlcnkuZXh0ZW5kKHt9LCBldmVudE9iai5saXN0ZW5lcnMpO1xuXG4gICAgICAgICAgICAgLy8gVHJpZ2dlciB0aGUgbGlzdGVuZXJzIGJvdW5kIHRvIHRoaXMgZXZlbnQuXG4gICAgICAgICAgICAgJC5lYWNoKGxpc3RlbmVycywgZnVuY3Rpb24oaWQsIGwpIHtcbiAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgIGwuY2FsbGJhY2soZXZlbnREYXRhKTtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJCaXRNb25zdGVyOiBjYXRjaGVkIGV4Y2VwdGlvbiB3aGlsZSB0cmlnZ2VyaW5nIGV2ZW50OlwiKTtcbiAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgfSk7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICBsb2dFcnJvcigpO1xuICAgICAgICAgfVxuICAgICB9KTtcblxuXG5cbiAgICAvKlxuICAgICAqIFByaXZhdGVcbiAgICAgKi9cblxuICAgIC8vIGNhbGwgYSBtb2R1bGUgbWV0aG9kIG9uIHRoZSBzZXJ2ZXItc2lkZS5cbiAgICB2YXIgY2FsbE1ldGhvZCA9IGZ1bmN0aW9uKG1vZHVsZSwgbWV0aG9kKSB7XG4gICAgICAgIHZhciBwYXJhbXMgICAgICAgICAgPSBmYWxzZSxcbiAgICAgICAgICAgIHN1Y2Nlc3NDYWxsYmFjayA9IGZhbHNlLFxuICAgICAgICAgICAgZXJyb3JDYWxsYmFjayAgID0gZmFsc2U7XG5cbiAgICAgICAgLy8gRGVmaW5lIGEgbWV0aG9kIHRvIHByaW50IGVycm9yIG1lc3NhZ2VzLlxuICAgICAgICB2YXIgbG9nRXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogaW52YWxpZCBtZXRob2QgY2FsbDogbW9kdWxlPSdcIiArIG1vZHVsZSArIFwiJyBtZXRob2Q9J1wiICsgbWV0aG9kICsgXCInXCIpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRoZSBtZXRob2QgbmFtZSBoYXMgdG8gYmUgZGVmaW5lZC5cbiAgICAgICAgaWYgKCFtZXRob2QpIHtcbiAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQYXJzZSB0aGUgZnVuY3Rpb24gYXJndW1lbnRzLlxuICAgICAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBhcmd1bWVudCBpcyB0aGUgcGFyYW1ldGVyIG9iamVjdC5cbiAgICAgICAgICAgIGlmIChhcmcgIT09IG51bGwgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBhbHJlYWR5IHNldC5cbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBwYXJhbWV0ZXIgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IGFyZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoaXMgYXJndW1lbnQgaXMgYSBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAgICAgIGVsc2UgaWYgKCQuaXNGdW5jdGlvbihhcmcpKSB7XG4gICAgICAgICAgICAgICAgLy8gU2V0IHRoZSBzdWNjZXNzIGNhbGxiYWNrIGlmIG5vdCBhbHJlYWR5IHNldC5cbiAgICAgICAgICAgICAgICBpZiAoc3VjY2Vzc0NhbGxiYWNrID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ2FsbGJhY2sgPSBhcmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgZXJyb3IgY2FsbGJhY2sgaWYgbm90IGFscmVhZHkgc2V0LlxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGVycm9yQ2FsbGJhY2sgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2sgPSBhcmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFRvbyBtYW55IGZ1bmN0aW9ucyBwYXNzZWQgdG8gdGhpcyBtZXRob2QuIEhhbmRsZSB0aGUgZXJyb3IuXG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBIYW5kbGUgdW5rbm93biB0eXBlcy5cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxvZ0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gTWFyc2hhbCB0aGUgcGFyYW1ldGVyIG9iamVjdCB0byBKU09OLlxuICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gSnVzdCBzZXQgYW4gZW1wdHkgc3RyaW5nLlxuICAgICAgICAgICAgcGFyYW1zID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgY2FsbCBvcHRpb25zLlxuICAgICAgICB2YXIgb3B0cyA9IHtcbiAgICAgICAgICAgIG1vZHVsZTogbW9kdWxlLFxuICAgICAgICAgICAgbWV0aG9kOiBtZXRob2RcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZWdpc3RlciB0aGUgY2FsbGJhY2tzIGlmIGRlZmluZWQuXG4gICAgICAgIGlmIChzdWNjZXNzQ2FsbGJhY2sgIT09IGZhbHNlIHx8IGVycm9yQ2FsbGJhY2sgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBDcmVhdGUgYSByYW5kb20gY2FsbGJhY2tzIElEIGFuZCBjaGVjayBpZiBpdCBkb2VzIG5vdCBleGlzdCBhbHJlYWR5LlxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrSUQ7XG4gICAgICAgICAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tJRCA9IHV0aWxzLnJhbmRvbVN0cmluZyhjYWxsYmFja0lETGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbGxiYWNrc01hcFtjYWxsYmFja0lEXSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIG5ldyBjYWxsYmFja3MgbWFwIGl0ZW0uXG4gICAgICAgICAgICB2YXIgY2IgPSB7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogICAgc3VjY2Vzc0NhbGxiYWNrLFxuICAgICAgICAgICAgICAgIGVycm9yOiAgICAgIGVycm9yQ2FsbGJhY2tcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBhIHRpbWVvdXQuXG4gICAgICAgICAgICBjYi50aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjYi50aW1lb3V0ID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgdGhlIGNhbGxiYWNrIG9iamVjdCBhZ2FpbiBmcm9tIHRoZSBtYXAuXG4gICAgICAgICAgICAgICAgZGVsZXRlIGNhbGxiYWNrc01hcFtjYWxsYmFja0lEXTtcblxuICAgICAgICAgICAgICAgIC8vIFRyaWdnZXIgdGhlIGVycm9yIGNhbGxiYWNrIGlmIGRlZmluZWQuXG4gICAgICAgICAgICAgICAgaWYgKGNiLmVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiLmVycm9yKFwibWV0aG9kIGNhbGwgdGltZW91dDogbm8gc2VydmVyIHJlc3BvbnNlIHJlY2VpdmVkIHdpdGhpbiB0aGUgdGltZW91dFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBtZXRob2RDYWxsVGltZW91dCk7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgY2FsbGJhY2tzIHdpdGggdGhlIElEIHRvIHRoZSBjYWxsYmFja3MgbWFwLlxuICAgICAgICAgICAgY2FsbGJhY2tzTWFwW2NhbGxiYWNrSURdID0gY2I7XG5cbiAgICAgICAgICAgIC8vIEFkZCB0aGUgY2FsbGJhY2tzIElEIHRvIHRoZSBvcHRpb25zLlxuICAgICAgICAgICAgb3B0cy5jYWxsYmFja0lEID0gY2FsbGJhY2tJRDtcblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBvcHRpb24gY2FsbGJhY2sgZmxhZ3MgaWYgdGhlIGNhbGxiYWNrcyBhcmUgZGVmaW5lZC5cbiAgICAgICAgICAgIG9wdHMuY2FsbGJhY2tTdWNjZXNzID0gKHN1Y2Nlc3NDYWxsYmFjayAhPT0gZmFsc2UpO1xuICAgICAgICAgICAgb3B0cy5jYWxsYmFja0Vycm9yID0gKGVycm9yQ2FsbGJhY2sgIT09IGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1hcnNoYWwgdGhlIG9wdGlvbnMgdG8gSlNPTi5cbiAgICAgICAgb3B0cyA9IEpTT04uc3RyaW5naWZ5KG9wdHMpO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIHNlcnZlciBmdW5jdGlvbi5cbiAgICAgICAgY2FsbENoYW5uZWwuc2VuZCh1dGlscy5tYXJzaGFsVmFsdWVzKG9wdHMsIHBhcmFtcykpO1xuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICAvLyBVbmJpbmQgYW4gZXZlbnQuXG4gICAgdmFyIG9mZkV2ZW50ID0gZnVuY3Rpb24obW9kdWxlLCBldmVudCwgaWQpIHtcbiAgICAgICAgLy8gT2J0YWluIHRoZSBtb2R1bGUgZXZlbnRzLlxuICAgICAgICB2YXIgbW9kdWxlRXZlbnRzID0gZXZlbnRzTWFwW21vZHVsZV07XG4gICAgICAgIGlmICghbW9kdWxlRXZlbnRzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZXQgdGhlIGV2ZW50IG9iamVjdC5cbiAgICAgICAgdmFyIGV2ZW50T2JqID0gbW9kdWxlRXZlbnRzLmV2ZW50c1tldmVudF07XG4gICAgICAgIGlmICghZXZlbnRPYmopIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgZXZlbnQgbGlzdGVuZXIgYWdhaW4gZnJvbSB0aGUgbWFwLlxuICAgICAgICBkZWxldGUgZXZlbnRPYmoubGlzdGVuZXJzW2lkXTtcblxuICAgICAgICAvLyBVbmJpbmQgdGhlIHNlcnZlciBldmVudCBpZiB0aGVyZSBhcmUgbm8gbW9yZSBsaXN0ZW5lcnMuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhldmVudE9iai5saXN0ZW5lcnMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSB0aGUgZXZlbnQgb2JqZWN0IGZyb20gdGhlIG1vZHVsZSBldmVudHMuXG4gICAgICAgIGRlbGV0ZSBtb2R1bGVFdmVudHMuZXZlbnRzW2V2ZW50XTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGV2ZW50IG9wdGlvbnMuXG4gICAgICAgIHZhciBvcHRzID0ge1xuICAgICAgICAgICAgdHlwZSAgIDogXCJvZmZcIixcbiAgICAgICAgICAgIG1vZHVsZSA6IG1vZHVsZSxcbiAgICAgICAgICAgIGV2ZW50ICA6IGV2ZW50XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFyc2hhbCB0aGUgb3B0aW9ucyB0byBKU09OLlxuICAgICAgICBvcHRzID0gSlNPTi5zdHJpbmdpZnkob3B0cyk7XG5cbiAgICAgICAgLy8gQ2FsbCB0aGUgc2VydmVyIGZ1bmN0aW9uIHRvIHVuYmluZCB0aGUgZXZlbnQuXG4gICAgICAgIGV2ZW50Q2hhbm5lbC5zZW5kKG9wdHMpO1xuICAgIH07XG5cbiAgICB2YXIgc2VuZEJpbmRFdmVudFJlcXVlc3QgPSBmdW5jdGlvbihtb2R1bGUsIGV2ZW50KSB7XG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZXZlbnQgb3B0aW9ucy5cbiAgICAgICAgdmFyIG9wdHMgPSB7XG4gICAgICAgICAgICB0eXBlICAgOiBcIm9uXCIsXG4gICAgICAgICAgICBtb2R1bGUgOiBtb2R1bGUsXG4gICAgICAgICAgICBldmVudCAgOiBldmVudFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1hcnNoYWwgdGhlIG9wdGlvbnMgdG8gSlNPTi5cbiAgICAgICAgb3B0cyA9IEpTT04uc3RyaW5naWZ5KG9wdHMpO1xuXG4gICAgICAgIC8vIENhbGwgdGhlIHNlcnZlciBmdW5jdGlvbiB0byBiaW5kIHRoZSBldmVudC5cbiAgICAgICAgZXZlbnRDaGFubmVsLnNlbmQob3B0cyk7XG4gICAgfTtcblxuICAgIC8vIExpc3RlbnMgb24gdGhlIHNwZWNpZmljIHNlcnZlci1zaWRlIGV2ZW50IGFuZCB0cmlnZ2VycyB0aGUgY2FsbGJhY2suXG4gICAgdmFyIG9uRXZlbnQgPSBmdW5jdGlvbihtb2R1bGUsIGV2ZW50LCBjYWxsYmFjaykge1xuICAgICAgICAvLyBPYnRhaW4gdGhlIG1vZHVsZSBldmVudHMgb3IgY3JlYXRlIHRoZW0gaWYgdGhleSBkb24ndCBleGlzdC5cbiAgICAgICAgdmFyIG1vZHVsZUV2ZW50cyA9IGV2ZW50c01hcFttb2R1bGVdO1xuICAgICAgICBpZiAoIW1vZHVsZUV2ZW50cykge1xuICAgICAgICAgICAgbW9kdWxlRXZlbnRzID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50czoge31cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBldmVudHNNYXBbbW9kdWxlXSA9IG1vZHVsZUV2ZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCB0aGUgZXZlbnQgb2JqZWN0IG9yIGNyZWF0ZSBpdCBpZiBpdCBkb2VzIG5vdCBleGlzdHMuXG4gICAgICAgIHZhciBldmVudE9iaiA9IG1vZHVsZUV2ZW50cy5ldmVudHNbZXZlbnRdO1xuICAgICAgICBpZiAoIWV2ZW50T2JqKSB7XG4gICAgICAgICAgICBldmVudE9iaiA9IHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lcnM6IHt9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbW9kdWxlRXZlbnRzLmV2ZW50c1tldmVudF0gPSBldmVudE9iajtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgcmFuZG9tIGV2ZW50IGxpc3RlbmVyIElEIGFuZCBjaGVjayBpZiBpdCBkb2VzIG5vdCBleGlzdCBhbHJlYWR5LlxuICAgICAgICB2YXIgaWQ7XG4gICAgICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgICAgIGlkID0gdXRpbHMucmFuZG9tU3RyaW5nKGV2ZW50TGlzdGVuZXJJRExlbmd0aCk7XG4gICAgICAgICAgICBpZiAoIWV2ZW50T2JqLmxpc3RlbmVyc1tpZF0pIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB0aGUgZXZlbnQgbGlzdGVuZXIgd2l0aCB0aGUgSUQgdG8gdGhlIG1hcC5cbiAgICAgICAgZXZlbnRPYmoubGlzdGVuZXJzW2lkXSA9IHtcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEJpbmQgdGhlIGV2ZW50IGlmIG5vdCBib3VuZCBiZWZvcmUuXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhldmVudE9iai5saXN0ZW5lcnMpLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBzZW5kQmluZEV2ZW50UmVxdWVzdChtb2R1bGUsIGV2ZW50LCBpZCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIHNjb3BlXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBVbmJpbmQgdGhlIGV2ZW50IGFnYWluLlxuICAgICAgICAgICAgb2ZmOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBvZmZFdmVudChtb2R1bGUsIGV2ZW50LCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIC8vIFJlYmluZCB0aGUgZXZlbnRzIG9uIHJlY29ubmVjdGlvbnMuXG4gICAgLy8gRG9uJ3QgdXNlIHRoZSBjb25uZWN0ZWQgZXZlbnQgZGlyZWN0bHksIGJlY2F1c2UgdGhlIGF1dGhlbnRpY2F0aW9uXG4gICAgLy8gc2hvdWxkIGJlIGhhbmRsZWQgZmlyc3QuXG4gICAgJChzb2NrZXQpLm9uKFwiY29ubmVjdGVkX2FuZF9hdXRoXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAkLmVhY2goZXZlbnRzTWFwLCBmdW5jdGlvbihtb2R1bGUsIG1vZHVsZUV2ZW50cykge1xuICAgICAgICAgICAgJC5lYWNoKG1vZHVsZUV2ZW50cy5ldmVudHMsIGZ1bmN0aW9uKGV2ZW50LCBldmVudE9iaikge1xuICAgICAgICAgICAgICAgIC8vIFJlYmluZCB0aGUgZXZlbnQuXG4gICAgICAgICAgICAgICAgc2VuZEJpbmRFdmVudFJlcXVlc3QobW9kdWxlLCBldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuXG4gICAgLypcbiAgICAgKiBSZXR1cm4gdGhlIGFjdHVhbCBtb2R1bGUgZnVuY3Rpb24uXG4gICAgICovXG4gICAgcmV0dXJuIGZ1bmN0aW9uKG1vZHVsZSkge1xuICAgICAgICAvLyBUaGUgbW9kdWxlIG5hbWUgaGFzIHRvIGJlIGRlZmluZWQuXG4gICAgICAgIGlmICghbW9kdWxlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IGludmFsaWQgbW9kdWxlIGNhbGw6IG1vZHVsZT0nXCIgKyBtb2R1bGUgKyBcIidcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIG1vZHVsZSBvYmplY3Qgd2l0aCB0aGUgbW9kdWxlIG1ldGhvZHMuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAvLyBjYWxsIGEgbW9kdWxlIG1ldGhvZCBvbiB0aGUgc2VydmVyLXNpZGUuXG4gICAgICAgICAgICBjYWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBQcmVwZW5kIHRoZSBtb2R1bGUgdmFyaWFibGUgdG8gdGhlIGFyZ3VtZW50cyBhcnJheS5cbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5jYWxsKGFyZ3VtZW50cywgbW9kdWxlKTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIG1ldGhvZC5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbE1ldGhvZC5hcHBseShjYWxsTWV0aG9kLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gb24gbGlzdGVucyBvbiB0aGUgc3BlY2lmaWMgc2VydmVyLXNpZGUgZXZlbnQgYW5kIHRyaWdnZXJzIHRoZSBmdW5jdGlvbi5cbiAgICAgICAgICAgIG9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvLyBQcmVwZW5kIHRoZSBtb2R1bGUgdmFyaWFibGUgdG8gdGhlIGFyZ3VtZW50cyBhcnJheS5cbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUudW5zaGlmdC5jYWxsKGFyZ3VtZW50cywgbW9kdWxlKTtcblxuICAgICAgICAgICAgICAgIC8vIENhbGwgdGhlIG1ldGhvZC5cbiAgICAgICAgICAgICAgICByZXR1cm4gb25FdmVudC5hcHBseShvbkV2ZW50LCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9O1xufSkoKTtcblxuICAgIC8qXG4gKiAgQml0TW9uc3RlciAtIEEgTW9uc3RlciBoYW5kbGluZyB5b3VyIEJpdHNcbiAqICBDb3B5cmlnaHQgKEMpIDIwMTUgIFJvbGFuZCBTaW5nZXIgPHJvbGFuZC5zaW5nZXJbYXRdZGVzZXJ0Yml0LmNvbT5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGZyZWUgc29mdHdhcmU6IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnlcbiAqICBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFzIHB1Ymxpc2hlZCBieVxuICogIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4gKiAgKGF0IHlvdXIgb3B0aW9uKSBhbnkgbGF0ZXIgdmVyc2lvbi5cbiAqXG4gKiAgVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiAgYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqICBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuICBTZWUgdGhlXG4gKiAgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiAgWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2VcbiAqICBhbG9uZyB3aXRoIHRoaXMgcHJvZ3JhbS4gIElmIG5vdCwgc2VlIDxodHRwOi8vd3d3LmdudS5vcmcvbGljZW5zZXMvPi5cbiAqL1xuXG5cbi8qXG4gKiAgVGhpcyBjb2RlIGxpdmVzIGluc2lkZSB0aGUgQml0TW9uc3RlciBmdW5jdGlvbi5cbiAqL1xuXG5ibS5hdXRoID0gKGZ1bmN0aW9uKCkge1xuICAgIC8qXG4gICAgICogQ29uc3RhbnRzXG4gICAgICovXG5cbiAgICB2YXIgYXV0aFRva2VuSUQgPSBcIkJNQXV0aFRva2VuXCI7XG5cblxuICAgIC8qXG4gICAgICogVmFyaWFibGVzXG4gICAgICovXG5cbiAgICAvLyBHZXQgdGhlIGF1dGhlbnRpY2F0aW9uIG1vZHVsZS5cbiAgICB2YXIgbW9kdWxlICAgICAgPSBibS5tb2R1bGUoXCJhdXRoXCIpLFxuICAgICAgICBmaW5nZXJwcmludCA9IGZhbHNlLFxuICAgICAgICBhdXRoVXNlcklEICA9IGZhbHNlO1xuXG5cbiAgICAvKlxuICAgICAqIFRoZSBhY3R1YWwgYXV0aGVudGljYXRpb24gb2JqZWN0LlxuICAgICAqL1xuICAgIHZhciBpbnN0YW5jZSA9IHtcbiAgICAgICAgbG9naW46ICAgICAgICAgbG9naW4sXG4gICAgICAgIGxvZ291dDogICAgICAgIGxvZ291dCxcbiAgICAgICAgZ2V0VXNlcklEOiAgICAgZ2V0VXNlcklELFxuICAgICAgICBpc0F1dGg6ICAgICAgICBpc0F1dGgsXG5cbiAgICAgICAgLy8gVHJpZ2dlcmVkIGlmIHRoZSBzZXNzaW9uIGlzIGF1dGhlbnRpY2F0ZWQgKEFmdGVyIGEgc3VjY2Vzc2Z1bCBsb2dpbikuXG4gICAgICAgIG9uQXV0aDogZnVuY3Rpb24oZikge1xuICAgICAgICAgICAgJChpbnN0YW5jZSkub24oJ29uQXV0aCcsIGYpO1xuICAgICAgICB9LFxuICAgICAgICAvLyBUcmlnZ2VyZWQgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHN0YXRlIGNoYW5nZXMgKExvZ2dlZCBpbiBvciBvdXQpOlxuICAgICAgICBvbkF1dGhDaGFuZ2VkOiBmdW5jdGlvbihmKSB7XG4gICAgICAgICAgICAkKGluc3RhbmNlKS5vbignYXV0aENoYW5nZWQnLCBmKTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuXG4gICAgLypcbiAgICAgKiBQcml2YXRlIE1ldGhvZHNcbiAgICAgKi9cblxuICAgIGZ1bmN0aW9uIGdldEZpbmdlcnByaW50KCkge1xuICAgICAgICBpZiAoIWZpbmdlcnByaW50KSB7XG4gICAgICAgICAgICAvLyBPYnRhaW4gdGhlIGJyb3dzZXIgZmluZ2VycHJpbnQuXG4gICAgICAgICAgICBmaW5nZXJwcmludCA9IHV0aWxzLmJyb3dzZXJGaW5nZXJwcmludCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZpbmdlcnByaW50O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEF1dGhUb2tlbigpIHtcbiAgICAgICAgdmFyIHRva2VuO1xuXG4gICAgICAgIC8vIE9idGFpbiB0aGUgYXV0aCB0b2tlbiBpZiBwcmVzZW50LlxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgbG9jYWwgc3RvcmFnZSBpcyBhdmFpbGFibGUuXG4gICAgICAgIGlmICh1dGlscy5zdG9yYWdlQXZhaWxhYmxlKCdsb2NhbFN0b3JhZ2UnKSkge1xuICAgICAgICAgICAgLy8gR2V0IHRoZSB0b2tlbiBmcm9tIHRoZSBsb2NhbCBzdG9yYWdlLlxuICAgICAgICAgICAgdG9rZW4gPSBsb2NhbFN0b3JhZ2VbYXV0aFRva2VuSURdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gR2V0IHRoZSB0b2tlbiBmcm9tIHRoZSBjb29raWUgc3RvcmFnZS5cbiAgICAgICAgICAgIGlmICh1dGlscy5jb29raWVzLmhhc0l0ZW0oYXV0aFRva2VuSUQpKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSB1dGlscy5jb29raWVzLmdldEl0ZW0oYXV0aFRva2VuSUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm90IHByZXNlbnQsIGp1c3QgcmV0dXJuLlxuICAgICAgICBpZiAoIXRva2VuKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERlY3J5cHQuIFRoZSBwYXNzd29yZCBpcyBub3Qgc2VjdXJlLCBidXQgdGhpcyBpcyBiZXR0ZXIgdGhhbiBzYXZpbmdcbiAgICAgICAgLy8gdGhlIHRva2VuIGluIHBsYWludGV4dCBpbiB0aGUgc3RvcmFnZS5cbiAgICAgICAgLy8gQSBwb3NzaWJsZSBleHRlbnNpb24gd291bGQgYmUgdG8gYXNrIHRoZSB1c2VyIGZvciBhIHBpbi4uLlxuICAgICAgICB0b2tlbiA9IHNqY2wuZGVjcnlwdChnZXRGaW5nZXJwcmludCgpLCB0b2tlbik7XG5cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldEF1dGhUb2tlbih0b2tlbikge1xuICAgICAgICAvLyBFbmNyeXB0LiBUaGUgcGFzc3dvcmQgaXMgbm90IHNlY3VyZSwgYnV0IHRoaXMgaXMgYmV0dGVyIHRoYW4gc2F2aW5nXG4gICAgICAgIC8vIHRoZSB0b2tlbiBpbiBwbGFpbnRleHQgaW4gdGhlIHN0b3JhZ2UuXG4gICAgICAgIC8vIEEgcG9zc2libGUgZXh0ZW5zaW9uIHdvdWxkIGJlIHRvIGFzayB0aGUgdXNlciBmb3IgYSBwaW4uLi5cbiAgICAgICAgdG9rZW4gPSBzamNsLmVuY3J5cHQoZ2V0RmluZ2VycHJpbnQoKSwgdG9rZW4pO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBsb2NhbCBzdG9yYWdlIGlzIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKHV0aWxzLnN0b3JhZ2VBdmFpbGFibGUoJ2xvY2FsU3RvcmFnZScpKSB7XG4gICAgICAgICAgICAvLyBTYXZlIHRoZSB0b2tlbiBpbiB0aGUgbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGF1dGhUb2tlbklELCB0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBVc2UgYSBjb29raWUgYXMgc3RvcmFnZSBhbHRlcm5hdGl2ZS5cbiAgICAgICAgICAgIC8vIFNldCBhbnkgY29va2llIHBhdGggYW5kIGRvbWFpbi5cbiAgICAgICAgICAgIC8vIFRoaXMgY29va2llIGlzIG9ubHkgdXNlZCBpbiBqYXZhc2NyaXB0LlxuICAgICAgICAgICAgdXRpbHMuY29va2llcy5zZXRJdGVtKGF1dGhUb2tlbklELCB0b2tlbiwgKDEqNjAqNjAqMjQqMzApKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlbGV0ZUF1dGhUb2tlbigpIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGxvY2FsIHN0b3JhZ2UgaXMgYXZhaWxhYmxlLlxuICAgICAgICBpZiAodXRpbHMuc3RvcmFnZUF2YWlsYWJsZSgnbG9jYWxTdG9yYWdlJykpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgdG9rZW4gZnJvbSB0aGUgbG9jYWwgc3RvcmFnZS5cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGF1dGhUb2tlbklEKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFVzZSBhIGNvb2tpZSBhcyBzdG9yYWdlIGFsdGVybmF0aXZlLlxuICAgICAgICAgICAgdXRpbHMuY29va2llcy5yZW1vdmVJdGVtKGF1dGhUb2tlbklEKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGF1dGhlbnRpY2F0ZSB0aGlzIGNsaWVudCB3aXRoIHRoZSBzYXZlZCBhdXRoIGRhdGEuXG4gICAgLy8gUmV0dXJucyBmYWxzZSBpZiBubyBhdXRoZW50aWNhdGlvbiBkYXRhIGlzIHByZXNlbnQuXG4gICAgLy8gSWYgbm8gYXV0aGVudGljYXRpb24gZGF0YSBpcyBwcmVzZW50LCB0aGVuIHRoZSBlcnJvciBjYWxsYmFjayBpcyBub3QgdHJpZ2dlcmVkLlxuICAgIGZ1bmN0aW9uIGF1dGhlbnRpY2F0ZShjYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgICAgICAvLyBHZXQgdGhlIGF1dGggdG9rZW4uXG4gICAgICAgIHZhciBhdXRoVG9rZW4gPSBnZXRBdXRoVG9rZW4oKTtcbiAgICAgICAgaWYgKCFhdXRoVG9rZW4pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjYWxsRXJyb3JDYWxsYmFjayA9IGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgLy8gUmVzZXQgdGhlIGN1cnJlbnQgYXV0aGVudGljYXRlZCB1c2VyLlxuICAgICAgICAgICAgc2V0Q3VycmVudFVzZXJJRChmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4uXG4gICAgICAgICAgICBkZWxldGVBdXRoVG9rZW4oKTtcblxuICAgICAgICAgICAgaWYgKGVycm9yQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB1dGlscy5jYWxsQ2F0Y2goZXJyb3JDYWxsYmFjaywgZXJyKTtcbiAgICAgICAgICAgICAgICAvLyBSZXNldCB0byB0cmlnZ2VyIG9ubHkgb25jZS5cbiAgICAgICAgICAgICAgICBlcnJvckNhbGxiYWNrID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbW9kdWxlIG1ldGhvZCBwYXJhbWV0ZXJzLlxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIHRva2VuOiAgICAgICAgIGF1dGhUb2tlbixcbiAgICAgICAgICAgIGZpbmdlcnByaW50OiAgIGdldEZpbmdlcnByaW50KClcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBUaGUgc3VjY2VzcyBjYWxsYmFjayBmb3IgdGhlIGF1dGhlbnRpY2F0aW9uIHJlcXVlc3QuXG4gICAgICAgIHZhciBvblN1Y2Nlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAvLyBWYWxpZGF0ZSwgdGhhdCBhIGNvcnJlY3QgdXNlciBpcyByZXR1cm5lZC5cbiAgICAgICAgICAgIGlmICghZGF0YS51c2VyIHx8ICFkYXRhLnVzZXIuaWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsRXJyb3JDYWxsYmFjayhcImludmFsaWQgdXNlciBkYXRhIHJlY2VpdmVkXCIpO1xuICAgICAgICAgICAgICAgIGxvZ291dCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGF1dGhlbnRpY2F0aW9uIHRva2VuIGhhcyBjaGFuZ2VkLlxuICAgICAgICAgICAgaWYgKGRhdGEudG9rZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBTZXQgdGhlIG5ldyBhdXRoIHRva2VuLlxuICAgICAgICAgICAgICAgIHNldEF1dGhUb2tlbihkYXRhLnRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2V0IHRoZSBjdXJyZW50IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICAgICAgICAgIHNldEN1cnJlbnRVc2VySUQoZGF0YS51c2VyLmlkKTtcblxuICAgICAgICAgICAgLy8gQ2FsbCB0aGUgc3VjY2VzcyBjYWxsYmFjay5cbiAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHV0aWxzLmNhbGxDYXRjaChjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUGVyZm9ybSB0aGUgYWN0dWFsIGF1dGhlbnRpY2F0aW9uLlxuICAgICAgICBtb2R1bGUuY2FsbChcImF1dGhlbnRpY2F0ZVwiLCBkYXRhLCBvblN1Y2Nlc3MsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgLy8gT24gZXJyb3IsIHJldHJ5IG9uY2UgYWdhaW4uXG4gICAgICAgICAgICAvLyBUaGUgYXV0aGVudGljYXRpb24gdG9rZW4gbWlnaHQgaGF2ZSBjaGFuZ2VkIGp1c3QgaW4gdGhhdCBtb21lbnRcbiAgICAgICAgICAgIC8vIGluIGFub3RoZXIgdGFiIHNlc3Npb24uXG4gICAgICAgICAgICBtb2R1bGUuY2FsbChcImF1dGhlbnRpY2F0ZVwiLCBkYXRhLCBvblN1Y2Nlc3MsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgIGNhbGxFcnJvckNhbGxiYWNrKGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9naW4odXNlcm5hbWUsIHBhc3N3b3JkLCBjYWxsYmFjaywgZXJyb3JDYWxsYmFjaykge1xuICAgICAgICB2YXIgcGVyZm9ybUxvZ2luID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgY2FsbEVycm9yQ2FsbGJhY2sgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBjYWxsYmFjay5cbiAgICAgICAgICAgICAgICBpZiAoZXJyb3JDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICB1dGlscy5jYWxsQ2F0Y2goZXJyb3JDYWxsYmFjaywgZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gUmVzZXQgdG8gdHJpZ2dlciBvbmx5IG9uY2UuXG4gICAgICAgICAgICAgICAgICAgIGVycm9yQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKCF1c2VybmFtZSB8fCAhcGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICBjYWxsRXJyb3JDYWxsYmFjayhcImludmFsaWQgbG9naW4gY3JlZGVudGlhbHNcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGhlIG1vZHVsZSBtZXRob2QgcGFyYW1ldGVycy5cbiAgICAgICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZSxcbiAgICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgZmluZ2VycHJpbnQ6IGdldEZpbmdlcnByaW50KClcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG1vZHVsZS5jYWxsKFwibG9naW5cIiwgZGF0YSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBhdXRoIHRva2VuIGlzIHJlY2VpdmVkLlxuICAgICAgICAgICAgICAgIGlmICghZGF0YS50b2tlbikge1xuICAgICAgICAgICAgICAgICAgICBjYWxsRXJyb3JDYWxsYmFjayhcImxvZ2luIGZhaWxlZDogaW52YWxpZCBhdXRoZW50aWNhdGlvbiB0b2tlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFNldCB0aGUgYXV0aCB0b2tlbi5cbiAgICAgICAgICAgICAgICBzZXRBdXRoVG9rZW4oZGF0YS50b2tlbik7XG5cbiAgICAgICAgICAgICAgICAvLyBGaW5hbGx5IGF1dGhlbnRpY2F0ZSB0aGUgc2Vzc2lvbi5cbiAgICAgICAgICAgICAgICBpZiAoIWF1dGhlbnRpY2F0ZShjYWxsYmFjaywgZXJyb3JDYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbEVycm9yQ2FsbGJhY2soXCJhdXRoZW50aWNhdGlvbiBmYWlsZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBlcnJvciBjYWxsYmFjay5cbiAgICAgICAgICAgICAgICBjYWxsRXJyb3JDYWxsYmFjayhlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gSWYgdGhlIHNvY2tldCBpcyBub3QgY29ubmVjdGVkIHlldCwgdGhlbiB0cmlnZ2VyIHRoZSBsb2dpblxuICAgICAgICAvLyBmaXJzdCBhcyBzb29uIGFzIGEgY29ubmVjdGlvbiBpcyBlc3RhYmxpc2hlZC5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHRoZSBzb2NrZXRJRCgpIGlzIGVtcHR5LlxuICAgICAgICBpZiAoc29ja2V0LnN0YXRlKCkgIT09IFwiY29ubmVjdGVkXCIpIHtcbiAgICAgICAgICAgIHNvY2tldC5vbihcImNvbm5lY3RlZFwiLCBwZXJmb3JtTG9naW4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGVyZm9ybUxvZ2luKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgIC8vIFJlc2V0IHRoZSBjdXJyZW50IGF1dGhlbnRpY2F0ZWQgdXNlci5cbiAgICAgICAgc2V0Q3VycmVudFVzZXJJRChmYWxzZSk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIHRoZSBhdXRoZW50aWNhdGlvbiB0b2tlbi5cbiAgICAgICAgZGVsZXRlQXV0aFRva2VuKCk7XG5cbiAgICAgICAgLy8gTG9nb3V0IG9uIHNlcnZlci1zaWRlLlxuICAgICAgICBtb2R1bGUuY2FsbChcImxvZ291dFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIExvZ291dCBzdWNjZXNzZnVsIG9uIHNlcnZlci1zaWRlLlxuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogZmFpbGVkIHRvIGxvZ291dCBzb2NrZXQgc2Vzc2lvblwiKTtcbiAgICAgICAgICAgIGlmIChlcnIpIHsgY29uc29sZS5sb2coZXJyKTsgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcklEKHVzZXJJRCkge1xuICAgICAgICAvLyBTa2lwIGlmIG5vdGhpbmcgaGFzIGNoYW5nZWQuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBwcmV2ZW50IHRyaWdnZXJpbmcgdGhlIGV2ZW50cyBtdWx0aXBsZSB0aW1lcy5cbiAgICAgICAgaWYgKGF1dGhVc2VySUQgPT09IHVzZXJJRCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHRoZSBuZXcgdXNlciBJRC5cbiAgICAgICAgYXV0aFVzZXJJRCA9IHVzZXJJRDtcblxuICAgICAgICAvLyBUcmlnZ2VyIHRoZSBldmVudHMuXG4gICAgICAgIGlmIChhdXRoVXNlcklEKSB7XG4gICAgICAgICAgICAkKGluc3RhbmNlKS50cmlnZ2VyKCdhdXRoQ2hhbmdlZCcsIFt0cnVlXSk7XG4gICAgICAgICAgICAkKGluc3RhbmNlKS50cmlnZ2VyKCdvbkF1dGgnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoaW5zdGFuY2UpLnRyaWdnZXIoJ2F1dGhDaGFuZ2VkJywgW2ZhbHNlXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm5zIGZhbHNlIGlmIG5vdCBsb2dnZWQgaW4uXG4gICAgZnVuY3Rpb24gZ2V0VXNlcklEKCkge1xuICAgICAgICBpZiAoIWF1dGhVc2VySUQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXV0aFVzZXJJRDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0F1dGgoKSB7XG4gICAgICAgIGlmICghYXV0aFVzZXJJRCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuXG5cbiAgICAvKlxuICAgICAqIEluaXRpYWxpemF0aW9uXG4gICAgICovXG5cbiAgICAvLyBBdXRoZW50aWNhdGUgYXMgc29vbiBhcyB0aGUgc29ja2V0IGNvbm5lY3RzLlxuICAgIHNvY2tldC5vbihcImNvbm5lY3RlZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQXV0aGVudGljYXRlIHRoaXMgc29ja2V0IHNlc3Npb24gaWYgdGhlIGF1dGhUb2tlbiBpcyBwcmVzZW50LlxuICAgICAgICB2YXIgbm90QXV0aCA9IGF1dGhlbnRpY2F0ZShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgdGhlIGN1c3RvbSBldmVudC5cbiAgICAgICAgICAgICQoc29ja2V0KS50cmlnZ2VyKFwiY29ubmVjdGVkX2FuZF9hdXRoXCIpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgdGhlIGN1c3RvbSBldmVudC5cbiAgICAgICAgICAgICQoc29ja2V0KS50cmlnZ2VyKFwiY29ubmVjdGVkX2FuZF9hdXRoXCIpO1xuXG4gICAgICAgICAgICAvLyBMb2cuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkJpdE1vbnN0ZXI6IGZhaWxlZCB0byBhdXRoZW50aWNhdGVcIik7XG4gICAgICAgICAgICBpZiAoZXJyKSB7IGNvbnNvbGUubG9nKFwiZXJyb3IgbWVzc2FnZTogXCIgKyBlcnIpOyB9XG5cbiAgICAgICAgICAgIC8vIFNob3cgYSBub3RpZmljYXRpb24uXG4gICAgICAgICAgICBibS5ub3RpZmljYXRpb24oe1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0ci5hdXRoLkZhaWxlZFRpdGxlLFxuICAgICAgICAgICAgICAgIHRleHQ6IHRyLmF1dGguRmFpbGVkVGV4dCxcbiAgICAgICAgICAgIH0pLnNob3coMTAwMDApO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUcmlnZ2VyIHRoZSBjdXN0b20gZXZlbnQgaWYgbm8gYXV0aGVudGljYXRpb24gd2FzIGRvbmUuXG4gICAgICAgIGlmICghbm90QXV0aCkge1xuICAgICAgICAgICAgJChzb2NrZXQpLnRyaWdnZXIoXCJjb25uZWN0ZWRfYW5kX2F1dGhcIik7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEF1dGhlbnRpY2F0ZSBpZiB0aGUgZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgIG1vZHVsZS5vbihcInJlYXV0aGVudGljYXRlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICBhdXRoZW50aWNhdGUodW5kZWZpbmVkLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIC8vIExvZy5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQml0TW9uc3RlcjogZmFpbGVkIHRvIHJlYXV0aGVudGljYXRlXCIpO1xuICAgICAgICAgICAgaWYgKGVycikgeyBjb25zb2xlLmxvZyhcImVycm9yIG1lc3NhZ2U6IFwiICsgZXJyKTsgfVxuXG4gICAgICAgICAgICAvLyBTaG93IGEgbm90aWZpY2F0aW9uLlxuICAgICAgICAgICAgYm0ubm90aWZpY2F0aW9uKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdHIuYXV0aC5GYWlsZWRUaXRsZSxcbiAgICAgICAgICAgICAgICB0ZXh0OiB0ci5hdXRoLkZhaWxlZFRleHQsXG4gICAgICAgICAgICB9KS5zaG93KDEwMDAwKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuXG4gICAgIC8qXG4gICAgICAqIFJldHVybiB0aGUgYXV0aGVudGljYXRpb24gb2JqZWN0LlxuICAgICAgKi9cbiAgICAgcmV0dXJuIGluc3RhbmNlO1xufSkoKTtcblxuXG4gICAgLy8gUmV0dXJuIHRoZSBuZXdseSBjcmVhdGVkIEJpdE1vbnN0ZXIgb2JqZWN0LlxuICAgIHJldHVybiBibTtcbn07XG4iXSwiZmlsZSI6IkJpdE1vbnN0ZXIuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==