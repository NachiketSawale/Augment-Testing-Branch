(function () {
	'use strict';
	/*global angular*/

	var moduleName = 'productionplanning.fabricationunit';
	angular.module(moduleName).controller('ppsNestingListController', [
		'$scope', 'platformGridControllerService',
		'ppsNestingDataService', 'ppsNestingUIService',
		'ppsNestingValidationService',
		'basicsCommonToolbarExtensionService',
		function ($scope, platformGridControllerService,
		          dataService, uiStandardService,
		          validationService,
			basicsCommonToolbarExtensionService
		) {
			var gridConfig = {
				initCalled: false,
				columns: [],
				pinningContext: true //set to refresh tools when pinningContext changed
			};

			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
		}
	]);
})();