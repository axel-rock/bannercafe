/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./templates/ultrawide/banner.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@bannerboy/bannerboy/index.js":
/*!****************************************************!*\
  !*** ./node_modules/@bannerboy/bannerboy/index.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n* @namespace\n*/\n\nvar bannerboy = {\n\timage_cache: {},\n\tdefaults: {}\n};\n\n/**\n* Creates, styles and returns an HTML DOM Element\n* @instance\n* @param {object} settings An object that sets the element's <strong>CSS parameters</strong> and <strong>transform properties</strong> (using GSAP), plus some extra options:\n<ul>\n<li><strong>type:</strong> The type of element to create. Can be any DOM Element, e.g. \"canvas\", \"span\", \"a\". Defaults to \"div\".</li>\n<li><strong>parent:</strong> The parent to append the new element to.</li>\n<li><strong>innerHTML:</strong> A string that is set to the element's innerHTML property.</li>\n</ul>\n* @returns {Element}\n* @example\n* var element = bannerboy.createElement({width: 10, height: 10, backgroundColor: \"red\", parent: document.body});\n\n*/\n\nbannerboy.createElement = function(settings) {\n\t\n\tvar multipleElements = true;\n\tfor(var key in settings) {\n\t\tif(typeof settings[key] != 'object') multipleElements = false;\n\t}\n\n\tif(multipleElements) {\n\t\tvar elements = {};\n\t\tfor(var i in settings) {\n\t\t\telements[i] = bannerboy.createElement(settings[i]);\n\t\t}\n\t\treturn elements;\n\t}\n\n\t// default settings\n\tsettings = settings || {};\n\tsettings = bannerboy.combineObjects({type: 'div', position: 'absolute', force3D: true}, bannerboy.defaults, settings);\n\n\tvar element = settings.ns ? document.createElementNS(settings.ns, settings.type) : document.createElement(settings.type);\n\n\tswitch(settings.type) {\n\t\tcase 'canvas' :\n\t\t\telement.width = settings.width;\n\t\t\telement.height = settings.height;\n\t\t\tbreak;\n\t\tcase 'video' :\n\t\t\tif (settings.autoplay) element.autoplay = settings.autoplay;\n\t\t\tif (settings.loop) element.loop = settings.loop;\n\t\t\tif (settings.controls) element.controls = settings.controls;\n\t\t\tif (settings.muted) element.muted = settings.muted;\n\t\t\tif (settings.poster) element.poster = settings.poster;\n\t\t\tif (settings.preload) element.preload = settings.preload;\n\t\t\tbreak;\n\t}\n\n\t// set video sources\n\tif (settings.sources) {\n\t\t// loop through sources array\n\t\tvar sources = settings.sources;\n\t\tfor (var i = 0; i < sources.length; i++) {\n\t\t\t// create source tag\n\t\t\tvar sourceTag = document.createElement('source');\n\t\t\tsourceTag.src = sources[i].url;\n\t\t\tsourceTag.type = sources[i].type;\n\t\t\telement.appendChild(sourceTag);\n\t\t}\n\t}\n\n\t// handle image\n\tif(settings.backgroundImage) {\n\t\telement.style.backgroundSize = settings.backgroundSize || 'contain';\n\t\telement.style.backgroundRepeat = settings.backgroundRepeat || 'no-repeat';\n\t\tloadImg(settings.backgroundImage, true);\n\t} else {\n\t\tapplySettings();\n\t}\n\n\tfunction applySettings() {\n\n\t\t// functions\n\t\tbannerboy.prepElement(element);\n\n\t\tif(settings.id) element.id = settings.id;\n\n\t\tif(settings.insertBefore) {\n\t\t\tsettings.insertBefore = getElement(settings.insertBefore);\n\t\t\tsettings.insertBefore.parentNode.insertBefore(element, settings.insertBefore);\n\t\t} else if(settings.insertAfter) {\n\t\t\tsettings.insertAfter = getElement(settings.insertAfter);\n\t\t\tsettings.insertAfter.parentNode.insertBefore(element, settings.insertAfter.nextElementSibling);\n\t\t} else if(settings.parent){\n\t\t\tsettings.parent = getElement(settings.parent);\n\t\t\tsettings.parent.appendChild(element);\n\t\t}\n\n\t\tfunction getElement(elementOrId) {\n\t\t\treturn (typeof elementOrId === 'string') ? document.getElementById(elementOrId) : elementOrId;\n\t\t}\n\n\t\tif(settings.center) element.center();\n\t\tif(settings.centerX) element.centerX();\n\t\tif(settings.centerY) element.centerY();\n\t\tif(settings.centerHorizontal) element.centerHorizontal();\n\t\tif(settings.centerVertical) element.centerVertical();\n\t\tif(settings.innerHTML) element.innerHTML = settings.innerHTML;\n\t\tsettings = bannerboy.deleteProps(settings, ['ns', 'innerHTML', 'retina', 'parent', 'id', 'type', 'autoplay', 'loop', 'controls', 'muted', 'poster', 'preload', 'sources', 'center', 'centerHorizontal', 'centerVertical', 'centerY', 'centerX', 'insertBefore', 'insertAfter']);\n\n\t\tTweenLite.set(element, settings);\n\t}\n\n\tfunction loadImg(src, doSetImage) {\n\t\tvar img = bannerboy.image_cache[src];\n\t\tif (img) { // if preloaded\n\t\t\tif(doSetImage) setImage.apply(img);\n\t\t} else {\n\t\t\tconsole.log('Image ' + src + ' has not been preloaded.');\n\t\t\timg = document.createElement('img');\n\t\t\timg.src = src;\n\t\t\tif(doSetImage) img.onload = setImage;\n\t\t\tbannerboy.image_cache[src] = img;\n\t\t}\n\t}\n\n\tfunction setImage() {\n\t\tvar isSVG = this.src.slice(-4) == '.svg';\n\t\tif(isSVG) document.body.appendChild(this); // IE fix\n\t\tsettings.width =  settings.width || Math.round(settings.retina ? this.width / 2 : this.width);\n\t\tsettings.height = settings.height || Math.round(settings.retina ? this.height / 2 : this.height);\n\t\tsettings.backgroundImage = 'url(' + this.src + ')';\n\t\tapplySettings();\n\t\tif(isSVG) document.body.removeChild(this); // IE fix\n\t}\n\n\treturn element;\n};\n\nbannerboy.prepElement = function(element) {\n\telement.appendChildren = function(children) { for(var i = 0; i < children.length; ++i) this.appendChild(children[i]); return this; };\n\telement.set = function(settings) { TweenLite.set(this, settings); return this; };\n\telement.to = function(time, settings) { TweenLite.to(this, time, settings); return this; };\n\telement.from = function(time, settings) { TweenLite.from(this, time, settings); return this; };\n\telement.fromTo = function(time, from, to) { TweenLite.fromTo(this, time, from, to); return this; };\n\telement.get = function(property) {\n\t\t\n\t\t// gsap3\n\t\tif(window.gsap) {\n\t\t\treturn gsap.getProperty(this, property);\n\t\t// gsap2\n\t\t} else {\n\t\t\tif(this._glTransform) {\n\t\t\t\tif(this._glTransform[property] || this._glTransform[property] === 0) return this._glTransform[property];\n\t\t\t}\n\t\t\t\n\t\t\tvar prop = window.getComputedStyle(this)[property];\n\t\t\tif(prop) {\n\t\t\t\treturn (prop.slice(-2) == 'px') ? parseFloat(prop) : this.style[property];\n\t\t\t} else {\n\t\t\t\tconsole.log('Cannot get property \"' + property + '\"');\n\t\t\t\treturn 0;\n\t\t\t}\n\t\t}\n\t};\n\telement.centerX = element.centerHorizontal = function() { TweenLite.set(this, {left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto'}); return this; };\n\telement.centerY = element.centerVertical = function() { TweenLite.set(this, {top: 0, bottom: 0, marginTop: 'auto', marginBottom: 'auto'}); return this; };\n\telement.center = function() { TweenLite.set(this, {top: 0, left: 0, right: 0, bottom: 0, margin: 'auto'}); return this; };\n\telement.putInContainer = function(overflow) {\n\t\tthis.container = bannerboy.createElement({left: this.get('left'), top: this.get('top'), width: this.get('width'), height: this.get('height'), overflow: overflow || 'hidden', parent: this.parentNode});\n\t\tthis.set({left: 0, top: 0});\n\t\tthis.container.appendChild(this);\n\t};\n};\n\n/**\n* Loads a collection of images and runs a callback function when ready\n* @instance\n* @param {string[]} images An array with src paths to the image files to load\n* @param {function} callback The function to be called when all images are loaded\n* @param {*} [scope] The scope for the callback function\n* @example\n* bannerboy.preloadImages([\"bg.jpg\", \"logo.png\", \"txt_1.png\", \"txt_2.png\"], function() {\n// all images are ready to use here\n}, this);\n*/\nbannerboy.preloadImages = function(images, callback, scope) {\n\tvar loadedImages = 0;\n\tvar img = null;\n\tvar imgArray = [];\n\tfor(var i = 0; i < images.length; ++i) {\n\t\timg = document.createElement('img');\n\t\timg.src = img.shortSrc = images[i];\n\t\timgArray.push(img);\n\t\timg.onload = function() {\n\t\t\tloadedImages++;\n\t\t\tbannerboy.image_cache[this.shortSrc] = this;\n\t\t\tif(loadedImages == images.length) {\n\t\t\t\tif (scope) {\n\t\t\t\t\tcallback.call(scope, imgArray);\n\t\t\t\t} else {\n\t\t\t\t\tcallback(imgArray);\n\t\t\t\t}\n\t\t\t}\n\t\t};\n\t}\n\t// if images array does not contain any images, just run the callback\n\tif (images.length === 0) {\n\t\tsetTimeout(function() {\n\t\t\tif (scope) {\n\t\t\t\tcallback.call(scope);\n\t\t\t} else {\n\t\t\t\tcallback();\n\t\t\t}\n\t\t}, 0);\n\t\t\n\t}\n};\n\n/**\n* Loads an external javascript file and runs a callback function when ready\n* @instance\n* @param {string} script The path to the script to load\n* @param {function} callback The function to be called when the script is loaded\n* @example\n* bannerboy.include(['https://cdnjs.cloudflare.com/ajax/libs/gsap/1.17.0/TweenLite.min.js'], function() {\n// the script is ready to use here\n});\n*/\nbannerboy.include = function (script, callback) {\n\tconsole.log(\"#include '\" + script + \"'\");\n\tvar include_script = document.createElement('script');\n\tinclude_script.type = \"text/javascript\";\n\tinclude_script.src = script;\n\tdocument.head.appendChild(include_script);\n\tinclude_script.onload = callback ? callback : function() { console.log(\"Resource loaded: \" + include_script.src); };\n\tinclude_script.onerror = function () { console.log(\"Oops! Could not load resource '\" + script + \"'\"); };\n};\n\n/**\n* Combines any number of objects into one new object. Each object gets precedence over the one before it. Useful when dealing with settings objects and defaults.\n* @instance\n* @param {...object} objects The objects to combine\n* @returns {object}\n* @example\n\ncreateSomething({width: 150});\n\nfunction createSomething(options) {\nvar defaults = {width: 100, height: 100};\noptions = bannerboy.combineObjects(defaults, options);\n// options now contains {width: 150, height: 100}\n}\n*/\nbannerboy.combineObjects = function() {\n\tvar sum = {};\n\tfor(var i in arguments) {\n\t\tvar obj = arguments[i];\n\t\tfor(var prop in obj) {\n\t\t\tsum[prop] = obj[prop];\n\t\t}\n\t}\n\treturn sum;\n};\n\n/**\n* Deletes properties from an object. Can be used to create a sort of primitive pseudo inheritance when passing settings objects in a chain of function calls.\n* @instance\n* @param {object} obj The object to remove properties from\n* @param {string[]} props An array containing the names of the properties to remove\n* @example\n\nvar ronny = createDude({name: \"Ronny Praeger\", age: 48, left: 10, top: 10});\nronny.sayHey();\n\nfunction createDude(options) {\n\nvar name = options.name;\nvar age = options.age;\n\noptions = bannerboy.deleteProps(options, [\"name\", \"age\"]); // delete all properties specific to the dude\nvar div = bannerboy.createElement(options); // pass the rest in to its \"super\"\ndiv.sayHey = function() {\n\tconsole.log(\"Hey, I'm \" + name + \", I'm \" + age);\n}\nreturn div;\n}\n\n*/\nbannerboy.deleteProps = function(obj, props) {\n\tvar objCopy = bannerboy.combineObjects({}, obj);\n\tfor(var i in props) {\n\t\tdelete objCopy[props[i]];\n\t}\n\treturn objCopy;\n};\n\n\n// // internet explorer fix\n// if (!window.console) {\n// \twindow.console = {\n// \t\tlog: function () {\n\n// \t\t}\n// \t};\n// }\n\n\nbannerboy.addToBlueprint = function(blueprint) {\n\n\t// init blueprint collection if needed\n\tbannerboy.blueprint = bannerboy.blueprint || { images: [], elements: {} };\n\n\t// append elements and images to blueprint's collections\n\tif(blueprint.executions) bannerboy.blueprint.executions = blueprint.executions;\n\tif(blueprint.width) bannerboy.blueprint.width = blueprint.width;\n\tif(blueprint.height) bannerboy.blueprint.height = blueprint.height;\n\tif(blueprint.images) bannerboy.blueprint.images = bannerboy.blueprint.images.concat(blueprint.images);\n\tif(blueprint.elements) bannerboy.blueprint.elements = bannerboy.combineObjects(bannerboy.blueprint.elements, blueprint.elements);\n\n};\n\nbannerboy.createElementsFromBlueprint = function() {\n\treturn bannerboy.createElement(bannerboy.blueprint.elements);\t\n};\n\n\n\nmodule.exports = bannerboy;\n\n\n//# sourceURL=webpack:///./node_modules/@bannerboy/bannerboy/index.js?");

/***/ }),

