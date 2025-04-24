/**
 * Created by baf on 07.09.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionMaterialPriceDataService
	 * @description pprovides methods to access, create and update logistic priceCondition materialPrice entities
	 */
	myModule.service('logisticPriceConditionMaterialPriceDataService', LogisticPriceConditionMaterialPriceDataService);

	LogisticPriceConditionMaterialPriceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService'];

	function LogisticPriceConditionMaterialPriceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticPriceConditionConstantValues, logisticPriceConditionDataService) {
		var self = this;
		var logisticPriceConditionMaterialPriceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionMaterialPriceDataService',
				entityNameTranslationID: 'logistic.pricecondition.materialPriceEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/materialprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticPriceConditionConstantValues.schemes.materialPrice)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticPriceConditionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'MaterialPrices', parentService: logisticPriceConditionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionMaterialPriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionMaterialPriceValidationService'
		}, logisticPriceConditionConstantValues.schemes.materialPrice));
	}
})(angular);
