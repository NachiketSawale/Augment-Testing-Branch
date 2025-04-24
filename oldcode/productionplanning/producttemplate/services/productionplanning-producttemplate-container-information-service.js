(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.producttemplate';

	angular.module(moduleName).factory('productionplanningProductTemplateContainerInformationService', ContainerInformationService);

	ContainerInformationService.$inject = ['$injector'];

	function ContainerInformationService($injector) {
		let service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			let mainService = $injector.get('productionplanningProducttemplateMainService');
			let uiService = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService');
			let validationService = $injector.get('productionplanningProducttemplateProductDescriptionValidationService');
			switch (guid) {
				case 'ff4c323cfd0e4a5692f923110b8ffb00': // product template list controller
					config.layout = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.dataServiceName = 'productionplanningProducttemplateMainService';
					config.validationServiceName = 'productionplanningProducttemplateProductDescriptionValidationService';
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '32b419bf9fcc4069910e4b9396239780': // product template detail controller
					config.layout = $injector.get('productionplanningProducttemplateProductDescriptionUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.dataServiceName = 'productionplanningProducttemplateMainService';
					config.validationServiceName = 'productionplanningProducttemplateProductDescriptionValidationService';
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, 'ff4c323cfd0e4a5692f923110b8ffb00');
					break;
				case '35f1b07f15924d92992ea6f2f3b2fb30':
					config = {
						mainService: mainService,
						parentService: $injector.get('productionplanningTemplatesProductDataService'),
						enableCache: true,
						foreignKey: 'BasClobsFk',
						readonly: true
					};
					break;
			}

			return config;
		};

		return service;
	}

})(angular);
