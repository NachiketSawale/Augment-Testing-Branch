/**
 * Created by xai on 4/11/2018.
 */

(function(angular){
	'use strict';
	/* global globals */
	var moduleName = 'basics.materialcatalog';

	angular.module(moduleName).factory('basicsMaterialCatalogPriceVersion2CustomerService', basicsMaterialCatalogPriceVersion2CustomerService);

	basicsMaterialCatalogPriceVersion2CustomerService.$inject = ['platformDataServiceFactory', 'basicsMaterialCatalogPriceVersionService', 'basicsLookupdataLookupFilterService',
		'basicsMaterialCatalogPriceVersion2CustomerValidationService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService'];

	function basicsMaterialCatalogPriceVersion2CustomerService(platformDataServiceFactory, basicsMaterialCatalogPriceVersionService, basicsLookupdataLookupFilterService,
		basicsMaterialCatalogPriceVersion2CustomerValidationService, platformRuntimeDataService, basicsLookupdataLookupDescriptorService) {
		var serviceOptions = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsMaterialCatalogPriceVersion2CustomerService',
				entityRole: { leaf: {itemName: 'MaterialPriceVersion2Customer', parentService: basicsMaterialCatalogPriceVersionService}},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/materialcatalog/priceversion2customer/'
				},
				presenter: {list: {incorporateDataRead: incorporateDataRead,handleCreateSucceeded:function(item){
					if(0===item.BpdBusinesspartnerFk){
						item.BpdBusinesspartnerFk=null;
					}
				}}}
			}
		};
		var filters = [
			{
				key: 'mdc-material-catalog-customer-filter',
				serverSide: true,
				serverKey: 'project-main-project-customer-filter',
				fn: function (item) {
					return {
						BusinessPartnerFk: item.BpdBusinesspartnerFk !== null ? item.BpdBusinesspartnerFk : null,
						SubsidiaryFk: item.BpdSubsidiaryFk !== null ? item.BpdSubsidiaryFk : null
					};
				}
			},{
				key: 'mdc-material-catalog-customer-subsidiary-filter',
				serverSide: true,
				serverKey: 'businesspartner-main-subsidiary-common-filter',
				fn: function (currentItem) {
					return {
						BusinessPartnerFk: currentItem !== null ? currentItem.BpdBusinesspartnerFk : null,
						CustomerFk: currentItem !== null ? currentItem.BpdCustomerFk : null
					};
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);
		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		var service = serviceContainer.service;
		var data = serviceContainer.data;
		var validationService = basicsMaterialCatalogPriceVersion2CustomerValidationService(service);
		data.newEntityValidator = newEntityValidator();
		return service;

		// /////////////////////////
		function processItem(item) {
			if (item) {
				var result = validationService.validateBpFk(item, item.BpdBusinesspartnerFk, 'BpdBusinesspartnerFk');
				platformRuntimeDataService.applyValidationResult(result, item, 'BpdBusinesspartnerFk');
			}
		}

		function incorporateDataRead(readData, data) {
			if (readData) {
				basicsLookupdataLookupDescriptorService.attachData(readData);
				return serviceContainer.data.handleReadSucceeded(readData, data);
			}
			return serviceContainer.data.handleReadSucceeded(readData, data);
		}
		function newEntityValidator() {
			return {
				validate: function validate(newItem) {
					var result = validationService.validateBpdBusinesspartnerFk(newItem, newItem.BpdBusinesspartnerFk, 'BpdBusinesspartnerFk');
					platformRuntimeDataService.applyValidationResult(result, newItem, 'BpdBusinesspartnerFk');
				}
			};
		}
	}
})(angular);