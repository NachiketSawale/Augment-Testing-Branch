/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionSundryServicePriceDataService
	 * @description pprovides methods to access, create and update logistic priceCondition sundryServicePrice entities
	 */
	myModule.service('logisticPriceConditionSundryServicePriceDataService', LogisticPriceConditionSundryServicePriceDataService);

	LogisticPriceConditionSundryServicePriceDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService'];

	function LogisticPriceConditionSundryServicePriceDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, lpcValues, logisticPriceConditionDataService) {
		var self = this;
		var logisticPriceConditionSundryServicePriceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionSundryServicePriceDataService',
				entityNameTranslationID: 'logistic.pricecondition.sundryServicePriceEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/sundryserviceprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.sundryServicePrice)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticPriceConditionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'SundryServicePrices', parentService: logisticPriceConditionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionSundryServicePriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionSundryServicePriceValidationService'
		}, lpcValues.schemes.sundryServicePrice));
	}
})(angular);
