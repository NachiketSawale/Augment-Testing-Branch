(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.procurementstructure').controller('basicsProcurementStructureAccountGridController',
		['$scope', 'platformGridControllerService', 'basicsProcurementAccountUIStandardService',
			'basicsProcurementStructureAccountService', 'basicsProcurementStructureAccountValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validationService) {

				var gridConfig = {
					columns: []
				};

				//$scope.prcAccountTypeValidator = validationService.validatePrcAccountType;
				//$scope.taxCodeValidator = validationService.validateTaxCode;
				//$scope.accountValidator = validationService.validateIsNullOrEmpty;
				//$scope.offsetAccountValidator = validationService.validateIsNullOrEmpty;

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			}]);
})(angular);