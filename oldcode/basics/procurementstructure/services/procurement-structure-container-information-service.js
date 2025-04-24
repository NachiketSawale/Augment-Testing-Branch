(function (angular) {

	'use strict';
	var moduleName = 'basics.procurementstructure';

	/**
	 * @ngdoc service
	 * @name basicsProcurementStructureContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsProcurementstructureContainerInformationService', ['basicsProcurementStructureUIStandardService',
		'basicsProcurementConfiguration2GeneralsUIStandardService','basicsProcurementConfiguration2CertUIStandardService',
		'basicsProcurementAccountUIStandardService','basicsProcurementClerkUIStandardService','basicsProcurementEventUIStandardService',
		'documentsProjectDocumentRevisionUIStandardService','documentProjectHeaderUIStandardService',
		    '$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function (basicsProcurementStructureUIStandardService,
		          basicsProcurementConfiguration2GeneralsUIStandardService,basicsProcurementConfiguration2CertUIStandardService,
		          basicsProcurementAccountUIStandardService,basicsProcurementClerkUIStandardService,basicsProcurementEventUIStandardService,
		          documentsProjectDocumentRevisionUIStandardService,documentProjectHeaderUIStandardService,
				  $injector) {

			var service = {};
			var layServ = null;
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var uISerivce =  $injector.get('basicsProcurementStructureUIStandardService');
				var mainService = $injector.get('basicsProcurementStructureService');
				var validateService = $injector.get('basicsProcurementStructureValidationService');
				switch (guid) {
					case 'a59c90cf86d14abe98df9cb8601b22a0'://basicsProcurementStructureGridController
						config = basicsProcurementStructureUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.dataServiceName = 'basicsProcurementStructureService';
						config.validationServiceName = 'basicsProcurementStructureValidationService';
						var configService =  $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService,uISerivce,validateService,guid);
						config.standardConfigurationService = configService;
						break;
					case 'EFB8785B0135482EAC2F12EFB0006EF3'://basicsProcurementStructureDetailController
						config = basicsProcurementStructureUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.dataServiceName = 'basicsProcurementStructureService';
						config.validationServiceName = 'basicsProcurementStructureValidationService';
						var configServ =  $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService,uISerivce,validateService,'a59c90cf86d14abe98df9cb8601b22a0');
						config.standardConfigurationService = configServ;
						break;
					case '818A69A775EE4BE2ABF5AE052A6A1870'://basicsProcurementConfiguration2GeneralsGridController
						config = basicsProcurementConfiguration2GeneralsUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsProcurementConfiguration2GeneralsUIStandardService';
						config.dataServiceName = 'basicsProcurementConfiguration2GeneralsService';
						config.validationServiceName = 'basicsProcurementConfiguration2GeneralsValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '3558A8CBFD524E20A2ADA6E8C5716FB9'://basicsProcurementConfiguration2GeneralsDetailController
						config = basicsProcurementConfiguration2GeneralsUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsProcurementConfiguration2GeneralsUIStandardService';
						config.dataServiceName = 'basicsProcurementConfiguration2GeneralsService';
						config.validationServiceName = 'basicsProcurementConfiguration2GeneralsValidationService';
						break;
					case '14A291FD061C4261A4F9D984638903D8'://basicsProcurementConfiguration2CertGridController
						config = basicsProcurementConfiguration2CertUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsProcurementConfiguration2CertUIStandardService';
						config.dataServiceName = 'basicsProcurementConfiguration2CertService';
						config.validationServiceName = 'basicsProcurementConfiguration2CertValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '923226D28F17486B96F446CDCE269D90'://basicsProcurementConfiguration2CertDetailController
						config = basicsProcurementConfiguration2CertUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsProcurementConfiguration2CertUIStandardService';
						config.dataServiceName = 'basicsProcurementConfiguration2CertService';
						config.validationServiceName = 'basicsProcurementConfiguration2CertValidationService';
						break;
					case '37C88CBD986348EBB87DE6FC9F34A56A'://basicsProcurementStructureAccountGridController
						config = basicsProcurementAccountUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsProcurementAccountUIStandardService';
						config.dataServiceName = 'basicsProcurementStructureAccountService';
						config.validationServiceName = 'basicsProcurementStructureAccountValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'CDF8629F4AED45A88331CA58313B99C6'://basicsProcurementStructureAccountDetailController
						config = basicsProcurementAccountUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsProcurementAccountUIStandardService';
						config.dataServiceName = 'basicsProcurementStructureAccountService';
						config.validationServiceName = 'basicsProcurementStructureAccountValidationService';
						break;
					case '9F82D18224164812991295F00E0DDE9D'://basicsProcurementClerkController
						config = basicsProcurementClerkUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsProcurementClerkUIStandardService';
						config.dataServiceName = 'basicsProcurement2ClerkService';
						config.validationServiceName = 'basicsProcurementStructure2ClerkValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'DD35DF201A3A464EAFBD10E227D7527B'://basicsProcurementClerkDetailController
						config = basicsProcurementClerkUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsProcurementClerkUIStandardService';
						config.dataServiceName = 'basicsProcurement2ClerkService';
						config.validationServiceName = 'basicsProcurementStructure2ClerkValidationService';
						break;
					case '21CFBB7BF4FF4F24B49DB4C08521E220'://basicsProcurementEvaluationController
						config = basicsProcurementClerkUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsProcurementClerkUIStandardService';
						config.dataServiceName = 'basicsProcurement2ClerkService';
						config.validationServiceName = 'basicsProcurementStructure2ClerkValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'C3BC4A2B6149444FB795382E1E2FB9C0'://basicsProcurementEvaluationDetailController
						config = basicsProcurementClerkUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsProcurementClerkUIStandardService';
						config.dataServiceName = 'basicsProcurement2ClerkService';
						config.validationServiceName = 'basicsProcurementStructure2ClerkValidationService';
						break;
						//cloudCommonLanguageGridController  C0C55603A0DD4C8F99F95529B0EC71EC
					case '32D5BDF548844B5581C0DD4DC69C6CDD'://basicsProcurementEventController
						config = basicsProcurementEventUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsProcurementEventUIStandardService';
						config.dataServiceName = 'basicsProcurementEventService';
						config.validationServiceName = 'basicsProcurementStructureEventValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'AFA865416D3F4A1080300B78ACBBD69C'://basicsProcurementEventDetailController
						config = basicsProcurementEventUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'basicsProcurementEventUIStandardService';
						config.dataServiceName = 'basicsProcurementEventService';
						config.validationServiceName = 'basicsProcurementStructureEventValidationService';
						break;
					case '508457EF407E408BB87763653576D477'://documentsProjectDocumentController
						config = documentProjectHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementStructureDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '6FDFDF6A24CD446886A4CD1A4BB9ED84'://documentsProjectDocumentDetailController
						config = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementStructureDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693'://documentsProjectDocumentRevisionController
						config = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementStructureDocumentRevisionDataService';
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219'://documentsProjectDocumentRevisionDetailController
						config = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementStructureDocumentRevisionDataService';
						config.validationServiceName = null;
						break;
					case '47620dd38c874f97b75ee3b6ce342666': //DocumentClerkListController
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': //documentClerkDetailController
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);