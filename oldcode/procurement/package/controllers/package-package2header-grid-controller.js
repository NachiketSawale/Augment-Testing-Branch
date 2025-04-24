/**
 * Created by wuj on 8/19/2015.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackagePackage2HeaderGridController',
		['$scope', 'platformGridControllerService', 'procurementPackagePackage2HeaderService',
			'procurementPackagePackage2HeaderUIStandardService', 'procurementPackagePackage2HeaderValidationService',
			function ($scope, gridControllerService, dataService, gridColumns, validationService) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				dataService.load(); // refresh data (when req is deleted, refresh it.)
			}
		]);
})(angular);