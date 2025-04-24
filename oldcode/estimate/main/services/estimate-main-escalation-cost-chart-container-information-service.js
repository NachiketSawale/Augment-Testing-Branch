/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name EstimateMainEscalationCostChartContainerInformationService
     * @function
     *
     * @description
     * Provides some information on all containers in the module.
     */

	angular.module(moduleName).factory('EstimateMainEscalationCostChartContainerInformationService', ['$injector',
		function ($injector) {
			let service = {};
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				switch (guid) {
					case '96b4926b9fb244b59e85e2642cc6fd5b': // estimateMainEscalationCostChartController
						config.layout = $injector.get('estimateMainEscalationCostChartUIStandardService').getStandardConfigForListView();// estimateMainEscalationCostChartStandardConfigurationService
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'estimateMainEscalationCostChartUIStandardService';
						config.dataServiceName = 'estimateMainEscalationCostChartService';
						config.validationServiceName = null;
						config.listConfig = {
							initCalled: false,
							grouping: true
						};
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);
