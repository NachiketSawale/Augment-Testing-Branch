/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSelectorRegistrationService
	 * @function
	 *
	 * @description Registers object selectors that do not depend on any other modules.
	 */
	angular.module('model.viewer').factory('modelViewerSelectorRegistrationService', ['$injector',
		function ($injector) {

			var services = [
				'modelViewerFilterSelectorService',
				'modelViewerBasicSelectorService',
				'modelMainObjectSelectorService',
				'modelEvaluationObjectSelectorService'
			];

			var service = {};

			service.register = function () {
				services.forEach(function (svcName) {
					$injector.get(svcName);
				});
				service.register = function () {
				};
			};

			return service;
		}]);
})(angular);
