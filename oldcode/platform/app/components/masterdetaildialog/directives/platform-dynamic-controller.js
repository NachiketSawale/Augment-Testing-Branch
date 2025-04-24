/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platformDynamicController
	 * @restrict A
	 * @priority default value
	 * @requires $controller
	 * @description The code dynamically loads the controller, which is stored in the property of the overhanded expression.
	 * In the example, the controller in the value of the scope property "dynCtrl".
	 * @example
	 * <div data-platform-dynamic-controller='dynCtrl'></div>
	 */
	angular.module('platform').directive('platformDynamicController', ['$controller', function ($controller) {

		return {
			restrict: 'A',
			link: function (scope, elem, attrs) {
				var controllers = [];

				if (attrs.platformDynamicController) {

					scope.$watch(attrs.platformDynamicController, function (newValue) {
						var controller;

						if (newValue) {
							// Check whether the controller has already been loaded
							controller = _.find(controllers, function (ctrl) {
								return ctrl.Id === newValue;
							});

							if (controller) {
								controller = controller.controller;
							}

							// Controller doesn't exist, therefore create new one
							if (!controller) {
								controller = $controller(newValue, {
									$scope: scope,
									$element: elem,
									$attrs: attrs
								});

								controllers.push({Id: newValue, controller: controller});
							}
						}

						elem.data('$Controller', controller);
					});
				}
			}
		};
	}]);
})();