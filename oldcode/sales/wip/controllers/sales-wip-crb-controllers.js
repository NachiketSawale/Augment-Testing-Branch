(function() {
	'use strict';

	var wipModule = angular.module('sales.wip');

	wipModule.controller('salesWipCrbBoqItemScopeController', ['$scope', 'salesWipBoqStructureService', 'boqMainCrbBoqItemScopeService',
		function ($scope, salesWipBoqStructureService, boqMainCrbBoqItemScopeService) {
			boqMainCrbBoqItemScopeService.initController($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipCrbPriceconditionController', ['$scope', 'salesWipBoqStructureService', 'boqMainCrbPriceconditionService',
		function ($scope, salesWipBoqStructureService, boqMainCrbPriceconditionService)
		{
			boqMainCrbPriceconditionService.initController($scope, salesWipBoqStructureService);
		}
	]);

	wipModule.controller('salesWipCrbVariableController', ['$scope', 'salesWipBoqStructureService', 'boqMainCrbVariableService',
		function ($scope, salesWipBoqStructureService, boqMainCrbVariableService) {
			boqMainCrbVariableService.initController($scope, salesWipBoqStructureService);
		}
	]);

})();
