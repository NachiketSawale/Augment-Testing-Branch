(function (angular) {

	'use strict';
	var moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('qtoMainContainerInformationService', ['qtoMainHeaderUIStandardService',
		'qtoMainUIStandardService','qtoMainSubTotalUIStandardService','qtoMainLocationUIStandardService','qtoMainStructureUIStandardService', 'qtoBoqStructureConfigurationService',
		'$injector','documentProjectHeaderUIStandardService','documentsProjectDocumentRevisionUIStandardService',

		/* jshint -W072 */ // many parameters because of dependency injection
		function (qtoMainHeaderUIStandardService,
			qtoMainUIStandardService,qtoMainSubTotalUIStandardService,qtoMainLocationUIStandardService, qtoMainStructureUIStandardService, qtoBoqStructureConfigurationService,$injector,
			documentProjectHeaderUIStandardService,documentsProjectDocumentRevisionUIStandardService) {

			let service = {};
			let leadingService = $injector.get('qtoMainHeaderDataService');
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				switch (guid) {
					case '7CBAC2C0E6F6435AA602A72DCCD50881':// qtoMainHeaderGridController
						config = qtoMainHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoMainHeaderUIStandardService';
						config.dataServiceName = 'qtoMainHeaderDataService';
						config.validationServiceName = 'qtoMainHeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7CBAC2C0E6F6435AA602A72DCCD50882':// qtoMainHeaderFormController
						config = qtoMainHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'qtoMainHeaderUIStandardService';
						config.dataServiceName = 'qtoMainHeaderDataService';
						config.validationServiceName = 'qtoMainHeaderValidationService';
						break;
					case '6D3013BD4AF94808BEC8D0EC864119C9':// qtoMainDetailGridController
						config = qtoMainUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoMainUIStandardService';
						config.dataServiceName = 'qtoMainDetailService';
						config.validationServiceName = 'qtoMainDetailGridValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '051C10AD93904E5ABF98E31208FB7334':// qtoMainDetailFormController
						config = qtoMainUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'qtoMainUIStandardService';
						config.dataServiceName = 'qtoMainDetailService';
						config.validationServiceName = 'qtoMainDetailGridValidationService';
						break;
					case 'BE8B60195CF44F5680C37B96BCED9BA6':// qtoMainSubTotalGridController
						config = qtoMainSubTotalUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoMainSubTotalUIStandardService';
						config.dataServiceName = 'qtoMainSubTotalService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '31593395b9764e3aaae9c678f599d1c3':// qtoMainSubTotalFormController
						config = qtoMainSubTotalUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'qtoMainSubTotalUIStandardService';
						config.dataServiceName = 'qtoMainSubTotalService';
						config.validationServiceName = null;
						break;
					case '9FE0906F463F4AD19D9987DBB58C0704':// qtoLocationListController
						config = qtoMainLocationUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoMainLocationUIStandardService';
						config.dataServiceName = 'qtoMainLocationDataService';
						config.validationServiceName = 'projectLocationValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '4bf041831fee4206bc5c096770c0a56e':// qtoMainStructureController
						config = qtoMainStructureUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoMainStructureUIStandardService';
						config.dataServiceName = 'qtoMainStructureDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '8cfad7031c3a414796b7a5ade42673bb':// qtoMainLocationDetailFormController
						config = qtoMainLocationUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'qtoMainLocationUIStandardService';
						config.dataServiceName = 'qtoMainLocationDataService';
						config.validationServiceName = 'projectLocationValidationService';
						break;
					case 'F116BD36D831483DA0364D1DB70AF4D7':// qtoMainBoqListController
						config = qtoBoqStructureConfigurationService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoMainBoqListColumns';
						config.dataServiceName = 'qtoBoqStructureService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'e081581e841d49f69057d0e850363516':// qtoMainBoqFormController
						config = qtoBoqStructureConfigurationService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'qtoMainBoqFormConfiguration';
						config.dataServiceName = 'qtoBoqStructureService';
						config.validationServiceName = null;
						break;
					case '4EAA47C530984B87853C6F2E4E4FC67E':// Documents Project
						config.layout = documentProjectHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
							documentsProjectDocumentDataService.register({
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'QtoHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'BilHeaderFk', dataField: 'BilHeaderFk', readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{
										documentField: 'MdcControllingUnitFk',
										dataField: 'ControllingUnitFk',
										readOnly: false
									},
									{
										documentField: 'BpdBusinessPartnerFk',
										dataField: 'BusinessPartnerFk',
										readOnly: false
									},
									{
										documentField: 'PrcStructureFk',
										dataField: 'PrcHeaderEntity.StructureFk',
										readOnly: false
									},
									{
										documentField: 'MdcMaterialCatalogFk',
										dataField: 'MaterialCatalogFk',
										readOnly: false
									},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								]
							});
							return documentsProjectDocumentDataService.getService({
								moduleName: moduleName
							});
						};
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '8BB802CB31B84625A8848D370142B95C':// Documents Project Detail
						config = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
							documentsProjectDocumentDataService.register({
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'QtoHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'BilHeaderFk', dataField: 'BilHeaderFk', readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{
										documentField: 'MdcControllingUnitFk',
										dataField: 'ControllingUnitFk',
										readOnly: false
									},
									{
										documentField: 'BpdBusinessPartnerFk',
										dataField: 'BusinessPartnerFk',
										readOnly: false
									},
									{
										documentField: 'PrcStructureFk',
										dataField: 'PrcHeaderEntity.StructureFk',
										readOnly: false
									},
									{
										documentField: 'MdcMaterialCatalogFk',
										dataField: 'MaterialCatalogFk',
										readOnly: false
									},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								]
							});
							return documentsProjectDocumentDataService.getService({
								moduleName: moduleName
							});
						};
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693':// Documents Revision
						config.layout = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var config = {
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'QtoHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'BilHeaderFk', dataField: 'BilHeaderFk', readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{
										documentField: 'MdcControllingUnitFk',
										dataField: 'ControllingUnitFk',
										readOnly: false
									},
									{
										documentField: 'BpdBusinessPartnerFk',
										dataField: 'BusinessPartnerFk',
										readOnly: false
									},
									{
										documentField: 'PrcStructureFk',
										dataField: 'PrcHeaderEntity.StructureFk',
										readOnly: false
									},
									{
										documentField: 'MdcMaterialCatalogFk',
										dataField: 'MaterialCatalogFk',
										readOnly: false
									},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								],
								title: moduleName
							};

							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

							var revisionConfig = angular.copy(config);

							revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

							var documentsProjectDocumentRevisionDataService = $injector.get('documentsProjectDocumentDataService');

							return documentsProjectDocumentRevisionDataService.getService(revisionConfig);
						};
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// Documents Revision Detail
						config = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var config = {
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'QtoHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'BilHeaderFk', dataField: 'BilHeaderFk', readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{
										documentField: 'MdcControllingUnitFk',
										dataField: 'ControllingUnitFk',
										readOnly: false
									},
									{
										documentField: 'BpdBusinessPartnerFk',
										dataField: 'BusinessPartnerFk',
										readOnly: false
									},
									{
										documentField: 'PrcStructureFk',
										dataField: 'PrcHeaderEntity.StructureFk',
										readOnly: false
									},
									{
										documentField: 'MdcMaterialCatalogFk',
										dataField: 'MaterialCatalogFk',
										readOnly: false
									},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								],
								title: moduleName
							};

							var documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

							var revisionConfig = angular.copy(config);

							revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

							var documentsProjectDocumentRevisionDataService = $injector.get('documentsProjectDocumentDataService');

							return documentsProjectDocumentRevisionDataService.getService(revisionConfig);
						};
						config.validationServiceName = null;
						break;

					case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
						var docServ = $injector.get('centralQueryClerkConfigurationService');
						config.layout = docServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
						var layServ = $injector.get('centralQueryClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						break;
					case '886f9059992f46d3864d2Cbe173bd251':
						layServ = $injector.get('qtoDetailDocumentConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoDetailDocumentConfigurationService';
						config.dataServiceName = 'qtoDetailDocumentService';
						config.validationServiceName = 'qtoDetailDocumentValidationService';
						config.listConfig = {
							initCalled: false,
							columns: []
						};
						break;
					case '004EBBD55C9947879A938A640C4A4747': // qtoDetailCommentsListController
						layServ = $injector.get('qtoDetailCommentsConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'qtoDetailCommentsConfigurationService';
						config.dataServiceName = 'qtoDetailCommentsService';
						config.validationServiceName =  'qtoDetailCommentsValidationService';
						config.listConfig = {
							initCalled: false,
							columns: []
						};
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);