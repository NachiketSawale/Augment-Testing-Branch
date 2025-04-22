(function() {
	'use strict';

	var bidModule = angular.module('sales.bid');

	bidModule.controller('salesBidCrbBoqItemScopeController', ['$scope', 'salesBidBoqStructureService', 'boqMainCrbBoqItemScopeService',
		function ($scope, salesBidBoqStructureService, boqMainCrbBoqItemScopeService) {
			boqMainCrbBoqItemScopeService.initController($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidCrbPriceconditionController', ['$scope', 'salesBidBoqStructureService', 'boqMainCrbPriceconditionService',
		function ($scope, salesBidBoqStructureService, boqMainCrbPriceconditionService)
		{
			boqMainCrbPriceconditionService.initController($scope, salesBidBoqStructureService);
		}
	]);

	bidModule.controller('salesBidCrbVariableController', ['$scope', 'salesBidBoqStructureService', 'boqMainCrbVariableService',
		function ($scope, salesBidBoqStructureService, boqMainCrbVariableService) {
			boqMainCrbVariableService.initController($scope, salesBidBoqStructureService);
		}
	]);

})();
