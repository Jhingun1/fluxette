(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.fluxette = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _get = function get(_x4, _x5, _x6) { var _again = true; _function: while (_again) { var object = _x4, property = _x5, receiver = _x6; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x4 = parent; _x5 = property; _x6 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _store = require('./store');

var _store2 = _interopRequireDefault(_store);

var _util = require('./util');

exports.Store = _store2['default'];

var _default = (function () {
	function _default() {
		var stores = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
		var middleware = arguments.length <= 1 || arguments[1] === undefined ? function (list) {
			return list;
		} : arguments[1];

		_classCallCheck(this, _default);

		// Top-level Stores
		this.stores = stores;
		// Dispatcher
		this.hooks = [];
		// Action Stack
		this.history = [];
		// Middleware
		this.middleware = middleware;
	}

	_createClass(_default, [{
		key: 'state',
		value: function state() {
			return (0, _util.deriveState)(this.stores);
		}
	}, {
		key: 'dispatch',
		value: function dispatch() {
			for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
				data[_key] = arguments[_key];
			}

			// Normalize array of actions
			data = (0, _util.flattenDeep)(data).filter(function (x) {
				return x instanceof Object;
			});
			if (data.length > 0) {
				var _history;

				// Call Middleware
				data = this.middleware(data);
				// Push all actions onto stack
				(_history = this.history).push.apply(_history, _toConsumableArray(data));
				var stores = this.stores;

				// Synchronously process all actions
				(0, _util.updateState)(stores, data);
				// Call all registered listeners
				(0, _util.callAll)(this.hooks, (0, _util.deriveState)(stores));
			}
		}
	}, {
		key: 'hook',
		value: function hook(fn) {
			// Add listener
			this.hooks.push(fn);
		}
	}, {
		key: 'unhook',
		value: function unhook(fn) {
			// Remove listener
			(0, _util.deleteFrom)(this.hooks, fn);
		}
	}, {
		key: 'connect',
		value: function connect() {
			var specifier = arguments.length <= 0 || arguments[0] === undefined ? function (data) {
				return data;
			} : arguments[0];

			// decorator for React class
			var hooks = this.hooks;

			var state = this.state.bind(this);
			return function (Component) {
				return (function (_Component) {
					_inherits(_class, _Component);

					function _class() {
						var _this = this;

						_classCallCheck(this, _class);

						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						_get(Object.getPrototypeOf(_class.prototype), 'constructor', this).apply(this, args);
						// Initial state
						this.state = specifier(state());
						// Ensure the same reference of setState
						var listener = this[_util.listenerKey] = function (data) {
							return _get(Object.getPrototypeOf(_class.prototype), 'setState', _this).call(_this, specifier(data));
						};
						// Register setState
						hooks.push(listener);
					}

					_createClass(_class, [{
						key: 'componentWillUnmount',
						value: function componentWillUnmount() {
							for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
								args[_key3] = arguments[_key3];
							}

							_get(Object.getPrototypeOf(_class.prototype), 'componentWillUnmount', this).apply(this, args);
							// Unregister setState
							(0, _util.deleteFrom)(hooks, this[_util.listenerKey]);
						}
					}]);

					return _class;
				})(Component);
			};
		}
	}]);

	return _default;
})();

exports['default'] = _default;

},{"./store":2,"./util":3,"react":"react"}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports["default"] = function () {
	var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	var reducers = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	// Function that takes an action or array of actions
	return function (actions) {
		// If no actions, just return state
		if (actions !== undefined) {
			// Ensure actions are an array
			if (!(actions instanceof Array)) {
				actions = [actions];
			}
			// Call the appropriate reducer with the state and the action
			actions.forEach(function (action) {
				var red = reducers[action.type];
				if (red) {
					state = red(state, action);
				}
			});
		}
		return state;
	};
};

module.exports = exports["default"];

},{}],3:[function(require,module,exports){
// Derive state from stores
// If it's a store, return the result
// Otherwise recursively build a state
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
var deriveState = function deriveState(state) {
	return state instanceof Function ? state() : getState(state);
};

exports.deriveState = deriveState;
var getState = function getState(stores) {
	var obj = stores instanceof Array ? [] : {};
	for (var key in stores) {
		var store = stores[key];
		obj[key] = store instanceof Function ? store() : getState(store);
	}
	return obj;
};

// Dispatch actions to stores
// If it's a store, just dispatch it
// Otherwise recursively dispatch
var updateState = function updateState(store, data) {
	if (store instanceof Function) {
		store(data);
	} else {
		callAllDeep(store, data);
	}
};

exports.updateState = updateState;
var callAllDeep = function callAllDeep(iterable) {
	for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		data[_key - 1] = arguments[_key];
	}

	for (var key in iterable) {
		var fn = iterable[key];
		if (fn instanceof Function) {
			fn.apply(undefined, data);
		} else {
			callAllDeep(fn);
		}
	}
};

var flattenDeep = function flattenDeep(arr) {
	return arr.length ? flatten(arr, []) : arr;
};

exports.flattenDeep = flattenDeep;
var flatten = function flatten(arr, into) {
	for (var i in arr) {
		var val = arr[i];
		if (val instanceof Array) {
			flatten(val, into);
		} else {
			into.push(val);
		}
	}
	return into;
};

// Call each function in an array of functions with data
var callAll = function callAll(iterable) {
	for (var _len2 = arguments.length, data = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		data[_key2 - 1] = arguments[_key2];
	}

	for (var key in iterable) {
		iterable[key].apply(iterable, data);
	}
};

exports.callAll = callAll;
var deleteFrom = function deleteFrom(array, obj) {
	var index = array.indexOf(obj);
	if (~index) {
		array.splice(index, 1);
	}
};

exports.deleteFrom = deleteFrom;
var listenerKey = Symbol ? Symbol() : '__fluxetteListener';
exports.listenerKey = listenerKey;

},{}]},{},[1])(1)
});