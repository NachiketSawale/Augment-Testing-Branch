(function() {
	'use strict';

	var contractModule = angular.module('sales.contract');

	contractModule.controller('salesContractCrbBoqItemScopeController', ['$scope', 'salesContractBoqStructureService', 'boqMainCrbBoqItemScopeService',
		function ($scope, salesContractBoqStructureService, boqMainCrbBoqItemScopeService) {
			boqMainCrbBoqItemScopeService.initController($scope, salesContractBoqStructureService);
		}
	]);

	contractModule.controller('salesContractCrbPriceconditionController', ['$scope', 'salesContractBoqStructureService', 'boqMainCrbPriceconditionService',
		function ($scope, salesContractBoqStructureService, boqMainCrbPriceconditionService)
		{
			boqMainCrbPriceconditionService.initController($scope, salesContractBoqStructureService);
		}
	]);

	contractModule.controller('salesContractCrbVariableController', ['$scope', 'salesContractBoqStructureService', 'boqMainCrbVariableService',
		function ($scope, salesContractBoqStructureService, boqMainCrbVariableService) {
			boqMainCrbVariableService.initController($scope, salesContractBoqStructureService);
		}
	]);

})();
