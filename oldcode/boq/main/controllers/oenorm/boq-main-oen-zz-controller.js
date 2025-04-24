(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name boqMainOenZzController
	 * @function
	 * @description
	 */

	angular.module('boq.main').controller('boqMainOenZzController', ['$scope', 'boqMainOenZzControllerService', 'boqMainService',
		function ($scope, boqMainOenZzControllerService, boqMainService) {
			boqMainOenZzControllerService.getInstance($scope, boqMainService);
		}
	]);
})();

