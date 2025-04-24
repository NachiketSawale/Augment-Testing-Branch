(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.ppsmaterial';

	/**
     * @ngdoc service
     * @name productionplanningPpsmaterialContainerInformationService
     * @function
     *
     * @description
     *
     */

	angular.module(moduleName).factory('productionplanningPpsmaterialContainerInformationService', productionplanningPpsmaterialContainerInformationService);

	productionplanningPpsmaterialContainerInformationService.$inject = ['$injector',
		'productionplanningPpsMaterialProductDescUIStandardService',
		'productionplanningPpsMaterialProductDescParameterUIStandardService'];

	function productionplanningPpsmaterialContainerInformationService($injector,
		productDescUIStdService,
		paramUIStdService) {

		let service = {};
		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			let config = {};
			let mainService = $injector.get('productionplanningPpsMaterialRecordMainService');
			let uiService = $injector.get('productionplanningPpsMaterialUIStandardService');
			let validationService = $injector.get('productionplanningPpsMaterialValidationService');
			switch (guid) {
				case '1ed6d6955a20488e83c10c1c76326275':// productionplanningPpsmaterialRecordListController
					config = $injector.get('basicsMaterialRecordUIConfigurationService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.dataServiceName = 'productionplanningPpsMaterialRecordMainService';
					config.validationServiceName = 'basicsMaterialRecordValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					break;
				case 'ef4562bf23b54fcba3f84643bd64212c':// productionplanningPpsmaterialRecordDetailController
					config = $injector.get('basicsMaterialRecordUIConfigurationService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.dataServiceName = 'productionplanningPpsMaterialRecordMainService';
					config.validationServiceName = 'basicsMaterialRecordValidationService';
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, '1ed6d6955a20488e83c10c1c76326275');
					break;
				case '4f92e30bd24849b4bf2f6db12e83afde': //productionplanningPpsmaterialProductdescListController
					config = productDescUIStdService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningPpsMaterialProductDescUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialProductDescDataService';
					config.validationServiceName = $injector.get('productionplanningPpsMaterialProductDescValidationService').getService();
					config.listConfig = {
						initCalled: false
					};
					break;
				case '211110394b224dd392b69c5b60fe4e80':// productionplanningPpsmaterialProductdescDetailController
					config = productDescUIStdService.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningPpsMaterialProductDescUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialProductDescDataService';
					config.validationServiceName = $injector.get('productionplanningPpsMaterialProductDescValidationService').getService();
					break;
				case '3a0ff92d9fc74bc691845427bf566bd3':// productionplanningPpsmaterialProductdescParameterListController
					config = paramUIStdService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningPpsMaterialProductDescParameterUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialProductDescParameterDataService';
					config.validationServiceName = $injector.get('productionplanningPpsMaterialProductDescParameterValidationService').getService();
					config.listConfig = {
						initCalled: false,
						// grouping: true,
						// enableColumnReorder: false,
						enableConfigSave: false// ,
						// idProperty: 'idString'
					};
					break;
				case '43d8655f5b7b4357a3b3a7839ce7243b':// productionplanningPpsmaterialEventTypeListController
					config = $injector.get('productionplanningPpsMaterialEventTypeUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningPpsMaterialEventTypeUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialEventTypeDataService';
					config.validationServiceName = 'productionplanningPpsMaterialEventTypeValidationService';
					config.listConfig = {
						initCalled: false,
						// grouping: true,
						// enableColumnReorder: false,
						enableConfigSave: false// ,
						// idProperty: 'idString'
					};
					break;
				case '0de5eadccc3f47d98ff39b2af6d6dd2c':// productionplanningPpsmaterialEventTypeDetailController
					config = $injector.get('productionplanningPpsMaterialEventTypeDataService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningPpsMaterialEventTypeUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialEventTypeDataService';
					config.validationServiceName = 'productionplanningPpsMaterialEventTypeValidationService';
					break;


				case '5ea20e4b3d0f40399bbf006633500b26':// productionplanningPpsmaterialPpsEventTypeRelationListController
					config = $injector.get('productionplanningPpsMaterialPpsEventTypeRelationUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningPpsMaterialPpsEventTypeRelationUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialPpsEventTypeRelationDataService';
					config.validationServiceName = 'productionplanningPpsMaterialPpsEventTypeRelationValidationService';
					config.listConfig = {
						initCalled: false,
						// grouping: true,
						// enableColumnReorder: false,
						enableConfigSave: false// ,
						// idProperty: 'idString'
					};
					break;
				case 'de0bbc30b6954aec9ed0abf0c66b4130':// productionplanningPpsmaterialPpsEventTypeRelationDetailController
					config = $injector.get('productionplanningPpsMaterialPpsEventTypeRelationUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningPpsMaterialPpsEventTypeRelationUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialPpsEventTypeRelationDataService';
					config.validationServiceName = 'productionplanningPpsMaterialPpsEventTypeRelationValidationService';
					break;
				case '6727ab5728gb492d8612gv47e73dgh90':// ppsCadToMaterialListController
					config = $injector.get('ppsCadToMaterialUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsCadToMaterialUIStandardService';
					config.dataServiceName = 'ppsCadToMaterialDataService';
					config.validationServiceName = 'ppsCadToMaterialValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case '7727ab5728gb492d8612gv47e73dgh97':// ppsCadToMaterialDetailController
					config = $injector.get('ppsCadToMaterialUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'ppsCadToMaterialUIStandardService';
					config.dataServiceName = 'ppsCadToMaterialDataService';
					config.validationServiceName = 'ppsCadToMaterialValidationService';
					break;
				case 'dc136f0fea314fcda4517b27edbe0dee':// ppsMaterial2MdlProductTypeListController
					config = $injector.get('ppsMaterialToMdlProductTypeUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'ppsMaterialToMdlProductTypeUIStandardService';
					config.dataServiceName = 'ppsMaterialToMdlProductTypeDataService';
					config.validationServiceName = 'ppsMaterialToMdlProductTypeValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case '6813f89fc9974d5daa7da9f1079c5dfc':// ppsMaterial2MdlProductTypeDetailController
					config = $injector.get('ppsMaterialToMdlProductTypeUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'ppsMaterialToMdlProductTypeUIStandardService';
					config.dataServiceName = 'ppsMaterialToMdlProductTypeDataService';
					config.validationServiceName = 'ppsMaterialToMdlProductTypeValidationService';
					break;
				case 'addd32320fb24fd3b047db0ab575816c': // ppsMaterialCompatibilityListController
					config = $injector.get('pppsMaterialCompatibilityUIStandardService').getStandardConfigForDetailView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'pppsMaterialCompatibilityUIStandardService';
					config.dataServiceName = 'ppsMaterialCompatibilityDataService';
					config.validationServiceName = 'ppsMaterialCompatibilityValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case '99b37b037ffd4ed98965378f2061fc61': // ppsMaterialSummarizedListController
					config = $injector.get('productionplanningPpsMaterialSummarizedUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningPpsMaterialSummarizedUIStandardService';
					config.dataServiceName = 'productionplanningPpsMateriaSummarizedDataService';
					config.validationServiceName = null;
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case '3f4a022fd7a24394892e4666b5d24240': // productionplanningPpsmaterialMappingListController
					config = $injector.get('productionplanningPpsMaterialMappingUIStandardService').getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningPpsMaterialMappingUIStandardService';
					config.dataServiceName = 'productionplanningPpsMaterialMappingDataService';
					config.validationServiceName = 'productionplanningPpsMaterialMappingValidationService';
					config.listConfig = { initCalled: false, columns: [] };
					break;
				case 'fea2f801c7524d83905a3de9c5b3b6f8': //mdcDrawingComponentListController
					config = productDescUIStdService.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'mdcDrawingComponentUIStandardService';
					config.dataServiceName = 'mdcDrawingComponentDataService';
					config.validationServiceName = $injector.get('mdcDrawingComponentValidationService').getService();
					config.listConfig = {
						initCalled: false
					};
					break;
			}
			return config;
		};
		return service;
	}
})(angular);