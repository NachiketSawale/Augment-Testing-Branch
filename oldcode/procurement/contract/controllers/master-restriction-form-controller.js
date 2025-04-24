/**
 * Created by chi on 10/11/2021.
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';
	angular.module(moduleName).controller('procurementContractMasterRestrictionFormController', [
		'$scope',
		'platformDetailControllerService',
		'procurementContractMasterRestrictionDataService',
		'prcPackageMasterRestrictionUIStandardService',
		'procurementContractMasterRestrictionValidationService',
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