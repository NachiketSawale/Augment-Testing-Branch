(function (angular) {

	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).factory('commonHistoricalPriceForBoqFactory', [
		'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService',
		'globals',
		function (
			platformDataServiceFactory,
			basicsLookupdataLookupDescriptorService,
			globals) {

			let searchFilter = {};
			let container = null;
			const srvOption = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'procurementPriceComparisonHistoricalPriceService',
					entityNameTranslationID: 'basics.common.historicalPrice.historicalPriceForItemContainerTitle',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/common/historicalprice/',
						endRead: 'boqitem',
						usePostForRead: true,
						initReadData: function (readData/* , data */) {
							angular.extend(readData, container.service.getSearchFilter());
						}
					},
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								basicsLookupdataLookupDescriptorService.attachData(readData || {});
								return container.data.handleReadSucceeded(readData.Main, data);
							}
						}
					}
				}
			};

			container = platformDataServiceFactory.createNewComplete(srvOption);
			const service = container.service;

			service.clearContent = function () {
				container.data.clearContent(container.data);
			};

			service.getSearchFilter = function () {
				return searchFilter;
			};

			service.setSearchFilter = function (filter) {
				searchFilter = filter;
			};

			service.clearSearchFilter = function () {
				searchFilter = {};
			};

			return service;
		}]);

})(angular);
