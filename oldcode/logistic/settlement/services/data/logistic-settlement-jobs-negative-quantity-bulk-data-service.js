/**
 * Created by chin-han.lai on 08/09/2023
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticSettlementJobsNegativeQuantityBulkDataService
	 * @description pprovides methods to access, create and update logistic settlement BulkNegativeLocationsVEntity entities
	 */
	myModule.service('logisticSettlementJobsNegativeQuantityBulkDataService', LogisticSettlementJobsNegativeQuantityBulkDataService);

	LogisticSettlementJobsNegativeQuantityBulkDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues','platformRuntimeDataService', 'logisticSettlementReadOnlyProcessorService'];

	function LogisticSettlementJobsNegativeQuantityBulkDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSettlementConstantValues, platformRuntimeDataService, logisticSettlementReadOnlyProcessorService) {
		let self = this;
		let logisticSettlementJobsNegativeQuantityBulkServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticSettlementJobsNegativeQuantityBulkDataService',
				entityNameTranslationID: 'logistic.settlement.jobsNegativeQuantityBulk',
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/settlement/jobsNegativeQuantityBulk/',
					endRead: 'list',
				},
				dataProcessor: [],
				entityRole: {
					root: {itemName: 'JobsNegativeQuantityBulk', moduleName: 'cloud.desktop.moduleDisplayNameLogisticSettlement'}
				},
				actions: {delete: false, create: false },
				presenter: {list: {}}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticSettlementJobsNegativeQuantityBulkServiceOption,self);
		serviceContainer.data.Initialised = false;

		this.refresh = function refresh() {
			return serviceContainer.data.doReadData(serviceContainer.data, true);
		};
	}
})(angular);
