/**
 * Created by baf on 27.06.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementBatchValidationDataService
	 * @description pprovides methods to access, create and update logistic settlement batchValidation entities
	 */
	myModule.service('logisticSettlementBatchValidationDataService', LogisticSettlementBatchValidationDataService);

	LogisticSettlementBatchValidationDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues', 'logisticSettlementBatchDataService'];

	function LogisticSettlementBatchValidationDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSettlementConstantValues, logisticSettlementBatchDataService) {
		var self = this;
		var logisticSettlementBatchValidationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSettlementBatchValidationDataService',
				entityNameTranslationID: 'logistic.settlement.batchValidationEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/settlement/batchvalidation/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticSettlementBatchDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticSettlementConstantValues.schemes.batchvalidation)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticSettlementBatchDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'BatchValidation', parentService: logisticSettlementBatchDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSettlementBatchValidationServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
