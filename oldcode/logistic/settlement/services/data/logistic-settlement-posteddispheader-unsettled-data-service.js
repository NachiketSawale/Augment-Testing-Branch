/**
 * Created by shen on 9/5/2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	let myModule = angular.module('logistic.settlement');

	/**
	 * @ngdoc service
	 * @name logisticPostedDispHeaderUnsettledDataService
	 * @description provides methods to access, create and update logistic posted but unsettled dispatch header entities
	 */
	myModule.service('logisticPostedDispHeaderUnsettledDataService', LogisticPostedDispHeaderUnsettledDataService);

	LogisticPostedDispHeaderUnsettledDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSettlementConstantValues', 'platformRuntimeDataService'];

	function LogisticPostedDispHeaderUnsettledDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
												basicsCommonMandatoryProcessor, logisticSettlementConstantValues, platformRuntimeDataService) {
		let self = this;
		let logisticSettlementPostedDispHeaderUnsettledServiceOption = {
			flatRootItem: {
				module: myModule,
				serviceName: 'logisticPostedDispHeaderUnsettledDataService',
				entityNameTranslationID: 'logistic.settlement.postedDNUnsettledEntity',
				httpRead: {route: globals.webApiBaseUrl + 'logistic/settlement/postedheadernotsettled/', endRead: 'listposteddipheader'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(logisticSettlementConstantValues.schemes.postedDispHeaderNotSettled),
					{processItem: (item) => { platformRuntimeDataService.readonly(item, true); }}],
				entityRole: {root: {itemName: 'PostedDispHeaderUnsettled', moduleName: 'cloud.desktop.moduleDisplayNameLogisticSettlement'}},
				entitySelection: { supportsMultiSelection: false },
				actions: {delete: false, create: false },
				presenter: {list: {}}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(logisticSettlementPostedDispHeaderUnsettledServiceOption, self);
		serviceContainer.data.Initialised = true;

		this.loadPostedDispHeaderUnsettled = function loadPostedDispHeaderUnsettled() {
			return serviceContainer.data.doReadData(serviceContainer.data, true);
		};
	}
})(angular);
