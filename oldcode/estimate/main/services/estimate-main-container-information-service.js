/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global _ */
	let estimateMainModule = angular.module('estimate.main');

	/**
	 * @ngdoc service
	 * @name changeMainContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	estimateMainModule.service('estimateMainContainerInformationService', EstimateMainContainerInformationService);

	EstimateMainContainerInformationService.$inject = ['$injector'];

	function EstimateMainContainerInformationService($injector) {
		let dynamicConfigurations = {};
		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			let layServ = null;
			switch (guid) {
				case '681223e37d524ce0b9bfa2294e18d650': // estimateMainLineItemListController
					layServ = $injector.get('estimateMainStandardConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'estimateMainStandardConfigurationService';
					config.dataServiceName = 'estimateMainService';
					config.validationServiceName = 'estimateMainValidationService';
					config.listConfig = {// Not complete!!
						initCalled: false, columns: [],
						type: 'lineItems'
					};
					break;
				case 'bedd392f0e2a44c8a294df34b1f9ce44': // estimateMainLineItemListController
					layServ = $injector.get('estimateMainResourceConfigurationService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'estimateMainResourceConfigurationService';
					config.dataServiceName = 'estimateMainResourceService';
					config.validationServiceName = 'estimateMainResourceValidationService';
					config.listConfig = {// Not complete!!
						initCalled: false, columns: [],
						parentProp: 'EstResourceFk',
						childProp: 'EstResources',
						childSort: true,
						type: 'resources'
					};
					break;

				// grouped imports from model.main
				case '3b5c28631ef44bb293ee05475a9a9513': // modelMainViewerLegendListController
				case 'd12461a0826a45f1ab76f53203b48ec6': // modelMainViewerLegendDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
					break;
				// For Estimate Main Escalation Cost Chart Container
				case '96b4926b9fb244b59e85e2642cc6fd5b': // estimateMainEscalationCostChartController
					config = $injector.get('EstimateMainEscalationCostChartContainerInformationService').getContainerInfoByGuid(guid);
					break;
				default:
					config = this.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}

			return config;
		};
		this.getNavigatorFieldByGuid = function getNavigatorByGuid(guid) {
			let navInfo = null;

			switch(guid) {
				case '681223e37d524ce0b9bfa2294e18d650': navInfo = { field: 'Code', navigator: { moduleName: 'estimate.main' } }; break;
			}

			return navInfo;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getDynamicConfig = function getDynamicConfig(guid) {
			return this.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
		};
	}
})(angular);

