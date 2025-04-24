(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name boqMainOenZzVariantController
	 * @function
	 * @description
	 */

	angular.module('boq.main').controller('boqMainOenZzVariantController', ['$scope', 'boqMainOenZzVariantControllerService', 'boqMainService',
		function ($scope, boqMainOenZzVariantControllerService, boqMainService) {
			boqMainOenZzVariantControllerService.getInstance($scope, boqMainService);
		}
	]);
})();

