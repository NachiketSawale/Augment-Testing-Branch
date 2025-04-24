/**
 * Created by chi on 5/25/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersion2CompanyService', basicsMaterialCatalogPriceVersion2CompanyService);

	basicsMaterialCatalogPriceVersion2CompanyService.$inject = ['platformDataServiceFactory', 'basicsMaterialCatalogPriceVersionService', 'basicsLookupdataLookupFilterService',
		'basicsMaterialCatalogPriceVersion2CompanyValidationService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService'];

	function basicsMaterialCatalogPriceVersion2CompanyService(platformDataServiceFactory, basicsMaterialCatalogPriceVersionService, basicsLookupdataLookupFilterService,
		basicsMaterialCatalogPriceVersion2CompanyValidationService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService) {
		var serviceOptions = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialCatalogPriceVersion2CompanyService',
				dataProcessor: [{ processItem: processItem }],
				entityRole: { leaf: {itemName: 'MaterialPriceVersion2Company', parentService: basicsMaterialCatalogPriceVersionService}},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/materialcatalog/priceversion2company/'
				},
				presenter: {list: {incorporateDataRead: incorporateDataRead}}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var filters = [
			{
				key: 'basics-materialcatalog-price-version-to-company-company-filter',
				fn: function (item) {
					var catalogItem = basicsMaterialCatalogPriceVersionService.parentService().getSelected();
					if (catalogItem) {
						return item.ContextFk === catalogItem.MdcContextFk;
					}
					return false;
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		var validationService = basicsMaterialCatalogPriceVersion2CompanyValidationService(service);
		return service;

		///////////////////////////
		function processItem(item) {
			if (item) {
				var result = validationService.validateCompanyFk(item, item.CompanyFk, 'CompanyFk');
				platformRuntimeDataService.applyValidationResult(result, item, 'CompanyFk');
			}
		}

		function incorporateDataRead(readData, data) {
			if (readData.Main) {
				basicsLookupdataLookupDescriptorService.attachData(readData);
				return serviceContainer.data.handleReadSucceeded(readData.Main, data);
			}
			return serviceContainer.data.handleReadSucceeded(readData, data);
		}
	}
})(angular);