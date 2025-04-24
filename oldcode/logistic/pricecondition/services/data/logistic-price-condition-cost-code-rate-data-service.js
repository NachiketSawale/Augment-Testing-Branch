/**
 * Created by baf on 24.08.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionCostCodeRateDataService
	 * @description pprovides methods to access, create and update logistic priceCondition CostCodeRate entities
	 */
	myModule.service('logisticPriceConditionCostCodeRateDataService', LogisticPriceConditionCostCodeRateDataService);

	LogisticPriceConditionCostCodeRateDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService'];

	function LogisticPriceConditionCostCodeRateDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, lpcValues, logisticPriceConditionDataService) {
		var self = this;
		var logisticPriceConditionCostCodeRateServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionCostCodeRateDataService',
				entityNameTranslationID: 'logistic.pricecondition.costCodeRateEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/costcoderate/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.costCodeRate)],
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
					leaf: {itemName: 'CostCodeRates', parentService: logisticPriceConditionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionCostCodeRateServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionCostCodeRateValidationService'
		}, lpcValues.schemes.costCodeRate ) );
	}
})(angular);
