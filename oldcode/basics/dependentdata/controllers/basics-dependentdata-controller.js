(function () {

	/* global globals, angular */
	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 * Main controller for the module
	 **/

	angular.module(moduleName).controller('basicsDependentDataController', ['$scope',
		'platformMainControllerService','basicsDependentDataMainService', 'basicsDependentDataTranslationService',

		function ($scope, platformMainControllerService,mainDataService, translationService) {
			$scope.path = globals.appBaseUrl;
			var opt = {search: true, reports: false};
			var ctrlProxy = {};
			var environment = platformMainControllerService.registerCompletely($scope, mainDataService, ctrlProxy, translationService, moduleName, opt);
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(mainDataService, environment, translationService, opt);
			});

			var init = function () {
			};
			init();

		}

	]);
})();