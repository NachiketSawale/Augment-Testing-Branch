(function (angular) {

	'use strict';
	var moduleName = 'basics.material';

	/**
	 * @ngdoc service
	 * @name basicsMaterialContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsMaterialContainerInformationService', ['$injector','basicsMaterialCatalogUIStandardService',
		'basicsMaterialDocumentStandardConfigurationService','basicsMaterialRecordUIConfigurationService','basicsMaterialCharacteristicStandardConfigurationService',
		'basicsMaterialPriceListUIStandardService','basicsMaterialStockUIStandardService','basicsMaterialPriceVersionToStockListUIStandardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector,
				  basicsMaterialCatalogUIStandardService,
		          basicsMaterialDocumentStandardConfigurationService,basicsMaterialRecordUIConfigurationService,basicsMaterialCharacteristicStandardConfigurationService,
				  basicsMaterialPriceListUIStandardService,basicsMaterialStockUIStandardService,basicsMaterialPriceVersionToStockListUIStandardService) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case 'DE9355B7DED945918F287D76043602FF'://basicsMaterialMaterialCatalogGridController
						config = basicsMaterialCatalogUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogService';
						config.validationServiceName = 'basicsMaterialCatalogValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '29BCF2F0BD994B0D9CDB941C2F4FBFCD'://basicsMaterialMaterialGroupsController
						config = basicsMaterialCatalogUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogService';
						config.validationServiceName = 'basicsMaterialCatalogValidationService';
						break;
					//basicsMaterialPreviewController  875C61BB2C5A4F54987A8DB8125DD211
					case 'C84BD59DDA4B4644AAE314E1A5A11A0C'://basicsMaterialDocumentsController
						config = basicsMaterialDocumentStandardConfigurationService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialDocumentStandardConfigurationService';
						config.dataServiceName = 'basicsMaterialDocumentsService';
						config.validationServiceName = 'basicsMaterialDocumentsValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'CD7BE1A005DA4C199E84369963D464E9'://basicsMaterialDocumentsDetailController
						config = basicsMaterialDocumentStandardConfigurationService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialDocumentStandardConfigurationService';
						config.dataServiceName = 'basicsMaterialDocumentsService';
						config.validationServiceName = 'basicsMaterialDocumentsValidationService';
						break;
						//basicsMaterialSpecificationController  E850BA1740C24C35907491F922A3716B
					case 'DD40337F1F534A42A844122203639ED8'://basicsMaterialRecordGridController
						config = basicsMaterialRecordUIConfigurationService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialRecordUIConfigurationService';
						config.dataServiceName = 'basicsMaterialRecordService';
						config.validationServiceName = 'basicsMaterialRecordValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'EBF18CFA17C64948BEE42582B45B4A75'://basicsMaterialRecordFormController
						config = basicsMaterialRecordUIConfigurationService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialRecordUIConfigurationService';
						config.dataServiceName = 'basicsMaterialRecordService';
						config.validationServiceName = 'basicsMaterialRecordValidationService';
						break;
					case '127DCD97F72546CC90B8FB5583883F4B'://basicsMaterialCharacteristicController
						config = basicsMaterialCharacteristicStandardConfigurationService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCharacteristicStandardConfigurationService';
						config.dataServiceName = 'basicsMaterialCharacteristicService';
						config.validationServiceName = 'basicsMaterialCharacteristicValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '8306AA461B94460EA4BE03F6B1CE44A9'://basicsMaterialCharacteristicDetailController
						config = basicsMaterialCharacteristicStandardConfigurationService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCharacteristicStandardConfigurationService';
						config.dataServiceName = 'basicsMaterialCharacteristicService';
						config.validationServiceName = 'basicsMaterialCharacteristicValidationService';
						break;
					case '8161248d9b014fb4a284326e5dd3d1c7'://basicsMaterialCharacteristicController
						config = basicsMaterialPriceListUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialPriceListUIStandardService';
						config.dataServiceName = 'basicsMaterialPriceListService';
						config.validationServiceName = 'basicsMaterialPriceListValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '83f4d48ff373416aa8c5a8fd389af1c2':
						config = basicsMaterialPriceListUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialPriceListUIStandardService';
						config.dataServiceName = 'basicsMaterialPriceListService';
						config.validationServiceName = 'basicsMaterialPriceListValidationService';
						break;
					case 'd5aaf97f50e24a83831b8c3d07d15fb9'://basicsMaterialCharacteristicController
						config = basicsMaterialStockUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialStockUIStandardService';
						config.dataServiceName = 'basicsMaterialStockService';
						config.validationServiceName = 'basicsMaterialStockValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '327797c391a948d4bffb252099bdc6a3'://basicsMaterial2CertificateGridController
						var layServ1 = $injector.get('basicsMaterial2CertificateUIStandardService');
						config.layout = layServ1.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterial2CertificateUIStandardService';
						config.dataServiceName = 'basicsMaterial2CertificateDataService';
						config.validationServiceName = 'basicsMaterial2CertificateValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '42b48e9002794059b5e773f65adb5f0c':
						var layServ2 = $injector.get('basicsMaterial2CertificateUIStandardService');
						config = layServ2.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterial2CertificateUIStandardService';
						config.dataServiceName = 'basicsMaterial2CertificateDataService';
						config.validationServiceName = 'basicsMaterial2CertificateValidationService';
						break;
					case '49f6e969068844539d3faa7cd155de24'://basicsMaterial2basUomGridController
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterial2basUomUIStandardService';
						config.dataServiceName = 'basicsMaterial2basUomDataService';
						config.validationServiceName = 'basicsMaterial2basUomValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'caa04e7f99aa44fa850dbeab916eeebc':
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterial2basUomUIStandardService';
						config.dataServiceName = 'basicsMaterial2basUomDataService';
						config.validationServiceName = 'basicsMaterial2basUomValidationService';
						break;
					case '67707f3826cf42e7944bbf200db5cb35':
						config = basicsMaterialPriceVersionToStockListUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialPriceVersionToStockListUIStandardService';
						config.dataServiceName = 'basicsMaterialPriceVersionToStockListService';
						config.validationServiceName = 'basicsMaterialPriceVersionToStockListValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);