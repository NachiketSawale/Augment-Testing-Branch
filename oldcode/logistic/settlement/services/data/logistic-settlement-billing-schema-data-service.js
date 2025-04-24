/**
 * Created by baf on 01.04.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementBillingSchemaDataService
	 * @description pprovides methods to access, create and update logistic settlement billingSchema entities
	 */
	myModule.service('logisticSettlementBillingSchemaDataService', LogisticSettlementBillingSchemaDataService);

	LogisticSettlementBillingSchemaDataService.$inject = ['$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues', 'logisticSettlementDataService', 'logisticSettlementBillingSchemaReadOnlyProcessor'];

	function LogisticSettlementBillingSchemaDataService($http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	  basicsCommonMandatoryProcessor, logisticSettlementConstantValues, logisticSettlementDataService, logisticSettlementBillingSchemaReadOnlyProcessor) {

		var self = this;
		var logisticSettlementBillingSchemaServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSettlementBillingSchemaDataService',
				entityNameTranslationID: 'logistic.settlement.billingSchemaEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/settlement/billingSchema/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticSettlementDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false },
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticSettlementConstantValues.schemes.billingSchema),
					logisticSettlementBillingSchemaReadOnlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticSettlementDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'BillingSchemas', parentService: logisticSettlementDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSettlementBillingSchemaServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSettlementBillingSchemaValidationService'
		}, logisticSettlementConstantValues.schemes.billingSchema));

		serviceContainer.service.recalculateBillingSchema = function recalculateBillingSchema(){
			var settlementId = logisticSettlementDataService.getSelected().Id;
			return $http.get(serviceContainer.data.httpReadRoute + 'recalculate?mainItemId=' + settlementId).then(function(response) {
				if (serviceContainer.data.onReadSucceeded) {
					return serviceContainer.data.onReadSucceeded(response.data, serviceContainer.data);
				}
				return response.data;
			});
		};
	}
})(angular);
