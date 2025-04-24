/**
 * Created by lcn on 02/24/2022.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonSalesTaxDetailController',
		['$scope', '$injector', 'platformDetailControllerService', 'procurementCommonSalesTaxUIStandardService', 'procurementCommonSalesTaxValidationService', 'platformTranslateService',
			function ($scope, $injector, detailControllerService, gridColumns, validationService, platformTranslateService) {

				// eslint-disable-next-line no-unused-vars
				var gridConfig = {initCalled: false, columns: []};
				var dataService = $scope.getContentValue('dataService');
				var modName = $scope.getContentValue('moduleName');
				switch (modName) {
					case 'procurement.invoice':
						gridColumns = gridColumns.get('Procurement.Invoice', 'InvSalesTaxDto');
						break;
					default:
						throw new Error('Unknown moduleName: ' + modName);
				}

				if (angular.isString(dataService)) {
					dataService = $injector.get(dataService);
				}
				if (angular.isFunction(dataService)) {
					dataService = dataService.call(this);
				}

				validationService = validationService(dataService);
				dataService.createItem = false;
				dataService.deleteItem = false;

				detailControllerService.initDetailController($scope, dataService, validationService, gridColumns, platformTranslateService);
			}]
	);
})(angular);