/**
 * Created by xsi on 2016-07-19.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.pes';
	angular.module(moduleName).factory('procurementPesContainerInformationService', [
		'$injector', 'documentProjectHeaderUIStandardService', 'basicsCommonContainerInformationServiceUtil',
		'documentsProjectDocumentRevisionUIStandardService', 'procurementContextService', 'procurementPesHeaderService', 'procurementPesBoqService',
		function ($injector, documentProjectHeaderUIStandardService, containerInformationServiceUtil,
			documentsProjectDocumentRevisionUIStandardService, moduleContext, leadingService, pesBoqService) {
			var service = {};
			var pesItemUIService = $injector.get('procurementPesItemUIStandardService');
			var pesItemService = $injector.get('procurementPesItemService');
			var pesItemValidationService = $injector.get('procurementPesItemValidationService');
			var layServ = null;
			// set context values
			moduleContext.setLeadingService(leadingService);
			moduleContext.setMainService(pesBoqService);
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var uISerivce = $injector.get('procurementPesHeaderUIStandardService');
				var mainService = $injector.get('procurementPesHeaderService');
				var validateService = $injector.get('procurementPesHeaderValidationService');
				switch (guid) {
					case 'EBE726DBF2C5448F90B417BF2A30B4EB':// Headers
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementPesHeaderUIStandardService',
							dataSvc: 'procurementPesHeaderService',
							validationSvc: 'procurementPesHeaderValidationService'
						});
						var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, 'ebe726dbf2c5448f90b417bf2a30b4eb');
						config.standardConfigurationService = configService;
						break;
					case '195FE4EE5C974E0AAA3CFD5473544D2B':// Header Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'procurementPesHeaderUIStandardService',
							dataSvc: 'procurementPesHeaderService',
							validationSvc: 'procurementPesHeaderValidationService'
						});
						var configServ = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, 'ebe726dbf2c5448f90b417bf2a30b4eb');
						config.standardConfigurationService = configServ;
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
									{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
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
									{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
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
									{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
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
									{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
									{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
									{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
									{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
									{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
									{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
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
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						break;
					case 'EA88ECBB5ACA40DEA0DF3EF2182BBEB0':  // Items
						config.layout = pesItemUIService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPesItemUIStandardService';
						config.dataServiceName = 'procurementPesItemService';
						config.validationServiceProvider = function () {
							return pesItemValidationService(pesItemService);
						};
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '63FFC067C37F41A495E923D758E3044D':// Item Detail
						config = pesItemUIService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementPesItemUIStandardService';
						config.dataServiceName = 'procurementPesItemService';
						config.validationServiceProvider = function () {
							return pesItemValidationService(pesItemService);
						};
						break;

					case 'D12D2DA2967E4C4F808E757C5A3F91A5':// Boqs
						var pesBoqUIService = $injector.get('procurementPesBoqUIStandardService');
						var pesBoqValidationService = $injector.get('procurementPesBoqValidationService');
						config.layout = pesBoqUIService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPesBoqUIStandardService';
						config.dataServiceName = 'procurementPesBoqService';
						config.validationServiceProvider = function () {
							return pesBoqValidationService(pesBoqService.name, pesBoqService);
						};
						break;
					case 'F52BE674B318460DA047748DF4F07BEC': // boq Structure
						var prcBoqMainUIStandardService = $injector.get('procurementCommonPrcBoqMainUIStandardService');
						var prcBoqMainService = $injector.get('prcBoqMainService');
						config.layout = prcBoqMainUIStandardService.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.dataServiceProvider = function () {
							return prcBoqMainService.getService(pesBoqService);
						};
						config.validationServiceName = 'boqMainElementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'AE535ABF259D4688A74CA43DD2E17839':// BoQ Details
						config = $injector.get('procurementCommonPrcBoqMainUIStandardService').getStandardConfigForDetailView(moduleName);
						var prcBoqMainServiceDetail = $injector.get('prcBoqMainService');
						config.ContainerType = 'Detail';
						config.dataServiceProvider = function () {
							return prcBoqMainServiceDetail.getService(pesBoqService);
						};
						config.validationServiceName = 'boqMainElementValidationService';
						break;
					case '204C51508311406AA8F7EC4930852524':// procurementPackage2ExtBidderGridController
						var package2ExtBidderService = $injector.get('procurementPackage2ExtBidderService');
						var load2ExtBidderInitDataGrid = package2ExtBidderService.loadControllerInitData();
						layServ = $injector.get('procurementPackage2ExtBidderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackage2ExtBidderUIStandardService';
						config.dataServiceProvider = function () {
							return load2ExtBidderInitDataGrid.dataService;
						};
						config.validationServiceProvider = function () {
							return load2ExtBidderInitDataGrid.validationService;
						};
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '00D26A0EB552403891A281A37895A5AE':// procurementPackage2ExtBidderFormController
						var package2ExtBidderServiceDetail = $injector.get('procurementPackage2ExtBidderService');
						var load2ExtBidderInitDataDetail = package2ExtBidderServiceDetail.loadControllerInitData();
						layServ = $injector.get('procurementPackage2ExtBidderUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementPackage2ExtBidderUIStandardService';
						config.dataServiceProvider = function () {
							return load2ExtBidderInitDataDetail.dataService;
						};
						config.validationServiceProvider = function () {
							return load2ExtBidderInitDataDetail.validationService;
						};
						break;
				}
				return config;
			};
			return service;
		}
	]);

})(angular);