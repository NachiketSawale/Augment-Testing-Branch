(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name boqMainOenLbMetadataController
	 * @function
	 * @description
	 */
	angular.module('boq.main').controller('boqMainOenLbMetadataController', ['$scope', 'boqMainOenLbMetadataControllerService', 'boqMainService',
		function($scope, boqMainOenLbMetadataControllerService, boqMainService) {
			boqMainOenLbMetadataControllerService.getInstance($scope, boqMainService);
		}
	]);
})();