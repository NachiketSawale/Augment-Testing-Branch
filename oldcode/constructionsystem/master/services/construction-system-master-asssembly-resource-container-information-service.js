/*
 * $Id$
 * Created by Sahil on 13/04/2020.
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/**
     * @ngdoc service
     * @name ConstructionSystemMasterAssemblyResourceContainerInformationService
     * @function
     *
     * @description
     * Provides some information on all containers in the module.
     */

	angular.module(moduleName).factory('ConstructionSystemMasterAssemblyResourceContainerInformationService', ['$injector',
		function ($injector) {
			var service = {};
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case '574b34f0674d450ca9c696d9bd5c4ea7': // estimateMainEscalationCostChartController
						config.layout = $injector.get('constructionSystemMasterAssembliesResourceUIStandardService').getStandardConfigForListView();// estimateMainEscalationCostChartStandardConfigurationService
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'constructionSystemMasterAssembliesResourceUIStandardService';
						config.dataServiceName = 'constructionSystemMasterAssemblyResourceDataService'; // 'basicsIndexDetailService';//'constructionSystemMasterAssembliesResourceService';
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
