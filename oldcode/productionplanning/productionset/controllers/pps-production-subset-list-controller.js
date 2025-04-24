(function () {
	'use strict';
	/*globals angular*/

	var moduleName = 'productionplanning.productionset';
	angular.module(moduleName).controller('ppsProductionSubsetListController', [
		'$scope', 'platformGridControllerService', 'ppsProductionSubsetUIService',
		'ppsProductionSubsetDataService', 'ppsProductionSubsetValidationService',
		function ($scope, platformGridControllerService, uiStandardService,
		          dataService, validationService) {
			var gridConfig = {
				initCalled: false,
				columns: [],
				pinningContext: true //set to refresh tools when pinningContext changed
			};

			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
		}
	]);
})();