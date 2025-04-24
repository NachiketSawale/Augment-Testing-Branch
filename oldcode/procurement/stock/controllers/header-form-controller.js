// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('ProcurementStockHeaderDetailController',
		['$scope', 'procurementStockHeaderDataService','platformDetailControllerService', 'procurementStockUIStandardService', 'platformTranslateService',
			// eslint-disable-next-line func-names
			function ($scope, dataService, platformDetailControllerService, formConfig, translateService) {

				platformDetailControllerService.initDetailController($scope, dataService,{}, formConfig, translateService);

				// $scope.formContainerOptions.customButtons = [
				//     {
				//         id: 'create',
				//         caption: $translate.instant('cloud.common.taskBarNewRecordByCopy'),
				//         disabled: false,
				//         type: 'item',
				//         iconClass: 'tlb-icons ico-rec-new-copy',
				//         fn: dataService.createItem
				//     },
				//     {
				//         id: 'createBlank',
				//         caption: $translate.instant('cloud.common.taskBarNewRecord'),
				//         disabled: false,
				//         type: 'item',
				//         iconClass: 'tlb-icons ico-rec-new',
				//         fn: dataService.createBlankItem
				//     }];
			}
		]);

})(angular);