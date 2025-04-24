/**
 * Created by lvy on 3/5/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(moduleName).controller('procurementContractMasterRestrictionGridController',
		['$injector','$scope', 'platformGridControllerService', 'procurementContractMasterRestrictionDataService', 'procurementContractMasterRestrictionUIStandardService', 'basicsCommonBusinessDecorator', 'procurementContractMasterRestrictionValidationService',
			function ($injector,$scope, gridControllerService, dataService, uiStandardService, basicsCommonBusinessDecorator, validationService) {

				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, {});

				basicsCommonBusinessDecorator.decorateGrid($scope, dataService);
			}]
	);
})(angular);