(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonBoqColumnDialogService
	 * @function
	 * @requires procurementPriceComparisonMainService
	 *
	 * @description
	 * #
	 * data service of pricecomparison column dialog controller
	 */
	angular.module(moduleName).factory('procurementPriceComparisonBoqColumnDialogService', [
		'globals', 'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonBoqColumnService', 'procurementPriceComparisonCommonService',
		function (globals, platformDataServiceFactory, lookupDescriptorService, boqColumnService, commonService) {
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonBoqColumnDialogService',
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/',
					endRead: 'qtnheader',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var baseInfo = commonService.getBaseRfqInfo();
						readData.rfqHeaderFk = baseInfo.baseRfqId;
						readData.compareType = 2;

						readData.isLoadBase = boqColumnService.isLoadBase;
						if (boqColumnService.isLoadBase) {
							readData.compareColumns = boqColumnService.getTree(); // exclude exsied base quotes
						} else {
							// for get change quote columns
							var selectedItem = boqColumnService.getSelected();
							readData.compareColumns = selectedItem.Children;  // exclude exsied change quotes

							var qtnHeader = _.find(lookupDescriptorService.getData('Quote'), {Id: selectedItem.QtnHeaderFk});
							readData.BusinessPartnerId = qtnHeader ? qtnHeader.BusinessPartnerFk : -1;
						}
					}
				},
				dataProcessor: [],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							lookupDescriptorService.attachData(readData || {});
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
