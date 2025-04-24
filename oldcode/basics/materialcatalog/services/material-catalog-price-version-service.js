/**
 * Created by chi on 5/25/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersionService', basicsMaterialCatalogPriceVersionService);

	basicsMaterialCatalogPriceVersionService.$inject = ['globals', 'platformDataServiceFactory', 'basicsMaterialCatalogService',
		'ServiceDataProcessDatesExtension',
		'basicsMaterialCatalogPriceVersionValidationService', 'platformRuntimeDataService'];

	function basicsMaterialCatalogPriceVersionService(globals, platformDataServiceFactory, basicsMaterialCatalogService,
		ServiceDataProcessDatesExtension,
		basicsMaterialCatalogPriceVersionValidationService, platformRuntimeDataService) {
		var serviceOptions = {
			flatNodeItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialCatalogPriceVersionService',
				dataProcessor: [
					new ServiceDataProcessDatesExtension(['ValidFrom', 'ValidTo', 'DataDate'],
						{processItem: processItem})
				],
				entityRole: { node: {itemName: 'MaterialPriceVersion', parentService: basicsMaterialCatalogService}},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/materialcatalog/priceversion/'
				},
				presenter: {},
				translation: {
					uid: 'basicsMaterialCatalogPriceVersionService',
					title: 'basics.materialcatalog.priceVersions',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: { typeName: 'MaterialPriceVersionDto', moduleSubModule: 'Basics.MaterialCatalog' }
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		var validationService = basicsMaterialCatalogPriceVersionValidationService(service);

		data.newEntityValidator = newEntityValidator();
		return service;

		// /////////////////////////////////
		function processItem(item) {
			if (item) {
				var result = validationService.validatePriceListFk(item, item.PriceListFk, 'PriceListFk');
				platformRuntimeDataService.applyValidationResult(result, item, 'PriceListFk');
			}
		}

		function newEntityValidator() {
			return {
				validate: function validate(newItem) {
					var result = validationService.validatePriceListFk(newItem, newItem.PriceListFk, 'PriceListFk');
					platformRuntimeDataService.applyValidationResult(result, newItem, 'PriceListFk');
				}
			};
		}
	}
})(angular);