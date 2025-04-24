/**
 * Created by baf on 03.10.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementTransactionDataService
	 * @description pprovides methods to access, create and update logistic settlement chain entities
	 */
	myModule.service('logisticSettlementTransactionDataService', LogisticSettlementTransactionDataService);

	LogisticSettlementTransactionDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementDataService', 'logisticSettlementConstantValues'];

	function LogisticSettlementTransactionDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSettlementDataService, constValues) {
		var self = this;
		var logisticSettlementTransactionServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSettlementTransactionDataService',
				entityNameTranslationID: 'logistic.settlement.transactionEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/settlement/settlementtransaction/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticSettlementDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				// actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(constValues.schemes.transaction)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticSettlementDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					node: {itemName: 'Transactions', parentService: logisticSettlementDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSettlementTransactionServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSettlementTransactionValidationService'
		}, constValues.schemes.skillChain ));
	}
})(angular);
