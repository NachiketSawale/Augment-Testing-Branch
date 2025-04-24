(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonItemColumnDialogService
	 * @function
	 * @requires procurementPriceComparisonMainService
	 *
	 * @description
	 * #
	 * data service of pricecomparison column dialog controller
	 */
	angular.module(moduleName).factory('procurementPriceComparisonItemColumnDialogService', [
		'globals', 'platformDataServiceFactory', 'procurementPriceComparisonMainService', 'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonItemColumnService', 'procurementPriceComparisonCommonService',
		function (globals, platformDataServiceFactory, mainDataService, basicsLookupdataLookupDescriptorService, itemColumnService, commonService) {

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonItemColumnDialogService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/',
					endRead: 'qtnheader',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						readData.compareColumns = itemColumnService.getList();
						if (itemColumnService.columnParentType === true) { // 'create base rfq'
							readData.IsLoadBase = itemColumnService.columnParentType;
						} else {
							var selectedItem = itemColumnService.getSelected();  // 'create changed rfq'
							if (!selectedItem) {
								return;
							}
							readData.IsLoadBase = itemColumnService.columnParentType;
							readData.businessPartnerId = selectedItem.BusinessPartnerFk;
							readData.compareColumns = selectedItem.Children;
						}
						var baseInfo = commonService.getBaseRfqInfo();
						readData.rfqHeaderFk = baseInfo.baseRfqId;
						readData.compareType = 1;
					}
				},
				dataProcessor: [],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData || {});
							return data.handleReadSucceeded(readData.Main, data);
						}
					}
				},
				entitySelection: {}
			};

			return platformDataServiceFactory.createNewComplete(serviceOption).service;
		}
	]);
})(angular);
