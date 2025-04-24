/**
 * Created by Nikhil on 31.08.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.pricecondition');

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionPlantCostCodeDataService
	 * @description provides methods to access, create and update logistic priceCondition plantCostCode entities
	 */
	myModule.service('logisticPriceConditionPlantCostCodeDataService', LogisticPriceConditionPlantCostCodeDataService);

	LogisticPriceConditionPlantCostCodeDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticPriceConditionConstantValues', 'logisticPriceConditionDataService','platformRuntimeDataService','platformPermissionService'];

	function LogisticPriceConditionPlantCostCodeDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, lpcValues, logisticPriceConditionDataService,logisticPriceConditionConstantValues,platformRuntimeDataService,platformPermissionService) {
		var self = this;
		var logisticPriceConditionPlantCostCodeServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticPriceConditionPlantCostCodeDataService',
				entityNameTranslationID: 'logistic.pricecondition.plantCostCodeEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/plantcostcode/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticPriceConditionDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(lpcValues.schemes.plantCostCode)

				],

				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticPriceConditionDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PlantCostCode', parentService: logisticPriceConditionDataService}
				},
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticPriceConditionPlantCostCodeServiceOption, self);
		serviceContainer.data.Initialised = true;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticPriceConditionPlantCostCodeValidationService'
		}, lpcValues.schemes.plantCostCode) );
	}
})(angular);
