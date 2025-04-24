(function (angular) {
	'use strict';
	var mainModule = angular.module('basics.procurementconfiguration');
	/**
	 * @ngdoc service
	 * @name basicsProcurementConfigurationContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	mainModule.service('basicsProcurementConfigurationContainerInformationService', BasicsProcurementConfigurationContainerInformationService);

	BasicsProcurementConfigurationContainerInformationService.$inject = ['$injector'];

	function BasicsProcurementConfigurationContainerInformationService($injector) {

		var self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			var uISerivce =  $injector.get('basicsProcurementConfigurationUIStandardService');
			var mainService = $injector.get('basicsProcurementConfigurationDataService');
			var validateService = $injector.get('basicsProcurementConfigurationValidationService');
			switch (guid) {
				case '375a4182f90f4085b1a1e528519aa384': //basicsProcurementConfiguration2Prj2TextTypeController
					// No second parameter, because in dynamic container it causes an error
					layServ = $injector.get('basicsProcurementConfiguration2Prj2TextTypeUIService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					self.addProcurementConfiguration2Prj2TextTypeInfos(config);
					config.listConfig = {initCalled: false, columns: []};
					break;

				case 'ecf49aee59834853b0f78ee871676e38': //basicsProcurementConfigurationListController
					layServ = $injector.get('basicsProcurementConfigurationUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.dataServiceName = 'basicsProcurementConfigurationDataService';
					config.validationServiceName = 'basicsProcurementConfigurationValidationService';
					var configService =  $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService,uISerivce,validateService,guid);
					config.standardConfigurationService = configService;
					break;
				case 'BA750EEF60E24B74808B5FDD6B49E2A7'://basicsProcurementConfigurationFormController
					layServ = $injector.get('basicsProcurementConfigurationUIStandardService');
					config.layout = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'basicsProcurementConfigurationUIStandardService';
					config.dataServiceName = 'basicsProcurementConfigurationDataService';
					config.validationServiceName = 'basicsProcurementConfigurationValidationService';
					var configServ =  $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService,uISerivce,validateService,'ecf49aee59834853b0f78ee871676e38');
					config.standardConfigurationService = configServ;
					break;
			}
			return config;
		};
		this.addProcurementConfiguration2Prj2TextTypeInfos = function addProcurementConfiguration2Prj2TextTypeInfos(config) {
			config.standardConfigurationService = 'basicsProcurementConfiguration2Prj2TextTypeUIService';
			config.dataServiceName = 'basicsProcurementConfiguration2Prj2TextTypeService';
			config.validationServiceName = 'basicsProcurementConfiguration2Prj2HeaderTextValidationService';
		};
	}
})(angular);