/***/ "./node_modules/fontfaceobserver/fontfaceobserver.standalone.js":
/*!**********************************************************************!*\
  !*** ./node_modules/fontfaceobserver/fontfaceobserver.standalone.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* Font Face Observer v2.3.0 - © Bram Stein. License: BSD-3-Clause */(function(){function p(a,c){document.addEventListener?a.addEventListener(\"scroll\",c,!1):a.attachEvent(\"scroll\",c)}function u(a){document.body?a():document.addEventListener?document.addEventListener(\"DOMContentLoaded\",function b(){document.removeEventListener(\"DOMContentLoaded\",b);a()}):document.attachEvent(\"onreadystatechange\",function g(){if(\"interactive\"==document.readyState||\"complete\"==document.readyState)document.detachEvent(\"onreadystatechange\",g),a()})};function w(a){this.g=document.createElement(\"div\");this.g.setAttribute(\"aria-hidden\",\"true\");this.g.appendChild(document.createTextNode(a));this.h=document.createElement(\"span\");this.i=document.createElement(\"span\");this.m=document.createElement(\"span\");this.j=document.createElement(\"span\");this.l=-1;this.h.style.cssText=\"max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;\";this.i.style.cssText=\"max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;\";\nthis.j.style.cssText=\"max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;\";this.m.style.cssText=\"display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;\";this.h.appendChild(this.m);this.i.appendChild(this.j);this.g.appendChild(this.h);this.g.appendChild(this.i)}\nfunction x(a,c){a.g.style.cssText=\"max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:\"+c+\";\"}function B(a){var c=a.g.offsetWidth,b=c+100;a.j.style.width=b+\"px\";a.i.scrollLeft=b;a.h.scrollLeft=a.h.scrollWidth+100;return a.l!==c?(a.l=c,!0):!1}function C(a,c){function b(){var e=g;B(e)&&null!==e.g.parentNode&&c(e.l)}var g=a;p(a.h,b);p(a.i,b);B(a)};function D(a,c,b){c=c||{};b=b||window;this.family=a;this.style=c.style||\"normal\";this.weight=c.weight||\"normal\";this.stretch=c.stretch||\"normal\";this.context=b}var E=null,F=null,G=null,H=null;function I(a){null===F&&(M(a)&&/Apple/.test(window.navigator.vendor)?(a=/AppleWebKit\\/([0-9]+)(?:\\.([0-9]+))(?:\\.([0-9]+))/.exec(window.navigator.userAgent),F=!!a&&603>parseInt(a[1],10)):F=!1);return F}function M(a){null===H&&(H=!!a.document.fonts);return H}\nfunction N(a,c){var b=a.style,g=a.weight;if(null===G){var e=document.createElement(\"div\");try{e.style.font=\"condensed 100px sans-serif\"}catch(q){}G=\"\"!==e.style.font}return[b,g,G?a.stretch:\"\",\"100px\",c].join(\" \")}\nD.prototype.load=function(a,c){var b=this,g=a||\"BESbswy\",e=0,q=c||3E3,J=(new Date).getTime();return new Promise(function(K,L){if(M(b.context)&&!I(b.context)){var O=new Promise(function(r,t){function h(){(new Date).getTime()-J>=q?t(Error(\"\"+q+\"ms timeout exceeded\")):b.context.document.fonts.load(N(b,'\"'+b.family+'\"'),g).then(function(n){1<=n.length?r():setTimeout(h,25)},t)}h()}),P=new Promise(function(r,t){e=setTimeout(function(){t(Error(\"\"+q+\"ms timeout exceeded\"))},q)});Promise.race([P,O]).then(function(){clearTimeout(e);\nK(b)},L)}else u(function(){function r(){var d;if(d=-1!=k&&-1!=l||-1!=k&&-1!=m||-1!=l&&-1!=m)(d=k!=l&&k!=m&&l!=m)||(null===E&&(d=/AppleWebKit\\/([0-9]+)(?:\\.([0-9]+))/.exec(window.navigator.userAgent),E=!!d&&(536>parseInt(d[1],10)||536===parseInt(d[1],10)&&11>=parseInt(d[2],10))),d=E&&(k==y&&l==y&&m==y||k==z&&l==z&&m==z||k==A&&l==A&&m==A)),d=!d;d&&(null!==f.parentNode&&f.parentNode.removeChild(f),clearTimeout(e),K(b))}function t(){if((new Date).getTime()-J>=q)null!==f.parentNode&&f.parentNode.removeChild(f),\nL(Error(\"\"+q+\"ms timeout exceeded\"));else{var d=b.context.document.hidden;if(!0===d||void 0===d)k=h.g.offsetWidth,l=n.g.offsetWidth,m=v.g.offsetWidth,r();e=setTimeout(t,50)}}var h=new w(g),n=new w(g),v=new w(g),k=-1,l=-1,m=-1,y=-1,z=-1,A=-1,f=document.createElement(\"div\");f.dir=\"ltr\";x(h,N(b,\"sans-serif\"));x(n,N(b,\"serif\"));x(v,N(b,\"monospace\"));f.appendChild(h.g);f.appendChild(n.g);f.appendChild(v.g);b.context.document.body.appendChild(f);y=h.g.offsetWidth;z=n.g.offsetWidth;A=v.g.offsetWidth;t();\nC(h,function(d){k=d;r()});x(h,N(b,'\"'+b.family+'\",sans-serif'));C(n,function(d){l=d;r()});x(n,N(b,'\"'+b.family+'\",serif'));C(v,function(d){m=d;r()});x(v,N(b,'\"'+b.family+'\",monospace'))})})}; true?module.exports=D:(undefined);}());\n\n\n//# sourceURL=webpack:///./node_modules/fontfaceobserver/fontfaceobserver.standalone.js?");

/***/ }),

/***/ "./platforms/shared/initElements.js":
/*!******************************************!*\
  !*** ./platforms/shared/initElements.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const bannerboy = __webpack_require__(/*! @bannerboy/bannerboy */ \"./node_modules/@bannerboy/bannerboy/index.js\");\n\nmodule.exports = function(blueprint) {\n\n  var bb;\n  var banner = document.getElementById('banner');\n\n  if(banner) {\n    // legacy mode off\n    bb = { banner: banner };\n    bannerboy.prepElement(banner);\n    for(var id in blueprint.elements) {\n      bb[id] = document.getElementById(id);\n      bannerboy.prepElement(bb[id]);\n    }\n  } else {\n    // legacy mode on\n    banner = bannerboy.createElement({id: 'banner', width: blueprint.width, height: blueprint.height, backgroundColor: '#ccc', cursor: 'pointer', boxSizing: 'border-box', parent: 'banner-container'});\n    bannerboy.blueprint = blueprint;\n    bb = bannerboy.createElementsFromBlueprint();\n    bb.banner = banner;\n  }\n  \n  return bb;\n};\n\n\n//# sourceURL=webpack:///./platforms/shared/initElements.js?");

