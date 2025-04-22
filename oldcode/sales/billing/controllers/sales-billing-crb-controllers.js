(function() {
	'use strict';

	var billingModule = angular.module('sales.billing');

	billingModule.controller('salesBillingCrbBoqItemScopeController', ['$scope', 'salesBillingBoqStructureService', 'boqMainCrbBoqItemScopeService',
		function ($scope, salesBillingBoqStructureService, boqMainCrbBoqItemScopeService) {
			boqMainCrbBoqItemScopeService.initController($scope, salesBillingBoqStructureService);
		}
	]);

	billingModule.controller('salesBillingCrbPriceconditionController', ['$scope', 'salesBillingBoqStructureService', 'boqMainCrbPriceconditionService',
		function ($scope, salesBillingBoqStructureService, boqMainCrbPriceconditionService)
		{
			boqMainCrbPriceconditionService.initController($scope, salesBillingBoqStructureService);
		}
	]);

	billingModule.controller('salesBillingCrbVariableController', ['$scope', 'salesBillingBoqStructureService', 'boqMainCrbVariableService',
		function ($scope, salesBillingBoqStructureService, boqMainCrbVariableService) {
			boqMainCrbVariableService.initController($scope, salesBillingBoqStructureService);
		}
	]);

})();
