(function () {
	'use strict';

	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('prcPackageMasterRestrictionGridController', [
		'$scope',
		'platformGridControllerService',
		'prcPackageMasterRestrictionDataService',
		'prcPackageMasterRestrictionUIStandardService',
		'prcPackageMasterRestrictionValidationService',
		function (
			$scope,
			platformGridControllerService,
			dataService,
			gridColumns,
			validationService
		) {
			var gridConfig = {initCalled: false, columns: []};

			platformGridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
		}
	]);

})();