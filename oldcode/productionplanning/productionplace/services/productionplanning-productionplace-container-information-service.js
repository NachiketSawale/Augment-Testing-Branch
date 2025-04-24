/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const productionplanningProductionPlaceModule = angular.module('productionplanning.productionplace');

	productionplanningProductionPlaceModule.factory('productionplanningProductionPlaceContainerInformationService', containerInformationService);

	containerInformationService.$inject = ['$injector', 'ppsCommonClipboardService'];

	function containerInformationService($injector, ppsCommonClipboardService) {
		const service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			const config = {};

			switch (guid) {
				case '7347596478124456a18f0e78983aa34c': // production place list controller
					config.dataServiceName = 'ppsProductionPlaceDataService';
					config.standardConfigurationService = $injector.get('ppsProductionPlaceUIService');
					config.layout = config.standardConfigurationService.getStandardConfigForListView();
					config.validationServiceName = getValidationService(config.dataServiceName);
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: [],
						type: 'productionplanning.productionplace',
						dragDropService: ppsCommonClipboardService
					};
					break;
				case 'c90b8ae405594dfa92b543efbab6918e': // production place detail controller
					config.dataServiceName = 'ppsProductionPlaceDataService';
					config.standardConfigurationService = $injector.get('ppsProductionPlaceUIService');
					config.layout = config.standardConfigurationService.getStandardConfigForListView();
					config.validationServiceName = getValidationService(config.dataServiceName);
					config.ContainerType = 'Detail';
					break;
				case '5b884ca39c5c4c6f873a4875be65b0e5': // maintenance list controller
					config.dataServiceName = 'ppsMaintenanceDataService';
					config.standardConfigurationService = $injector.get('ppsMaintenanceUIStandardService');
					config.layout = config.standardConfigurationService.getStandardConfigForListView();
					config.validationServiceName = 'ppsMaintenanceValidationService';
					config.ContainerType = 'Grid';
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '361eade4e402458c851bf96fd0dcdc55': // maintenance detail controller
					config.dataServiceName = 'ppsMaintenanceDataService';
					config.standardConfigurationService = $injector.get('ppsMaintenanceUIStandardService');
					config.layout = config.standardConfigurationService.getStandardConfigForListView();
					config.validationServiceName = 'ppsMaintenanceValidationService';
					config.ContainerType = 'Detail';
					break;
			}


			function getValidationService(dataServiceName) {
				const validationFactory = $injector.get('ppsProductionPlaceValidationServiceFactory');
				const dataService = $injector.get(dataServiceName);
				return validationFactory.getValidationService(dataService);
			}

			return config;
		};

		return service;
	}

})(angular);
