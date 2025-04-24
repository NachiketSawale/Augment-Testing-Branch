/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerShortcutService
	 * @function
	 *
	 * @description Provides utility routines for handling keyboard shortcuts.
	 */
	angular.module('model.viewer').factory('modelViewerShortcutService', ['_', 'keyCodes',
		function (_, keyCodes) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name Shortcut
			 * @function
			 * @methodOf Shortcut
			 * @description Instantiates a new keyboard shortcut.
			 * @param {Number} key The code of the key that invokes the command.
			 * @param {Boolean} ctrl Indicates whether the *Control* key needs to be pressed.
			 * @param {Boolean} shift Indicates whether the *Shift* key needs to be pressed.
			 * @param {Boolean} alt Indicates whether the *Alt* key needs to be pressed.
			 * @param {Function} fn The function to run when the shortcut is invoked.
			 */
			service.Shortcut = function (key, ctrl, shift, alt, fn) {
				this.key = key;
				this.ctrl = ctrl;
				this.shift = shift;
				this.alt = alt;
				this.fn = fn;
			};

			/**
			 * @ngdoc function
			 * @name executeShortcut
			 * @function
			 * @methodOf modelViewerShortcutService
			 * @description Attempts to execute a defined shortcut.
			 * @param {Array<Shortcut>} shortcuts An array of shortcut definitions.
			 * @param {Object} keyMap The map of currently pressed keys.
			 * @param {Object} newKeyMap The map of keys that were just pressed.
			 * @returns {Boolean} A value that indicates whether any shortcut was invoked.
			 */
			service.executeShortcut = function (shortcuts, keyMap, newKeyMap) {
				if (_.isArray(shortcuts)) {
					var pressedKeys = [];
					[keyCodes.KEY_A, keyCodes.KEY_B, keyCodes.KEY_C, keyCodes.KEY_D, keyCodes.KEY_E, keyCodes.KEY_F, keyCodes.KEY_G, keyCodes.KEY_H, keyCodes.KEY_I, keyCodes.KEY_J, keyCodes.KEY_K, keyCodes.KEY_L, keyCodes.KEY_M, keyCodes.KEY_N, keyCodes.KEY_O, keyCodes.KEY_P, keyCodes.KEY_Q, keyCodes.KEY_R, keyCodes.KEY_S, keyCodes.KEY_T, keyCodes.KEY_U, keyCodes.KEY_V, keyCodes.KEY_W, keyCodes.KEY_X, keyCodes.KEY_Y, keyCodes.KEY_Z].forEach(function (key) {
						if (newKeyMap[key]) {
							pressedKeys.push(key);
						}
					});
					if (pressedKeys.length === 1) {
						var shortcut = _.find(shortcuts, function (sc) {
							return (sc.key === pressedKeys[0]) &&
								(sc.ctrl ? keyMap[keyCodes.CTRL] : !keyMap[keyCodes.CTRL]) &&
								(sc.alt ? keyMap[keyCodes.ALT] : !keyMap[keyCodes.ALT]) &&
								(sc.shift ? keyMap[keyCodes.SHIFT] : !keyMap[keyCodes.SHIFT]);
						});
						if (shortcut) {
							if (shortcut.fn) {
								shortcut.fn();
							}
							return true;
						}
					}
				}

				return false;
			};

			/**
			 * @ngdoc function
			 * @name getShortcutKeyMap
			 * @function
			 * @methodOf modelViewerShortcutService
			 * @description Retrieves a map of used keys for a list of defined shortcuts.
			 * @param {Array<Shortcut>} shortcuts The list of shortcut definitions.
			 * @returns {Object} The key map.
			 */
			service.getShortcutKeyMap = function (shortcuts) {
				if (shortcuts && shortcuts.shortcutKeyMap) {
					return shortcuts.shortcutKeyMap;
				} else {
					var result = {};

					if (_.isArray(shortcuts)) {
						shortcuts.forEach(function (shortcut) {
							result[shortcut.key] = true;
							if (shortcut.ctrl) {
								result[keyCodes.CTRL] = true;
							}
							if (shortcut.shift) {
								result[keyCodes.SHIFT] = true;
							}
							if (shortcut.alt) {
								result[keyCodes.ALT] = true;
							}
						});
					}

					shortcuts.shortcutKeyMap = result;
					return result;
				}
			};

			/**
			 * @ngdoc function
			 * @name getShortcutPropertyName
			 * @function
			 * @methodOf modelViewerShortcutService
			 * @description Retrieves a property name that can be used to attach lists of shortcuts to objects.
			 * @returns {String} The property name.
			 */
			service.getShortcutPropertyName = function () {
				return 'rib$shortcuts';
			};

			return service;
		}]);
})(angular);
