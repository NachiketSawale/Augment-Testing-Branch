/**
 * Created by pel on 7/5/2019.
 */


(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'procurement.inventory';
	angular.module(moduleName).controller('inventoryDetailController',
		['$scope', 'platformGridControllerService', 'procurementInventoryDataService','platformDetailControllerService',
			'inventoryElementValidationService','procurementInventoryUIStandardService','platformTranslateService',
			function ($scope, gridControllerService, dataService, platformDetailControllerService,inventoryElementValidationService,
				procurementInventoryUIStandardService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope,dataService,inventoryElementValidationService,procurementInventoryUIStandardService,
					platformTranslateService);
			}]
	);
})(angular);
