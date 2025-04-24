/**
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	angular.module('platform').directive('platformGridControlKeyHandler', handler);

	handler.$inject = ['_', 'keyCodes'];

	/**
	 * @ngdoc directive
	 * @name platformGridControlKeyHandler
	 * @element textarea
	 * @restrict A
	 * @description Captures some keys that should not be processed by an enclosing grid while a control is in editing
	 *              mode.
	 */
	function handler(_, keyCodes) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: false,
			link: function (scope, elem, attrs) {
				var inGrid = !_.isUndefined(attrs.grid);
				var unregister = [];

				elem.on('keydown', controlKeyDown);

				unregister.push(function () {
					elem.off('keydown', controlKeyDown);
				});

				/**
				 * @ngdoc function
				 * @name controlKeyDown
				 * @function
				 * @methodOf platformGridControlKeyHandler
				 * @description This method handles keydown events in the control in order to suppress propagation to
				 *              the surrounding grid, if any.
				 * @param event An object that contains some information about the event. A keyCode field is expected.
				 */
				function controlKeyDown(event) { // jshint ignore:line
					switch (event.keyCode) {
						case keyCodes.HOME:
						case keyCodes.END:
							if (inGrid) {
								event.stopPropagation();
							}
							break;
					}
				}

				unregister.push(scope.$on('$destroy', function () {
					_.over(unregister)();
					unregister = null;
				}));
			}
		};
	}
})(angular);