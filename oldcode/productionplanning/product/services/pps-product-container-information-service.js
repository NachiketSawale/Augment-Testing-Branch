(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('productionplanningProductContainerInformationService', ContainerInformationService);

	ContainerInformationService.$inject = ['$injector'];

	function ContainerInformationService($injector) {
		let service = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			let mainService = $injector.get('productionplanningProductMainService');
			let uiService = $injector.get('productionplanningCommonProductUIStandardService');
			let validationService = $injector.get('productionplanningCommonProductValidationFactory');
			switch (guid) {
				case '434794d7bfbb4c9c8aeb4df85eb602d0': // product list controller
					config.layout = $injector.get('productionplanningCommonProductUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.dataServiceName = 'productionplanningProductMainService';
					config.validationServiceName = 'productionplanningCommonProductValidationFactory';
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case 'cf6ed0df37b34b68a5190b375eabe91f': // product detail controller
					config.layout = $injector.get('productionplanningCommonProductUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.dataServiceName = 'productionplanningProductMainService';
					config.validationServiceName = 'productionplanningCommonProductValidationFactory';
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, '434794d7bfbb4c9c8aeb4df85eb602d0');
					break;
				case '92e45c26b45f4637980c0ba38bf8cd31': // production unit: product list controller
					config.layout = $injector.get('productionplanningCommonProductUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.dataServiceName = 'productionplanningCommonProductItemDataService';
					config.validationServiceName = 'productionplanningCommonProductValidationFactory';
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					break;
				case '10086dab68ab43bd81d91aa034f028a5': // production unit: product detail controller
					config.layout = $injector.get('productionplanningCommonProductUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.dataServiceName = 'productionplanningCommonProductItemDataService';
					config.validationServiceName = 'productionplanningCommonProductValidationFactory';
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, '92e45c26b45f4637980c0ba38bf8cd31');
					break;
				case '10a65fdf5dbf47988ccc2ad2ebea58a7': // product rack assignment list
					config.layout = $injector.get('ppsProductRackassignmentUIService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.dataServiceName = 'ppsProductRackassignmentDataService';
					config.validationServiceName = 'ppsProductRackassignmentValidationService';
					config.standardConfigurationService = 'ppsProductRackassignmentUIService';
					config.listConfig = {
						initCalled: false,
						grouping: true
					};
					break;
				case '63e34d5075134192a1fd8ea4d2e0e47d':
					config = {
						mainService: mainService,
						parentService: mainService,
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
