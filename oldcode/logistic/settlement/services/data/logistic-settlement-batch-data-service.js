/**
 * Created by baf on 27.06.2022
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementBatchDataService
	 * @description provides methods to access, create and update logistic settlement batch entities
	 */
	myModule.service('logisticSettlementBatchDataService', LogisticSettlementBatchDataService);

	LogisticSettlementBatchDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues'];

	function LogisticSettlementBatchDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSettlementConstantValues) {
		var self = this;
		var logisticSettlementBatchServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticSettlementBatchDataService',
				entityNameTranslationID: 'logistic.settlement.batchEntity',
				httpRead: {route: globals.webApiBaseUrl + 'logistic/settlement/batch/', endRead: 'list'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticSettlementConstantValues.schemes.batch)],
				entityRole: {root: {itemName: 'Batch', moduleName: 'cloud.desktop.moduleDisplayNameLogisticSettlement'}},
				entitySelection: { supportsMultiSelection: false },
				actions: {delete: false, create: false },
				presenter: {list: {}}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSettlementBatchServiceOption, self);
		serviceContainer.data.Initialised = true;

		this.loadBatches = function loadBatches() {
			return serviceContainer.data.doReadData(serviceContainer.data, true);
		};
	}
})(angular);
