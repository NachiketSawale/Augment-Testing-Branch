/**
 * Created by xsi on 2016-07-14.
 */

// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.quote';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementQuoteContainerInformationService', [
		'$injector', 'basicsCommonContainerInformationServiceUtil', 'documentProjectHeaderUIStandardService', 'procurementCommonCertificateUIStandardService',
		'procurementCommonContactUIStandardService', 'procurementCommonDocumentUIStandardService', 'documentsProjectDocumentRevisionUIStandardService',
		'procurementCommonGeneralsUIStandardService', 'procurementCommonItemUIStandardService', 'procurementCommonMilestoneUIStandardService',
		'procurementCommonPrcBoqUIStandardService', 'procurementQuoteRequisitionUIConfigurationService', 'procurementCommonSubcontractorUIStandardService',
		'procurementQuoteRequisitionDataService',
		function ($injector, containerInformationServiceUtil, documentProjectHeaderUIStandardService, procurementCommonCertificateUIStandardService,
			procurementCommonContactUIStandardService, procurementCommonDocumentUIStandardService, documentsProjectDocumentRevisionUIStandardService,
			procurementCommonGeneralsUIStandardService, procurementCommonItemUIStandardService, procurementCommonMilestoneUIStandardService,
			procurementCommonPrcBoqUIStandardService, procurementQuoteRequisitionUIConfigurationService, procurementCommonSubcontractorUIStandardService,
			quoteRequisitionDataService) {
			var service = {};
			var leadingService = $injector.get('procurementQuoteHeaderDataService');
			var layServ = null;
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var uISerivce = $injector.get('procurementQuoteHeaderUIConfigurationService');
				var validateService = $injector.get('procurementQuoteHeaderValidationService');
				switch (guid) {
					case '338048AC80F748B3817ED1FAEA7C8AA5':// Quotes
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementQuoteHeaderUIConfigurationService',
							dataSvc: 'procurementQuoteHeaderDataService',
							validationSvc: 'procurementQuoteHeaderValidationService'
						});
						var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(leadingService, uISerivce, validateService, '338048ac80f748b3817ed1faea7c8aa5');
						config.standardConfigurationService = configService;
						break;
					case '9F2060BA9A5B4A338263186E77A5CCFB':// Quote Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'procurementQuoteHeaderUIConfigurationService',
							dataSvc: 'procurementQuoteHeaderDataService',
							validationSvc: 'procurementQuoteHeaderValidationService'
						});
						var configSvc = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(leadingService, uISerivce, validateService, '338048ac80f748b3817ed1faea7c8aa5');
						config.standardConfigurationService = configSvc;
						break;
					case '2C28D44A8D1442D1A7F44ACE864ECCC9':// Certificates
						config.layout = procurementCommonCertificateUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonCertificateUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonCertificateNewDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonCertificatesValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'EE11B5D4EE7448FBA435B0551220057F':// Certificate Detail
						config = procurementCommonCertificateUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonCertificateUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonCertificateNewDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonCertificatesValidationService';
						break;
					case '13E7F8A9CE0444489ED1FA96CB43C79D':// Contacts
						config.layout = procurementCommonContactUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonContactUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonContactDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonContactValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'AD21F3560B124B12A7764B0A761340C2':// Contact Detail
						config = procurementCommonContactUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonContactUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonContactDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonContactValidationService';
						break;
					case '26E2ED9B49A14FB3BC4DC989177BC937':// Documents
						config.layout = procurementCommonDocumentUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonDocumentUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonMilestoneDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonDocumentValidationService';
						config.listConfig = {initCalled: false, columns: []};
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
					case '0F6AE8F1F34545559C008FCA53BE2751':// businesspartnerCertificateActualCertificateListController
						config.layout = $injector.get('procurementQuoteCertificateActualUIConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementQuoteCertificateActualUIConfigurationService';// businesspartnerCertificateToContractLayout
						config.dataServiceName = 'procurementQuoteCertificateActualDataService';
						config.validationServiceName = 'procurementQuoteCertificateActualValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '724E448CCE7249328149F8CE8F830941':// businesspartnerCertificateActualCertificateDetailController
						config = $injector.get('procurementQuoteCertificateActualUIConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementQuoteCertificateActualUIConfigurationService';
						config.dataServiceName = 'procurementQuoteCertificateActualDataService';
						config.validationServiceName = 'procurementQuoteCertificateActualValidationService';
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
					case 'E2A1CCCDA07D48E68F2B0FC4208E61EE':// Generals
						config.layout = procurementCommonGeneralsUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceName = 'procurementContractGeneralsDataService';
						config.validationServiceName = 'procurementCommonGeneralsValidationService';
						config.validationServiceProvider = function validationServiceProvider() {
							var dataService = $injector.get('procurementCommonGeneralsDataService').getService(leadingService);
							var validationService = $injector.get('procurementCommonGeneralsValidationService');
							return validationService(dataService);
						};
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '9464743619C2400099EC2D759E72D07C':// General Detail
						config = procurementCommonGeneralsUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonGeneralsDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonGeneralsValidationService';
						break;
					case '274DA208B3DA47988366D48F38707DE1':// Items
						config.layout = procurementCommonItemUIStandardService.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonPrcItemDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonPrcItemValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '274DA208B3DA47988366D48F38707DE2':// Item Detail
						config = procurementCommonItemUIStandardService.getStandardConfigForDetailView(moduleName);
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonPrcItemDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonPrcItemValidationService';
						break;
					case 'A21042925BF44AE59FA2D849BBEC3818':// Milestones
						config.layout = procurementCommonMilestoneUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonMilestoneDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonMilestoneValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '2B60BAA2C9BA44B88B502E4671F39735':// Milestones Detail
						config = procurementCommonMilestoneUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonMilestoneDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonMilestoneValidationService';
						break;
					case '3AA545F7AA6B40498908EBF41ABB78D8':// Procurement BoQs
						config.layout = procurementCommonPrcBoqUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonPrcBoqService');
							var boqMainService = $injector.get('prcBoqMainService');
							var reqBoqMainService = boqMainService.getService(quoteRequisitionDataService);
							return dataService.getService(quoteRequisitionDataService, reqBoqMainService);
						};
						config.validationServiceName = 'procurementCommonPrcBoqValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '3779D1B79B454E64B7559E4D9C9FF7AC':// Procurement BoQ Detail
						config = procurementCommonPrcBoqUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonPrcBoqService');
							var boqMainService = $injector.get('prcBoqMainService');
							var reqBoqMainService = boqMainService.getService(quoteRequisitionDataService);
							return dataService.getService(quoteRequisitionDataService, reqBoqMainService);
						};
						config.validationServiceName = 'procurementCommonPrcBoqValidationService';
						break;
					case '58D71F3079C9450D9723FC7194E433C2': // boq Structure
						var prcBoqMainUIStandardService = $injector.get('procurementCommonPrcBoqMainUIStandardService');
						config.layout = prcBoqMainUIStandardService.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.dataServiceProvider = function () {
							var boqMainService = $injector.get('prcBoqMainService');
							return boqMainService.getService(quoteRequisitionDataService);
						};
						config.validationServiceName = 'boqMainElementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'A6ACABDDC69F45408C3DD3A9504A2AC5':// BoQ Details
						config = $injector.get('procurementCommonPrcBoqMainUIStandardService').getStandardConfigForDetailView(moduleName);
						var prcBoqMainServiceDetail = $injector.get('prcBoqMainService');
						config.ContainerType = 'Detail';
						config.dataServiceProvider = function () {
							return prcBoqMainServiceDetail.getService(quoteRequisitionDataService);
						};
						config.validationServiceName = 'boqMainElementValidationService';
						break;
					case 'AB8B7CDBC7FE411C87F2D18E4E0DFFB9':// Requisitions
						config.layout = procurementQuoteRequisitionUIConfigurationService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementQuoteRequisitionUIConfigurationService';
						config.dataServiceName = 'procurementQuoteRequisitionDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'AB8B7CDBC7FE411C87F2D18E4E0DFFBA':// Requisition Detail
						config = procurementQuoteRequisitionUIConfigurationService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementQuoteRequisitionUIConfigurationService';
						config.dataServiceName = 'procurementQuoteRequisitionDataService';
						config.validationServiceName = null;
						break;
					case '59B068FC4983400793F62179D3791158':// Subcontractors
						config.layout = procurementCommonSubcontractorUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonSubcontractorDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonSubcontractorValidationDataService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'DBA008EF7F7942769FFEF3960F1DD803':// Subcontractor Detail
						config = procurementCommonSubcontractorUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonSubcontractorDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonSubcontractorValidationDataService';
						break;
					case '7d9056a624544d0582486f46413e950c': // procurementQuoteCallOffAgreementGridController
						var layGridServ = $injector.get('procurementQuoteCallOffAgreementUIStandardService');
						config.layout = layGridServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementQuoteCallOffAgreementUIStandardService';
						config.dataServiceName = 'procurementQuoteCallOffAgreementDataService';
						config.validationServiceName = 'procurementQuoteCallOffAgreementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '43c07f06ee0b40818f217bedeb9928df': // procurementQuoteCallOffAgreementFormController
						var layFormServ = $injector.get('procurementQuoteCallOffAgreementUIStandardService');
						config = layFormServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementQuoteCallOffAgreementUIStandardService';
						config.dataServiceName = 'procurementQuoteCallOffAgreementDataService';
						config.validationServiceName = 'procurementQuoteCallOffAgreementValidationService';
						break;
					case '53f0117d8b7845f9940265c102734adc': // procurementQuoteMandatoryDeadlineGridController
						var layMandatoryDeadlineGridServ = $injector.get('procurementQuoteMandatoryDeadlineUIStandardService');
						config.layout = layMandatoryDeadlineGridServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementQuoteMandatoryDeadlineUIStandardService';
						config.dataServiceName = 'procurementQuoteMandatoryDeadlineDataService';
						config.validationServiceName = 'procurementQuoteMandatoryDeadlineValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '93089707dd9d4797b06224ce1940bfde': // procurementQuoteMandatoryDeadlineFormController
						var layMandatoryDeadlineFormServ = $injector.get('procurementQuoteMandatoryDeadlineUIStandardService');
						config = layMandatoryDeadlineFormServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementQuoteMandatoryDeadlineUIStandardService';
						config.dataServiceName = 'procurementQuoteMandatoryDeadlineDataService';
						config.validationServiceName = 'procurementQuoteMandatoryDeadlineValidationService';
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
					case '9B4A1D6D154F446D9933825B58676727':// procurementPackage2ExtBidderGridController
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
					case 'ADD02BD879F64767ACCA25214E5FF941':// procurementPackage2ExtBidderFormController
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
