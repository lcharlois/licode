/*
*/
var XMLHttpRequest = require("./../vendor/xmlhttprequest").XMLHttpRequest;
var CryptoJS=CryptoJS||function(d,f){var h={},a=h.lib={},c=a.Base=function(){function e(){}return{extend:function(j){e.prototype=this;var b=new e;j&&b.mixIn(j);b.$super=this;return b},create:function(){var e=this.extend();e.init.apply(e,arguments);return e},init:function(){},mixIn:function(e){for(var b in e)e.hasOwnProperty(b)&&(this[b]=e[b]);e.hasOwnProperty("toString")&&(this.toString=e.toString)},clone:function(){return this.$super.extend(this)}}}(),n=a.WordArray=c.extend({init:function(e,b){e=
this.words=e||[];this.sigBytes=b!=f?b:4*e.length},toString:function(e){return(e||i).stringify(this)},concat:function(e){var b=this.words,a=e.words,g=this.sigBytes,e=e.sigBytes;this.clamp();if(g%4)for(var c=0;c<e;c++)b[g+c>>>2]|=(a[c>>>2]>>>24-8*(c%4)&255)<<24-8*((g+c)%4);else if(65535<a.length)for(c=0;c<e;c+=4)b[g+c>>>2]=a[c>>>2];else b.push.apply(b,a);this.sigBytes+=e;return this},clamp:function(){var e=this.words,b=this.sigBytes;e[b>>>2]&=4294967295<<32-8*(b%4);e.length=d.ceil(b/4)},clone:function(){var e=
c.clone.call(this);e.words=this.words.slice(0);return e},random:function(e){for(var b=[],a=0;a<e;a+=4)b.push(4294967296*d.random()|0);return n.create(b,e)}}),l=h.enc={},i=l.Hex={stringify:function(e){for(var b=e.words,e=e.sigBytes,a=[],c=0;c<e;c++){var g=b[c>>>2]>>>24-8*(c%4)&255;a.push((g>>>4).toString(16));a.push((g&15).toString(16))}return a.join("")},parse:function(e){for(var b=e.length,a=[],c=0;c<b;c+=2)a[c>>>3]|=parseInt(e.substr(c,2),16)<<24-4*(c%8);return n.create(a,b/2)}},m=l.Latin1={stringify:function(b){for(var a=
b.words,b=b.sigBytes,c=[],g=0;g<b;g++)c.push(String.fromCharCode(a[g>>>2]>>>24-8*(g%4)&255));return c.join("")},parse:function(b){for(var a=b.length,c=[],g=0;g<a;g++)c[g>>>2]|=(b.charCodeAt(g)&255)<<24-8*(g%4);return n.create(c,a)}},b=l.Utf8={stringify:function(b){try{return decodeURIComponent(escape(m.stringify(b)))}catch(a){throw Error("Malformed UTF-8 data");}},parse:function(b){return m.parse(unescape(encodeURIComponent(b)))}},g=a.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=n.create();
this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=b.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(b){var a=this._data,c=a.words,g=a.sigBytes,i=this.blockSize,h=g/(4*i),h=b?d.ceil(h):d.max((h|0)-this._minBufferSize,0),b=h*i,g=d.min(4*b,g);if(b){for(var f=0;f<b;f+=i)this._doProcessBlock(c,f);f=c.splice(0,b);a.sigBytes-=g}return n.create(f,g)},clone:function(){var b=c.clone.call(this);b._data=this._data.clone();return b},_minBufferSize:0});a.Hasher=g.extend({init:function(){this.reset()},
reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);this._doFinalize();return this._hash},clone:function(){var b=g.clone.call(this);b._hash=this._hash.clone();return b},blockSize:16,_createHelper:function(b){return function(a,c){return b.create(c).finalize(a)}},_createHmacHelper:function(b){return function(a,c){return o.HMAC.create(b,c).finalize(a)}}});var o=h.algo={};return h}(Math);
(function(){var d=CryptoJS,f=d.lib,h=f.WordArray,f=f.Hasher,a=[],c=d.algo.SHA1=f.extend({_doReset:function(){this._hash=h.create([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(c,d){for(var i=this._hash.words,f=i[0],b=i[1],g=i[2],h=i[3],e=i[4],j=0;80>j;j++){if(16>j)a[j]=c[d+j]|0;else{var k=a[j-3]^a[j-8]^a[j-14]^a[j-16];a[j]=k<<1|k>>>31}k=(f<<5|f>>>27)+e+a[j];k=20>j?k+((b&g|~b&h)+1518500249):40>j?k+((b^g^h)+1859775393):60>j?k+((b&g|b&h|g&h)-1894007588):k+((b^g^h)-
899497514);e=h;h=g;g=b<<30|b>>>2;b=f;f=k}i[0]=i[0]+f|0;i[1]=i[1]+b|0;i[2]=i[2]+g|0;i[3]=i[3]+h|0;i[4]=i[4]+e|0},_doFinalize:function(){var a=this._data,c=a.words,d=8*this._nDataBytes,h=8*a.sigBytes;c[h>>>5]|=128<<24-h%32;c[(h+64>>>9<<4)+15]=d;a.sigBytes=4*c.length;this._process()}});d.SHA1=f._createHelper(c);d.HmacSHA1=f._createHmacHelper(c)})();
(function(){var d=CryptoJS,f=d.enc.Utf8;d.algo.HMAC=d.lib.Base.extend({init:function(h,a){h=this._hasher=h.create();"string"==typeof a&&(a=f.parse(a));var c=h.blockSize,d=4*c;a.sigBytes>d&&(a=h.finalize(a));for(var l=this._oKey=a.clone(),i=this._iKey=a.clone(),m=l.words,b=i.words,g=0;g<c;g++)m[g]^=1549556828,b[g]^=909522486;l.sigBytes=i.sigBytes=d;this.reset()},reset:function(){var d=this._hasher;d.reset();d.update(this._iKey)},update:function(d){this._hasher.update(d);return this},finalize:function(d){var a=
this._hasher,d=a.finalize(d);a.reset();return a.finalize(this._oKey.clone().concat(d))}})})();var N=N||{};N.authors=["aalonsog@dit.upm.es","prodriguez@dit.upm.es","jcervino@dit.upm.es"];N.version=0.1;N=N||{};
N.Base64=function(){var d,f,h,a,c,n,l,i,m;d="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");f=[];for(c=0;c<d.length;c+=1)f[d[c]]=c;n=function(b){h=b;a=0};l=function(){var b;if(!h||a>=h.length)return-1;b=h.charCodeAt(a)&255;a+=1;return b};i=function(){if(!h)return-1;for(;;){if(a>=h.length)return-1;var b=h.charAt(a);a+=1;if(f[b])return f[b];if("A"===b)return 0}};m=function(b){b=b.toString(16);1===b.length&&(b=
"0"+b);return unescape("%"+b)};return{encodeBase64:function(b){var a,c,e;n(b);b="";a=Array(3);c=0;for(e=!1;!e&&-1!==(a[0]=l());)if(a[1]=l(),a[2]=l(),b+=d[a[0]>>2],-1!==a[1]?(b+=d[a[0]<<4&48|a[1]>>4],-1!==a[2]?(b+=d[a[1]<<2&60|a[2]>>6],b+=d[a[2]&63]):(b+=d[a[1]<<2&60],b+="=",e=!0)):(b+=d[a[0]<<4&48],b+="=",b+="=",e=!0),c+=4,76<=c)b+="\n",c=0;return b},decodeBase64:function(b){var a,c;n(b);b="";a=Array(4);for(c=!1;!c&&-1!==(a[0]=i())&&-1!==(a[1]=i());)a[2]=i(),a[3]=i(),b+=m(a[0]<<2&255|a[1]>>4),-1!==
a[2]?(b+=m(a[1]<<4&255|a[2]>>2),-1!==a[3]?b+=m(a[2]<<6&255|a[3]):c=!0):c=!0;return b}}}(N);N=N||{};
N.API=function(d){var f,h;f=function(a,c,f,l,i,m){var b,g,o,e,j,k;b=d.API.params.service;g=d.API.params.key;""===b||""===g?console.log("ServiceID and Key are required!!"):(o=(new Date).getTime(),e=o+",123123aaff",j="MAuth realm=http://marte3.dit.upm.es,mauth_signature_method=HMAC_SHA1",""!==i&&""!==m&&(j=j+",mauth_username="+i+",mauth_role="+m,e+=","+i+","+m),i=h(e,g),j=j+",mauth_serviceid="+b+",mauth_cnonce=123123aaff,mauth_timestamp="+o+",mauth_signature="+i,k=new XMLHttpRequest,k.onreadystatechange=function(){k.readyState===
4&&a(k.responseText)},k.open(c,l,!0),k.setRequestHeader("Authorization",j),k.setRequestHeader("Content-Type","application/json"),console.log("Sending "+c+" to "+l+" - "+JSON.stringify(f)),k.send(JSON.stringify(f)))};h=function(a,c){var f;f=CryptoJS.HmacSHA1(a,c).toString(CryptoJS.enc.Hex);return d.Base64.encodeBase64(f)};return{params:{url:void 0,service:void 0,key:void 0},init:function(a,c,f){d.API.params.url=a;d.API.params.service=c;d.API.params.key=f},createRoom:function(a,c){f(c,"POST",{name:a},
d.API.params.url+"rooms")},getRooms:function(a){f(a,"GET",void 0,d.API.params.url+"rooms")},getRoom:function(a,c){f(c,"GET",void 0,d.API.params.url+"rooms/"+a)},deleteRoom:function(a,c){f(c,"DELETE",void 0,d.API.params.url+"rooms/"+a)},createToken:function(a,c,h,l){f(l,"POST",void 0,d.API.params.url+"rooms/"+a+"/tokens",c,h)},createService:function(a,c,h){f(h,"POST",{name:a,key:c},d.API.params.url+"services/")},getServices:function(a){f(a,"GET",void 0,d.API.params.url+"services/")},getService:function(a,
c){f(c,"GET",void 0,d.API.params.url+"services/"+a)},deleteService:function(a,c){f(c,"DELETE",void 0,d.API.params.url+"services/"+a)},getUsers:function(a,c){f(c,"GET",void 0,d.API.params.url+"rooms/"+a+"/users/")},getUser:function(a,c,h){f(h,"GET",void 0,d.API.params.url+"rooms/"+a+"/users/"+c)},deleteUser:function(a,c,h){f(h,"DELETE",void 0,d.API.params.url+"rooms/"+a+"/users/"+c)}}}(N);
module.exports = N;
