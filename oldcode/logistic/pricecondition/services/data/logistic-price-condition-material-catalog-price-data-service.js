/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionMaterialCatalogPriceDataService
	 * @description pprovides methods to access, create and update logistic priceCondition materialCatalogPrice entities
	 */
	myModule.service('logisticPriceConditionMaterialCatalogPriceDataService', LogisticPriceConditionMaterialCatalogPriceDataService);

	LogisticPriceConditionMaterialCatalogPriceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService'];

	function LogisticPriceConditionMaterialCatalogPriceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, lpcValues, logisticPriceConditionDataService) {
		var self = this;
		var logisticPriceConditionMaterialCatalogPriceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionMaterialCatalogPriceDataService',
				entityNameTranslationID: 'logistic.pricecondition.materialCatalogPriceEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/materialcatalogprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.materialCatalogPrice)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticPriceConditionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'MaterialCatalogPrices', parentService: logisticPriceConditionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionMaterialCatalogPriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionMaterialCatalogPriceValidationService'
		}, lpcValues.schemes.materialCatalogPrice));
	}
})(angular);
