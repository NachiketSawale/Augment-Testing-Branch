(function (angular) {

	'use strict';

	const moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonColumnDialogFactory', [
		'globals', 'platformDataServiceFactory', 'procurementPriceComparisonMainService', 'basicsLookupdataLookupDescriptorService', 'procurementPriceComparisonCommonService',
		function (globals, platformDataServiceFactory, mainDataService, basicsLookupdataLookupDescriptorService, commonService) {

			function createServiceContainer(parentService, options) {
				let opts = angular.extend({
					compareType: 1
				}, options);
				let serviceOption = {
					module: angular.module(moduleName),
					serviceName: 'procurementPriceComparisonColumnDialogFactory',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/',
						endRead: 'qtnheader',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							readData.compareColumns = parentService.getList();
							if (parentService.columnParentType === true) { // 'create base rfq'
								readData.IsLoadBase = parentService.columnParentType;
							} else {
								let selectedItem = parentService.getSelected();  // 'create changed rfq'
								if (!selectedItem) {
									return;
								}
								readData.IsLoadBase = parentService.columnParentType;
								readData.businessPartnerId = selectedItem.BusinessPartnerFk;
								readData.compareColumns = selectedItem.Children;
							}
							let baseInfo = commonService.getBaseRfqInfo();
							readData.rfqHeaderFk = baseInfo.baseRfqId;
							readData.compareType = opts.compareType;
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

			return {
				getServiceContainer: createServiceContainer
			};
		}
	]);
})(angular);
