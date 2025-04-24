(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name boqMainOenServicePartController
	 * @function
	 * @description
	 */

	angular.module('boq.main').controller('boqMainOenServicePartController', ['$scope', 'boqMainOenServicePartControllerService', 'boqMainService',
		function ($scope, boqMainOenServicePartControllerService, boqMainService) {
			boqMainOenServicePartControllerService.getInstance($scope, boqMainService);
		}
	]);
})();

