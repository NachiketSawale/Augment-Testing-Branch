(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name boqMainOenAkzController
	 * @function
	 * @description
	 */

	angular.module('boq.main').controller('boqMainOenAkzController', ['$scope', 'boqMainOenAkzControllerService','boqMainService',
		function ($scope, boqMainOenAkzControllerService, boqMainService) {
			boqMainOenAkzControllerService.getInstance($scope, boqMainService);
		}
	]);
})();

