(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.processconfiguration';

	angular.module(moduleName).factory('productionplanningProcessconfigurationContainerInformationService', ProcessConfigurationContainerInformationService);

	ProcessConfigurationContainerInformationService.$inject = ['$injector'];

	function ProcessConfigurationContainerInformationService($injector) {
		let service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};

			switch (guid) {
				case '3ed965bcbec84a29811bd0d8bd79598c': // Process Template List Controller
					config.layout = $injector.get('productionplanningProcessConfigurationProcessTemplateUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningProcessConfigurationProcessTemplateUIStandardService';
					config.dataServiceName = 'productionplanningProcessConfigurationProcessTemplateDataService';
					config.validationServiceName = 'productionplanningProcessConfigurationProcessTemplateValidationService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '080b54384d40404597ed4be6e66250e3': // Process Template Detail Controller
					config.layout = $injector.get('productionplanningProcessConfigurationProcessTemplateUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningProcessConfigurationProcessTemplateUIStandardService';
					config.dataServiceName = 'productionplanningProcessConfigurationProcessTemplateDataService';
					config.validationServiceName = 'productionplanningProcessConfigurationProcessTemplateValidationService';
					break;
				case '95c04d6098ee4917a511048567bd06f6':
					config.layout = $injector.get('ppsProcessConfigurationPhaseTemplateUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsProcessConfigurationPhaseTemplateUIStandardService';
					config.dataServiceName = 'ppsProcessConfigurationPhaseTemplateDataService';
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					config.validationServiceName = 'ppsProcessConfigurationPhaseTemplateValidationService';
					break;
				case '16109c4d63794f86812d51fbfe8eaedb':
					config = $injector.get('ppsProcessConfigurationPhaseTemplateUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'ppsProcessConfigurationPhaseTemplateUIStandardService';
					config.dataServiceName = 'ppsProcessConfigurationPhaseTemplateDataService';
					config.validationServiceName = 'ppsProcessConfigurationPhaseTemplateValidationService';
					break;
				case 'e15dcf861fdc40a4a9c277201fbfe424':
					config.layout = $injector.get('phaseReqTemplateUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'phaseReqTemplateUIStandardService';
					config.dataServiceName = 'phaseReqTemplateDataService';
					config.validationServiceName = 'phaseReqTemplateValidationService';
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case 'ca54a429c4d44e11b51e54ffa81eb75b':
					config = $injector.get('phaseReqTemplateUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'phaseReqTemplateUIStandardService';
					config.dataServiceName = 'phaseReqTemplateDataService';
					config.validationServiceName = 'phaseReqTemplateValidationService';
					break;
			}
			return config;
		};

		return service;
	}

})(angular);
