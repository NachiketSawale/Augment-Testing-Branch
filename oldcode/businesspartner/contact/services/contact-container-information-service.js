/**
 * Created by rei 13.11.18
 */
(function(angular) {
	'use strict';
	let moduleName = 'businesspartner.contact';
	angular.module(moduleName).factory('businesspartnerContactContainerInfoService', ['$injector','basicsCommonContainerInformationServiceUtil','documentProjectHeaderUIStandardService','documentsProjectDocumentRevisionUIStandardService',
		function ($injector,containerInformationServiceUtil,documentProjectHeaderUIStandardService,documentsProjectDocumentRevisionUIStandardService) {
			let leadingService = $injector.get('businesspartnerContactDataService');

			function getContainerInfoByGuid(guid) {
				let config = {};
				switch (guid) {
					case 'a4f91b1ed487410ba6edf1d40709a9f7':// Contacts
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerContactUIStandardService',
							dataSvc: 'businesspartnerContactDataService',
							validationSvc: 'businessPartnerContactValidationService'
						}, null);
						break;
					case 'b732f04ccaa24375a410dbff7f294f70':// Contact Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerContactUIStandardService',
							dataSvc: 'businesspartnerContactDataService',
							validationSvc: 'businessPartnerContactValidationService'
						});
						break;
					case '4EAA47C530984B87853C6F2E4E4FC67E': // Documents Project grid
						config.layout = documentProjectHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceProvider = function dataServiceProvider(){
							let documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
							documentsProjectDocumentDataService.register({
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'BpdContactFk', dataField: 'Id',readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk',readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk',dataField: 'MaterialCatalogFk', readOnly: false},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								]
							});
							return documentsProjectDocumentDataService.getService({
								moduleName: moduleName
							});
						};
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '8BB802CB31B84625A8848D370142B95C': // Documents Project Detail
						config = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceProvider = function dataServiceProvider(){
							let documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');
							documentsProjectDocumentDataService.register({
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'BpdContactFk', dataField: 'Id',readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk',readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk',dataField: 'MaterialCatalogFk', readOnly: false},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								]
							});
							return documentsProjectDocumentDataService.getService({
								moduleName: moduleName
							});
						};
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693': // Documents Revision grid
						config.layout = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceProvider = function dataServiceProvider(){
							let config = {
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'BpdContactFk', dataField: 'Id', readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								],
								title: moduleName
							};

							let documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

							let revisionConfig = angular.copy(config);

							revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

							let documentsProjectDocumentRevisionDataService = $injector.get('documentsProjectDocumentDataService');

							return documentsProjectDocumentRevisionDataService.getService(revisionConfig);
						};
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219': // Documents Revision Detail
						config.layout = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceProvider = function dataServiceProvider(){
							let config = {
								moduleName: moduleName,
								parentService: leadingService,
								columnConfig: [
									{documentField: 'BpdContactFk', dataField: 'Id', readOnly: false},
									{documentField: 'ReqHeaderFk', dataField: 'ReqHeaderFk', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
									{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
								],
								title: moduleName
							};

							let documentsProjectDocumentDataService = $injector.get('documentsProjectDocumentDataService');

							let revisionConfig = angular.copy(config);

							revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

							let documentsProjectDocumentRevisionDataService = $injector.get('documentsProjectDocumentDataService');

							return documentsProjectDocumentRevisionDataService.getService(revisionConfig);
						};
						config.validationServiceName = null;
						break;

				}
				return config;
			}
			return {
				getContainerInfoByGuid: getContainerInfoByGuid
			};
		}
	]);
})(angular);