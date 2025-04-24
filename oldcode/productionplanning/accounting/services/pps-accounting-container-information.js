/**
 * Created by anl on 4/3/2019.
 */


(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).factory('productionplanningAccountingContainerInformationService', PpsAccountingContainerInformationService);

	PpsAccountingContainerInformationService.$inject = ['$injector'];

	function PpsAccountingContainerInformationService($injector) {

		var service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layoutService = null;
			switch (guid) {

				case 'fcdf2e62fb8848bc99dd1a52fdbdf47f': //RuleSet ListController
					layoutService = $injector.get('productionplanningAccountingRuleSetUIStandardService');
					config.layout = layoutService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningAccountingRuleSetUIStandardService';
					config.dataServiceName = 'productionplanningAccountingRuleSetDataService';
					config.validationServiceName = 'productionpalnningAccountingRuleSetValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '8995c131011941258ff7bde43ab47773': //RuleSet DetailController
					layoutService = $injector.get('productionplanningAccountingRuleSetUIStandardService');
					config = layoutService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningAccountingRuleSetUIStandardService';
					config.dataServiceName = 'productionplanningAccountingRuleSetDataService';
					config.validationServiceName = 'productionpalnningAccountingRuleSetValidationService';
					break;
				case 'ad340a997e8b4ad2876dfdd9d2670656': //Rule ListController
					layoutService = $injector.get('productionplanningAccountingRuleUIStandardService');
					config.layout = layoutService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningAccountingRuleUIStandardService';
					config.dataServiceName = 'productionplanningAccountingRuleDataService';
					config.validationServiceName = 'productionpalnningAccountingRuleValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '0689edc8f3d64cc78ded0a987c10b55d': //Rule DetailController
					layoutService = $injector.get('productionplanningAccountingRuleUIStandardService');
					config = layoutService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningAccountingRuleUIStandardService';
					config.dataServiceName = 'productionplanningAccountingRuleDataService';
					config.validationServiceName = 'productionpalnningAccountingRuleValidationService';
					break;
				case '464c261c2b7d4111b6717aa2c13b2e82': //Result ListController
					layoutService = $injector.get('productionplanningAccountingResultUIStandardService');
					config.layout = layoutService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningAccountingResultUIStandardService';
					config.dataServiceName = 'productionplanningAccountingResultDataService';
					config.validationServiceName = 'productionpalnningAccountingResultValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '6c2687e407024b338f354bc8b250ab98': //Result DetailController
					layoutService = $injector.get('productionplanningAccountingResultUIStandardService');
					config = layoutService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningAccountingResultUIStandardService';
					config.dataServiceName = 'productionplanningAccountingResultDataService';
					config.validationServiceName = 'productionpalnningAccountingResultValidationService';
					break;
			}

			return config;
		};

		return service;
	}
})(angular);