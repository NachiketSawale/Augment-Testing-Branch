/**
 * Created by baf on 13.02.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettledProjectChangeItemDataService
	 * @description provides methods to access, create and update logistic settlement batch entities
	 */
	myModule.service('logisticSettledProjectChangeItemDataService', LogisticSettledProjectChangeItemDataService);

	LogisticSettledProjectChangeItemDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues'];

	function LogisticSettledProjectChangeItemDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSettlementConstantValues) {
		var self = this;
		var logisticSettledProjectChangeItemDataServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSettledProjectChangeItemDataService',
				entityNameTranslationID: 'logistic.settlement.settledProjectChangeItem',
				httpRead: {route: globals.webApiBaseUrl + 'logistic/settlement/settledprojectchange/', endRead: 'list'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticSettlementConstantValues.schemes.batch)],
				entityRole: {leaf: {itemName: 'ProjectChangeItem', moduleName: 'cloud.desktop.moduleDisplayNameLogisticSettlement'}},
				entitySelection: { supportsMultiSelection: false },
				actions: {delete: false, create: false },
				presenter: {list: {}}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSettledProjectChangeItemDataServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