/***/ }),

/***/ "./platforms/sizmek.js":
/*!*****************************!*\
  !*** ./platforms/sizmek.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const bannerboy = __webpack_require__(/*! @bannerboy/bannerboy */ \"./node_modules/@bannerboy/bannerboy/index.js\")\nconst initElements = __webpack_require__(/*! ./shared/initElements */ \"./platforms/shared/initElements.js\")\n\nmodule.exports = {\n  head: [\n    '__GSAP__',\n    '<script type=\"text/javascript\" src=\"https://secure-ds.serving-sys.com/BurstingScript/EBLoader.js\"></script>',\n  ],\n  clickthrough: function () {\n    window.EB.clickthrough()\n  },\n  init: function (blueprint, callback) {\n    if (!EB.isInitialized()) {\n      EB.addEventListener(EBG.EventName.EB_INITIALIZED, onInit)\n      if (\n        location.href.includes('attaboy') ||\n        location.href.includes('localhost')\n      ) { onInit() }\n    } else {\n      onInit()\n    }\n\n    function onInit () {\n      bannerboy.preloadImages(blueprint.images, function () {\n        const bb = initElements(blueprint)\n        callback(bb)\n      })\n    }\n  },\n  // renameFallback: 'fallback',\n}\n\n\n//# sourceURL=webpack:///./platforms/sizmek.js?");

