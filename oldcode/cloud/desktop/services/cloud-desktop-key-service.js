/**
 * Created by postic on 30.09.2019.
 */

/**
 * @ngdoc service
 * @name cloud.desktop.service:cloudDesktopKeyService
 * @priority default value
 * @description
 * Contains listeners on keyevents for global or local usage
 */

(function (angular) {
	/* global $ */
	'use strict';
	angular.module('cloud.desktop').service('cloudDesktopKeyService', ['keyCodes', function (keyCodes) {
		let ctrl, shift;
		let navButtonSelector = '.navigator-button.ico-goto';

		function resetVariables() {
			$(navButtonSelector).css('cursor', 'pointer');
			ctrl = false;
			shift = false;
		}

		this.registerKeyListeners = function () {
			$(document).keydown(function (e) {
				let key = e.which || e.keyCode;
				resetVariables();

				if (key === keyCodes.CTRL) {
					$(navButtonSelector).css('cursor', 'cell');
					ctrl = true;
				} else if (key === keyCodes.SHIFT) {
					$(navButtonSelector).css('cursor', 'cell');
					shift = true;
				}
			});
			$(document).keyup(function (e) {
				var key = e.which || e.keyCode;
				if (key === keyCodes.CTRL) {
					$(navButtonSelector).css('cursor', 'pointer');
					ctrl = false;
				} else if (key === keyCodes.SHIFT) {
					$(navButtonSelector).css('cursor', 'pointer');
					shift = false;
				}
			});
		};

		this.isCtrlDown = function () {
			return ctrl;
		};

		this.isShiftDown = function () {
			return shift;
		};

		this.resetCursorForNavBtn = function () {
			$(navButtonSelector).css('cursor', 'pointer');
		};

		this.clearKeyListeners = function () {
			resetVariables();
		};

		resetVariables();
	}]);
})(angular);
