// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.stock';
	angular.module(moduleName).controller('procurementStockTransactionDetailController',
		['$scope', 'procurementStockTransactionDataService','platformDetailControllerService', 'procurementStockTransactionUIStandardService',
			'platformTranslateService', '$translate',
			'procurementStockTransactionValidationService',
			function ($scope, dataService,platformDetailControllerService, formConfig, translateService,$translate,ValidationService) {

				platformDetailControllerService.initDetailController($scope, dataService,ValidationService, formConfig, translateService);
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