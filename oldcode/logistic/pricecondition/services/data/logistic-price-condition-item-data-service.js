/**
 * Created by baf on 01.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionItemDataService
	 * @description pprovides methods to access, create and update logistic priceCondition item entities
	 */
	myModule.service('logisticPriceConditionItemDataService', LogisticPriceConditionItemDataService);

	LogisticPriceConditionItemDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService'];

	function LogisticPriceConditionItemDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, lpcValues, logisticPriceConditionDataService) {
		var self = this;
		var logisticPriceConditionItemServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionItemDataService',
				entityNameTranslationID: 'logistic.pricecondition.priceConditionItemEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/item/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.priceConditionItem)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticPriceConditionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PriceConditionItems', parentService: logisticPriceConditionDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionItemServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionItemValidationService'
		}, lpcValues.schemes.priceConditionItem));
	}
})(angular);
