/**
 * Created by anl on 6/5/2019.
 */


(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionplanningEventconfigurationContainerInformationService', EventconfigurationContainerInformationService);

	EventconfigurationContainerInformationService.$inject = ['$injector'];

	function EventconfigurationContainerInformationService($injector) {

		var service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layoutService = null;
			switch (guid) {

				case 'd92b42daf3f44472b6bce0b2d5369be9': //EventSequenceConfig ListController
					layoutService = $injector.get('productionplanningEventconfigurationSequenceUIStandardService');
					config.layout = layoutService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningEventconfigurationSequenceUIStandardService';
					config.dataServiceName = 'productionplanningEventconfigurationSequenceDataService';
					config.validationServiceName = 'productionpalnningEventconfigurationSequenceValidationService';
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '55bad685d9ea42e292d6b7521e3b4d3e': //EventSequenceConfig DetailController
					layoutService = $injector.get('productionplanningEventconfigurationSequenceUIStandardService');
					config = layoutService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningEventconfigurationSequenceUIStandardService';
					config.dataServiceName = 'productionplanningEventconfigurationSequenceDataService';
					config.validationServiceName = 'productionpalnningEventconfigurationSequenceValidationService';
					break;
				case '8c63d8f33a0b4e4bad6883ca6416dfae': //EventTemplate ListController
					layoutService = $injector.get('productionplanningEventconfigurationTemplateUIStandardService');
					config.layout = layoutService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningEventconfigurationTemplateUIStandardService';
					config.dataServiceName = 'productionplanningEventconfigurationTemplateDataService';
					config.validationServiceName = 'productionpalnningEventconfigurationTemplateValidationService';
					config.listConfig = {
						initCalled: false,
						columns: []
					};
					break;
				case '768ac08d96d54bc0aefa6c3ef999b2c1': //EventTemplate DetailController
					layoutService = $injector.get('productionplanningEventconfigurationTemplateUIStandardService');
					config = layoutService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningEventconfigurationTemplateUIStandardService';
					config.dataServiceName = 'productionplanningEventconfigurationTemplateDataService';
					config.validationServiceName = 'productionpalnningEventconfigurationTemplateValidationService';
					break;
			}

			return config;
		};

		return service;
	}
})(angular);