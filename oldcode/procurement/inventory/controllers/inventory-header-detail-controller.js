/**
 * Created by pel on 7/5/2019.
 */

(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'procurement.inventory';
	angular.module(moduleName).controller('inventoryHeaderDetailController',
		['$scope',  'platformGridControllerService', 'procurementInventoryHeaderDataService', 'platformDetailControllerService',
			'inventoryHeaderElementValidationService','procurementInventoryHeaderUIStandardService','platformTranslateService',
			function ($scope,  gridControllerService, dataService, platformDetailControllerService,inventoryHeaderElementValidationService,
				procurementInventoryHeaderUIStandardService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope,dataService,inventoryHeaderElementValidationService,procurementInventoryHeaderUIStandardService,
					platformTranslateService);
			}]
	);
})(angular);
