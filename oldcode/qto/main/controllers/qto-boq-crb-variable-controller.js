(function () {
	'use strict';

	angular.module('qto.main').controller('qtoMainCrbVariableController', ['$scope', 'qtoBoqStructureService', 'boqMainCrbVariableService',
		function boqMainSpecificationControllerFunction($scope, qtoBoqStructureService, boqMainCrbVariableService) {
			boqMainCrbVariableService.initController($scope, qtoBoqStructureService);
		}
	]);
})();
