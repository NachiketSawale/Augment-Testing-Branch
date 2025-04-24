(function () {
	'use strict';
	/* global angular */
	let moduleName = 'basics.material';
	angular.module(moduleName).controller('basicsMaterialPortionListController', [
		'$scope',
		'platformGridControllerService',
		'basicsMaterialPortionStandardConfigurationService',
		'basicsMaterialPortionDataService',
		'basicsMaterialPortionValidationService',
		function (
			$scope,
			gridControllerService,
			gridColumns,
			dataService,
			validationService
		) {

			let gridConfig = {
				columns: []
			};
			gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
		}]);
})();