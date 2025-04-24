(function() {
	'use strict';

	angular.module('boq.main').controller('boqMainOenContactController', ['$scope', 'boqMainOenContactControllerService', 'boqMainService',
		function($scope, boqMainOenContactControllerService, boqMainService) {
			boqMainOenContactControllerService.getInstance($scope, boqMainService);
		}
	]);
})();