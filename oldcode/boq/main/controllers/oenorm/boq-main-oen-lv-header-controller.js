(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name boqMainOenLVHeaderController
	 * @function
	 * @description
	 */
	angular.module('boq.main').controller('boqMainOenLVHeaderController', ['$scope', 'boqMainOenLvHeaderControllerService', 'boqMainService',
		function ($scope, boqMainOenLvHeaderControllerService, boqMainService) {
			boqMainOenLvHeaderControllerService.getInstance($scope, boqMainService);
		}
	]);
})();