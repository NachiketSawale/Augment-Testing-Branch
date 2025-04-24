(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 @ngdoc controller
	 * @name boqMainSpecificationController
	 * @function
	 *
	 * @description
	 * Controller for the Specification view.
	 * Includes the textAngular html editor.
	 */
	angular.module(moduleName).controller('boqMainSpecificationController', ['$scope', 'boqMainSpecificationControllerService', 'boqMainService',
		function boqMainSpecificationControllerFunction($scope, boqMainSpecificationControllerService, boqMainService) {
			boqMainSpecificationControllerService.initSpecificationController($scope, boqMainService, moduleName);
		}
	]);
})();