/***/ }),

/***/ "./templates/js/cta.js":
/*!*****************************!*\
  !*** ./templates/js/cta.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = () => {\n  const tl = gsap\n    .timeline()\n    .to('#cta>span>span:last-child', 0.4, {opacity: 0, x: 0.2 + 'rem'}, '+=0')\n    .to('#cta>span>span:last-child', 0.4, {opacity: 1, x: 0.0 + 'rem'}, '+=0.4')\n    .to('#cta>span>span:last-child', 0.4, {opacity: 0, x: 0.2 + 'rem'}, '+=0')\n    .to('#cta>span>span:last-child', 0.4, {opacity: 1, x: 0.0 + 'rem'}, '+=0.4')\n\n  document.addEventListener('mouseover', () => {\n    console.log('enter')\n    if (tl.progress() == 1) tl.play(0)\n  })\n\n  return tl\n}\n\n\n//# sourceURL=webpack:///./templates/js/cta.js?");

/***/ }),

/***/ "./templates/ultrawide/banner.js":
/*!***************************************!*\
  !*** ./templates/ultrawide/banner.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const bannerboy = __webpack_require__(/*! @bannerboy/bannerboy */ \"./node_modules/@bannerboy/bannerboy/index.js\")\nconst platform = __webpack_require__(/*! platform */ \"./platforms/sizmek.js\")\nconst FontFaceObserver = __webpack_require__(/*! fontfaceobserver */ \"./node_modules/fontfaceobserver/fontfaceobserver.standalone.js\")\nconst unit = {\"id\":\"IT_Live_DD029_Multiple Publisher_0712\",\"name\":\"IT-IT_Live_DD029_990x60_standalone_animated_box_6-27\",\"assetid\":\"DD029\",\"date\":\"6-27\",\"market\":\"it-it\",\"weight\":\"200kb\",\"dimensions\":\"990x60\",\"version\":\"Live\",\"responsive\":\"Yes\",\"hpto\":\"no\",\"specs\":\"https://support.sizmek.com/hc/en-us/articles/360055247231-About-Standard-Banner\",\"platform\":\"sizmek\",\"type\":\"html\",\"txtBox\":\"Due giorni di offerte incredibili.\",\"txtDate\":\"12-13 luglio\\nluglio 12-13\",\"txtDisclaimer\":\"Solo per i clienti Amazon Prime\",\"txtCtaLeadUp\":\"Scopri di più\",\"txtCtaLive\":\"Acquista subito\",\"logo\":\"amazon\\nprime day\",\"team\":\"Dev\",\"status\":\"Open\",\"rowNumber\":103,\"region\":\"eu\",\"template\":\"ultrawide\",\"otherSpreadsheetInfos\":{\"ROW #\":\"95\",\"Fallback (Y/N)\":\"No\",\"bb3k\":\"bb3k\",\"ASIN (Y/N)\":\"No\",\"Media Type\":\"Digital - Display standalone\",\"Unit Description\":\"Standard Banner\",\"PSD (Y/N)\":\"no\",\"BB/Rufus Review Notes\":\"Link doesn't work well (content exist, but not visible). We are used to do Sizmek banners We have done a check and link works. Inside you can find all specifications but we can get you in touch with the referent (sizmek-ukcs@amazon.com) ok n/a n/a\",\"Requested/Available File Format\":\"JPG+ JPG/HTML5/GIF\",\"Additional URL for TR HPTO\":\"N/A\",\"Approved\":\"Approved\",\"Delivered\":\"Y\",\"missingTemplate\":\"990x60\"},\"rows\":3,\"cols\":3,\"branding\":\"amzpdeuultrawide\",\"creative\":\"Live\",\"txt\":{\"cta\":\"Acquista subito <span><span>›</span><span>›</span></span>\",\"legal\":\"Solo per i clienti Amazon Prime\"},\"execution\":{\"package\":\"it-it\"},\"compression\":{},\"textOnly\":true,\"width\":990,\"height\":60}\nconst blueprint = (bannerboy.blueprint = {\"elements\":{\"box\":{\"left\":0,\"top\":0,\"width\":390,\"height\":330,\"id\":\"box\",\"parent\":\"banner\"},\"packageShadow\":{\"left\":0,\"top\":0,\"width\":390,\"height\":330,\"backgroundImage\":\"packageShadow.png\",\"retina\":true,\"img_scale\":2,\"id\":\"packageShadow\",\"parent\":\"box\"},\"package\":{\"left\":0,\"top\":0,\"width\":390,\"height\":330,\"backgroundImage\":\"package_it-it.png\",\"retina\":true,\"img_scale\":2,\"id\":\"package\",\"parent\":\"box\"}},\"images\":[\"packageShadow.png\",\"package_it-it.png\"],\"width\":990,\"height\":60,\"executions\":[],\"name\":\"ultrawide\"})\n\nconst animateCTA = __webpack_require__(/*! ../js/cta */ \"./templates/js/cta.js\")\n\nconst banner = document.getElementById('banner')\nconst cover = document.getElementById('cover')\nconst debug = window.location.href.indexOf('://localhost:') != -1\n\nif(unit.textOnly){\n  blueprint.images = []\n  blueprint.elements = []\n}\n\nplatform.init(blueprint, async (bb) => {\n  await new FontFaceObserver('Ember Bold', {weight: 300})\n    .load(null, 100)\n    .catch((error) => {\n      console.log('FontFaceObserver: ', error)\n    }) // Error handler for MS Edge only. Without this line, the banner doesn't show.\n  await new FontFaceObserver('Ember Regular', {weight: 300})\n    .load(null, 100)\n    .catch((error) => {\n      console.log('FontFaceObserver: ', error)\n    }) // Error handler for MS Edge only. Without this line, the banner doesn't show.\n\n  /* Init\n  ================================================= */\n\n  document.querySelectorAll('#logo').forEach((logo, index) => {\n    // console.log(logo, index)\n    logo.id += index + 1\n    logo.classList.add('logo')\n  })\n\n  // document.querySelector('#date1').innerHTML = unit.txtDate.split('\\n')[0]\n  // document.querySelector('#date2').innerHTML = unit.txtDate.split('\\n')[0]\n\n  // console.log(unit)\n\n  // console.log('ultrawide')\n\n  // createPattern(unit)\n  // scaleText(unit)\n  cover.remove()\n\n  /* Animations\n  ================================================= */\n\n  /* Main timeline\n  ================================================= */\n\n  if (debug) console.time('bannerTime')\n\n  if (unit.type.includes('html') || unit.type.includes('GIF')) {\n    const main_tl = gsap.timeline({id: 'main_tl'}).call(animateCTA)\n  }\n\n  /* Interactions\n  ================================================= */\n\n  banner.addEventListener('click', () => {\n    platform.clickthrough()\n  })\n})\n\n\n//# sourceURL=webpack:///./templates/ultrawide/banner.js?");

/***/ })

/******/ });