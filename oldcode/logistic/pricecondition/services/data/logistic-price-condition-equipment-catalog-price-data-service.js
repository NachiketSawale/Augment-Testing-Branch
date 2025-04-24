/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionEquipmentCatalogPriceDataService
	 * @description pprovides methods to access, create and update logistic priceCondition equipmentCatalogPrice entities
	 */
	myModule.service('logisticPriceConditionEquipmentCatalogPriceDataService', LogisticPriceConditionEquipmentCatalogPriceDataService);

	LogisticPriceConditionEquipmentCatalogPriceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService'];

	function LogisticPriceConditionEquipmentCatalogPriceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor,  lpcValues, logisticPriceConditionDataService) {
		var self = this;
		var logisticPriceConditionEquipmentCatalogPriceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionEquipmentCatalogPriceDataService',
				entityNameTranslationID: 'logistic.pricecondition.equipmentCatalogPriceEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/equipmentcatalogprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.plantCatalogPrice)],
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticPriceConditionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'EquipmentCatalogPrices', parentService: logisticPriceConditionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionEquipmentCatalogPriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionEquipmentCatalogPriceValidationService'
		}, lpcValues.schemes.plantCatalogPrice ) );
	}
})(angular);
