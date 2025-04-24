(function (angular) {

	'use strict';
	var moduleName = 'basics.materialcatalog';

	/**
	 * @ngdoc service
	 * @name basicsMaterialCatalogContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsMaterialcatalogContainerInformationService', ['basicsMaterialCatalogUIStandardService',
		'basicsMaterialCatalogDiscountGroupUIStandardService','basicsMaterialCatalogGroupUIStandardService',
		'basicsMaterialCatalogGroupCharUIStandardService','basicsMaterialCatalogGroupCharValUIStandardService',
		'basicsMaterialCatalogPriceVersionUIStandardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (basicsMaterialCatalogUIStandardService,
		          basicsMaterialCatalogDiscountGroupUIStandardService,basicsMaterialCatalogGroupUIStandardService,
		          basicsMaterialCatalogGroupCharUIStandardService,basicsMaterialCatalogGroupCharValUIStandardService,
				  basicsMaterialCatalogPriceVersionUIStandardService) {


			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case 'DF77F013B424438AA053518CBACAFB01'://basicsMaterialCatalogGridController
						config = basicsMaterialCatalogUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogService';
						config.validationServiceName = 'basicsMaterialCatalogValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'E2F671C7F8A44E37809DC4D76B1B1617'://basicsMaterialCatalogDetailController
						config = basicsMaterialCatalogUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogService';
						config.validationServiceName = 'basicsMaterialCatalogValidationService';
						break;
					case 'B39602EC8D7B4A82A5F311BFFC79D3CE'://basicsMaterialCatalogDiscountGroupController
						config = basicsMaterialCatalogDiscountGroupUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogDiscountGroupUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogDiscountGroupService';
						config.validationServiceName = 'basicsMaterialCatalogDiscountGroupValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '79412E5126744A1B9F9E0A69ABB2682D'://basicsMaterialCatalogDiscountGroupDetailController
						config = basicsMaterialCatalogDiscountGroupUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogDiscountGroupUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogDiscountGroupService';
						config.validationServiceName = 'basicsMaterialCatalogDiscountGroupValidationService';
						break;
					case '23485E272689454C91C109BECA46972E'://basicsMaterialCatalogMaterialGroupController
						config = basicsMaterialCatalogGroupUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogMaterialGroupService';
						config.validationServiceName = 'basicsMaterialCatalogMaterialGroupValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'AA40536DF33E41659960EEE10756F8BB'://basicsMaterialCatalogMaterialGroupDetailController
						config = basicsMaterialCatalogGroupUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogMaterialGroupService';
						config.validationServiceName = 'basicsMaterialCatalogMaterialGroupValidationService';
						break;
					case '90F037F0E67A46BE90EB130ECB0B4FC6'://basicsMaterialCatalogGroupCharController
						config = basicsMaterialCatalogGroupCharUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'D933BE681F6A43D19C81E83DD628DC7B'://basicsMaterialCatalogGroupCharDetailController
						config = basicsMaterialCatalogGroupCharUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValidationService';
						break;
					case 'AABFF409DD4241A689B9F5BDC3C2B83A'://basicsMaterialCatalogGroupCharValController
						config = basicsMaterialCatalogGroupCharValUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharValUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharValService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '3717EFA7CDD7416BBFD44B33FB89C7B2'://basicsMaterialCatalogGroupCharValDetailController
						config = basicsMaterialCatalogGroupCharValUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharValUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharValService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValValidationService';
						break;
						//cloudCommonLanguageGridController  303D9D5565314A398AF3E38AA825140B    //todo:check if need to implement
						//characteristic  not have an controller  c22f79fb3d5641e38714267f9af3e672  //todo:check if need to implement
					case '4EAA47C530984B87853C6F2E4E4FC67E'://documentsProjectDocumentController
						config = basicsMaterialCatalogGroupCharValUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharValUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharValService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '8BB802CB31B84625A8848D370142B95C'://documentsProjectDocumentDetailController
						config = basicsMaterialCatalogGroupCharValUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharValUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharValService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValValidationService';
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693'://documentsProjectDocumentRevisionController
						config = basicsMaterialCatalogGroupCharValUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharValUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharValService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219'://documentsProjectDocumentRevisionDetailController
						config = basicsMaterialCatalogGroupCharValUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogGroupCharValUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogGroupCharValService';
						config.validationServiceName = 'basicsMaterialCatalogGroupCharValValidationService';
						break;
					case '3689be8afa314258af208f52a267ffcc':
						config = basicsMaterialCatalogPriceVersionUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsMaterialCatalogPriceVersionUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogPriceVersionService';
						config.validationServiceName = 'basicsMaterialCatalogPriceVersionValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'c69805ec77924333b3014d95c229f5a7':
						config = basicsMaterialCatalogPriceVersionUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsMaterialCatalogPriceVersionUIStandardService';
						config.dataServiceName = 'basicsMaterialCatalogPriceVersionService';
						config.validationServiceName = 'basicsMaterialCatalogPriceVersionValidationService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);