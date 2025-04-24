/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionPlantPriceDataService
	 * @description pprovides methods to access, create and update logistic priceCondition plantPrice entities
	 */
	myModule.service('logisticPriceConditionPlantPriceDataService', LogisticPriceConditionPlantPriceDataService);

	LogisticPriceConditionPlantPriceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService'];

	function LogisticPriceConditionPlantPriceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, lpcValues, logisticPriceConditionDataService) {
		var self = this;
		var logisticPriceConditionPlantPriceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionPlantPriceDataService',
				entityNameTranslationID: 'logistic.pricecondition.plantPriceEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/plantprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.plantPrice)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticPriceConditionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantPrices', parentService: logisticPriceConditionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionPlantPriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionPlantPriceValidationService'
		}, lpcValues.schemes.plantPrice));
	}
})(angular);
