/**
 * Created by lav on 7/11/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.cadimportconfig';

	/**
	 * @ngdoc service
	 * @name productionplanningCadimportconfigContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('productionplanningCadimportconfigContainerInformationService', ContainerInformationService);

	ContainerInformationService.$inject = ['$injector', 'ppsEngineeringCadImportConfigDataService', 'ppsEngineeringCadValidationDataService'];

	function ContainerInformationService($injector, ppsEngineeringCadImportConfigDataService, ppsEngineeringCadValidationDataService) {

		var service = {};
		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case '66yh4c988b634bf4hfb9bff0d6dfb111'://ppsEngineeringCadImportConfigListController
					config = $injector.get('ppsEngineeringCadImportConfigUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsEngineeringCadImportConfigUIStandardService';
					config.dataServiceName = 'ppsEngineeringCadImportConfigDataService';
					config.validationServiceName = 'ppsEngineeringCadImportConfigValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '66yh4c988b634bf4hfb9bff0d6dfb112'://ppsEngineeringCadImportDetailController
					config = $injector.get('ppsEngineeringCadImportConfigUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'ppsEngineeringCadImportConfigUIStandardService';
					config.dataServiceName = 'ppsEngineeringCadImportConfigDataService';
					config.validationServiceName = 'ppsEngineeringCadImportConfigValidationService';
					break;
				case '77yh4c988b634bf4hfb9bff0d6dfb112'://ppsEngineeringCadValidationListController
					config = $injector.get('ppsEngineeringCadValidationUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsEngineeringCadValidationUIStandardService';
					config.dataServiceName = 'ppsEngineeringCadValidationDataService';
					config.validationServiceName = 'ppsEngineeringCadValidationValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '88yh4c988b634bf4hfb9bff0d6dfb112':
					config = {
						mainService: ppsEngineeringCadImportConfigDataService,
						parentService: ppsEngineeringCadImportConfigDataService,
						enableCache: true,
						foreignKey: 'BasClobConfigFk'
					};
					break;
				case '99yh4c988b634bf4hfb9bff0d6dfb112':
					config = {
						mainService: ppsEngineeringCadImportConfigDataService,
						parentService: ppsEngineeringCadValidationDataService,
						enableCache: true,
						foreignKey: 'BasClobParamFk'
					};
					break;
			}
			return config;
		};
		return service;
	}
})(angular);