(function () {
	'use strict';

	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('prcPackageMasterRestrictionFormController', [
		'$scope',
		'platformDetailControllerService',
		'prcPackageMasterRestrictionDataService',
		'prcPackageMasterRestrictionUIStandardService',
		'prcPackageMasterRestrictionValidationService',
		function (
			$scope,
			platformDetailControllerService,
			dataService,
			gridColumns,
			validationService
		) {
			platformDetailControllerService.initDetailController( $scope, dataService, validationService, gridColumns, null );
		}
	]);
})();