/**
 * Created by lav on 7/11/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.cadimport';

	/**
	 * @ngdoc service
	 * @name productionplanningCadimportContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('productionplanningCadimportContainerInformationService', ContainerInformationService);

	ContainerInformationService.$inject = ['$injector', 'productionplanningDrawingComponentDataService',
		'productionplanningDrawingComponentUIStandardService'];

	function ContainerInformationService($injector, drawingComponentDataService,
										 drawingComponentUIStandardService) {

		var service = {};
		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			switch (guid) {
				case '887a4c2fg6594tft95e7e6c5brgf1f88':
					config = $injector.get('ppsEngineeringCadImportUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsEngineeringCadImportUIStandardService';
					config.dataServiceName = 'ppsCadimportDrawingDataService';
					config.validationServiceName = 'ppsEngineeringCadImportValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '887a4c2fg6594tft95e7e6c5brgf1f81':
					config.standardConfigurationService = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService').getService('forCadImportDrawing');
					config.dataServiceName = getProductDescService();
					config.listConfig = {initCalled: false, columns: []};
					config.ContainerType = 'Grid';
					break;
				case '887a4c2fg6594tft95e7e6c5brgf1f82':
					var dataService = drawingComponentDataService.getService(
						{
							serviceKey: 'productionplanning.engineering.cadImport.productdescription.component',
							parentService: getProductDescService(),
							useLocalResource: {key: 'cadImportProductTemplate'}
						}
					);
					config = {
						standardConfigurationService: drawingComponentUIStandardService.getService(dataService),
						dataServiceName: dataService
					};
					config.listConfig = {initCalled: false, columns: []};
					config.ContainerType = 'Grid';
					break;
				case '887a4c2fg6594tft95e7e6c5brgf1f83':
					var dataService = drawingComponentDataService.getService(
						{
							serviceKey: 'productionplanning.engineering.cadImport.component',
							parentService: 'ppsCadimportDrawingDataService',
							useLocalResource: {key: 'cadImportDrawing'}
						}
					);
					config = {
						standardConfigurationService: drawingComponentUIStandardService.getService(dataService),
						dataServiceName: dataService
					};
					config.listConfig = {initCalled: false, columns: []};
					config.ContainerType = 'Grid';
					break;
				case '887a4c2fg6594tft95e7e6c5brgf1f84':
					config.standardConfigurationService = $injector.get('productionplanningDrawingStackUIStandardService').getService('cadimport');
					config.dataServiceName = getStackService();
					config.listConfig = {initCalled: false, columns: []};
					config.ContainerType = 'Grid';
					break;
				case '887a4c2fg6594tft95e7e6c5brgf1f85':
					config.standardConfigurationService = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService').getService('forCadImportStack');
					config.dataServiceName = getProductDescService2();
					config.listConfig = {initCalled: false, columns: [], idProperty: 'UniqueId'};
					config.ContainerType = 'Grid';
					break;
				case '887a4c2fg6594tft95e7e6c5brgf1f89':
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsEngineeringCadImportLogUIStandardService';
					config.dataServiceName = 'ppsEngineeringCadImportLogDataService';
					config.listConfig = {initCalled: false, columns: []};
					break;
			}
			return config;
		};

		function getStackService() {
			return $injector.get('productionplanningDrawingStackDataService').getService({
				parentService: 'ppsCadimportDrawingDataService',
				useLocalResource: true
			});
		}

		function getProductDescService() {
			var para = {
				'serviceName': 'productionplanningCadImportProductDescriptionDataService',
				'parentService': 'ppsCadimportDrawingDataService',
				useLocalResource: {key: 'cadImportDrawing'},
				banSelectionChangedUpdate: true
			};
			return $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(para);
		}

		function getProductDescService2() {
			var para = {
				'serviceName': 'productionplanningCadImportStackProductDescriptionDataService',
				'parentService': getStackService(),
				'idProperty': 'UniqueId',
				useLocalResource: {key: 'cadImportStack'}
			};
			return $injector.get('productionplanningProducttemplateProductDescriptionDataServiceFactory').getService(para);
		}

		service.getParentServiceByParams = function (para) {
			if (para === 'productionplanningCadImportProductDescriptionDataService') {
				return getProductDescService();
			}
		};

		return service;
	}
})(angular);
