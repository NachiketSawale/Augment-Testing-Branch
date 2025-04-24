/**
 * Created by xsi on 2016-07-14.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	angular.module(moduleName).factory('procurementRfqContainerInformationService', [
		'$injector', 'basicsCommonContainerInformationServiceUtil', 'documentProjectHeaderUIStandardService', 'procurementCommonDocumentUIStandardService',

		function ($injector, containerInformationServiceUtil, documentProjectHeaderUIStandardService, procurementCommonDocumentUIStandardService) {
			var service = {};
			var leadingService = $injector.get('procurementRfqMainService');
			var layServ = null;
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				var uISerivce = $injector.get('procurementRfqHeaderUIStandardService');
				var validateService = $injector.get('procurementRfqHeaderValidationService');
				switch (guid) {
					case '037C70C17687481A88C726B1D1F82459':// Request For Quotes
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementRfqHeaderUIStandardService',
							dataSvc: 'procurementRfqMainService',
							validationSvc: 'procurementRfqHeaderValidationService'
						});
						var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(leadingService, uISerivce, validateService, '037c70c17687481a88c726b1d1f82459');
						config.standardConfigurationService = configService;
						break;
					case '3C925CAC7A1C46CA88CECE88FE1EF481':// Request For Quote Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'procurementRfqHeaderUIStandardService',
							dataSvc: 'procurementRfqMainService',
							validationSvc: 'procurementRfqHeaderValidationService'
						});
						var configSvc = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(leadingService, uISerivce, validateService, '037c70c17687481a88c726b1d1f82459');
						config.standardConfigurationService = configSvc;
						break;
					case 'A2F96B998A304EECADBC246514C4089A':// Bidders
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementRfqBusinessPartnerUIStandardService',
							dataSvc: 'procurementRfqBusinessPartnerService',
							validationSvc: 'procurementRfqBusinessPartnerValidationService'
						});
						break;
					case '2B0438DBE5284193BE28B817623592EA':// Bidder Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'procurementRfqBusinessPartnerUIStandardService',
							dataSvc: 'procurementRfqBusinessPartnerService',
							validationSvc: 'procurementRfqBusinessPartnerValidationService'
						});
						break;
					case '4EAA47C530984B87853C6F2E4E4FC67E':// Documents Project
						config.layout = documentProjectHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'documentsProjectDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '8BB802CB31B84625A8848D370142B95C':// Documents Project Detail
						config = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'documentsProjectDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693':// Documents Revision
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'documentsProjectDocumentRevisionUIStandardService',
							dataSvc: 'documentsProjectDocumentRevisionDataService'
						});
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// Documents Revision Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'documentsProjectDocumentRevisionUIStandardService',
							dataSvc: 'documentsProjectDocumentRevisionDataService'
						});
						break;
					case '3DA6F959D8744A84BE2D78DAC89FFEEF':// Requisitions
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementRfqRequisitionUIStandardService',
							dataSvc: 'procurementRfqRequisitionService',
							validationSvc: 'procurementRfqRequisitionValidationService'
						});
						break;
					case '4E0F88CF3A074ABE96D1EE7F4C93AD0E':// Requisition Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'procurementRfqRequisitionUIStandardService',
							dataSvc: 'procurementRfqRequisitionService',
							validationSvc: 'procurementRfqRequisitionValidationService'
						});
						break;
					case 'dbfa5ff5cbb34fe4a7feba67a5360e81':// Send History
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementRfqSendHistoryUIStandardService',
							dataSvc: 'procurementRfqSendHistoryService'
						});
						break;
					case 'b28931fa0d0946048ef8bacfb8910403':// Send History Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'procurementRfqSendHistoryUIStandardService',
							dataSvc: 'procurementRfqSendHistoryService'
						});
						break;
					case '26E2ED9B49A14FB3BC4DC989177BC937':// Documents
						config.layout = procurementCommonDocumentUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonDocumentUIStandardService';
						config.dataServiceProvider = function dataServiceProvider() {
							var dataService = $injector.get('procurementCommonDocumentCoreDataService');
							return dataService.getService(leadingService);
						};
						config.validationServiceName = 'procurementCommonDocumentValidationService';
						config.listConfig = {initCalled: false, columns: []};
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
					case '2dd4dc4f50844b22b55f5815f83fed2e':// Bidders Wizard Container
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementRfqBusinessPartnerWizardUIStandardService',
							dataSvc: 'procurementRfqBusinessPartnerService',
							validationSvc: 'procurementRfqBusinessPartnerValidationService'
						});
						break;
					case 'b239479113c24b49a0e19fff093e58cf':// All bidder Container
						// noinspection JSCheckFunctionSignatures
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementRfqBusinessPartnerWizardUIStandardService',
							dataSvc: 'procurementRfqBusinessPartnerService',
							validationSvc: 'procurementRfqBusinessPartnerValidationService'
						});
						break;
					case 'e907d30b10274a1fb760f76b113c3b0d':
						layServ = $injector.get('procurementRfqBidderSettingUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementRfqBidderSettingUIStandardService';
						config.dataServiceName = 'procurementRfqBidderSettingService';
						config.validationServiceName = 'procurementRfqBidderSettingValidationService';
						break;
					case '9d4498f32ca046ecb961fba5bac6436d':
						layServ = $injector.get('procurementRfqDataFormatUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementRfqDataFormatUIStandardService';
						config.dataServiceName = 'procurementRfqDataFormatService';
						break;
					case '7016ed0f76da4be19b63c516d75891f6':
						layServ = $injector.get('procurementRfqDocumentForSendRfqUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementRfqDocumentForSendRfqUIStandardService';
						config.dataServiceName = 'procurementRfqDocumentForSendRfqService';
						break;
					case '1e7537f6803c4bebb821634bb17cb068':
						layServ = $injector.get('procurementRfqDocumentForSendRfqUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementRfqDocumentForSendRfqUIStandardService';
						config.dataServiceName = 'procurementRfqClerkDocumentForSendRfqService';
						break;
					case 'c31cc0077055459d8000a6ebbf523cb6':
						layServ = $injector.get('procurementRfqSendRfqBoqUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementRfqSendRfqBoqUIStandardService';
						config.dataServiceName = 'procurementRfqSendRfqBoqService';
						break;
					case'b6a85fec74a2402fb3bc16f108c9c0b3':
						config.ContainerType = 'chart';
						config.dataServiceName = 'genericWizardBusinessPartnerTransmissionService';
						break;
					case'44e5b148b85845c5bb13e35f7c97c5c6':
						config.ContainerType = 'chart';
						config.dataServiceName = 'procurementRfqEmailSenderService';
						break;
					case'7ba78cfb8fd242ec8eb4190a8ba3559f': // cover letter container
						config.ContainerType = 'chart';
						config.forceServiceCreate = true;
						config.dataServiceName = 'procurementRfqBidderCoverLetterService';
						break;
					case'42ede45a94ce421f822305090bbd0915': // report container
						config.ContainerType = 'chart';
						config.forceServiceCreate = true;
						config.dataServiceName = 'procurementRfqBidderReportService';
						break;
					case 'd053e7c20a934b96854d612613ad5a69':
						layServ = $injector.get('procurementRfqBusinessPartner2ContactUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementRfqBusinessPartner2ContactUIStandardService';
						config.dataServiceName = 'procurementRfqBusinessPartner2ContactService';
						config.validationServiceName = 'procurementRfqBusinessPartner2ContactValidationService';
						break;
					case 'ea9dbcbba5104970a58142a5cce4e17f':
						layServ = $injector.get('procurementRfqBusinessPartner2ContactUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementRfqBusinessPartner2ContactUIStandardService';
						config.dataServiceName = 'procurementRfqBusinessPartner2ContactService';
						config.validationServiceName = 'procurementRfqBusinessPartner2ContactValidationService';
						break;
					case 'fc2ce31089fa456587193a13bcab3a43':
						layServ = $injector.get('procurementRfqProjectDocumentsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementRfqProjectDocumentsUIStandardService';
						config.dataServiceName = 'procurementRfqProjectDocumentForSendRfqService';
						break;
					case '7E919AC811204E439C03B192793CF473':// procurementPackage2ExtBidderGridController
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
					case '03660E18A1D84AA7931A1619B9157869':// procurementPackage2ExtBidderFormController
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
					case '851d650c916a42778042f7730e48198a':// prc structure documents
						layServ = $injector.get('procurementRfqStructureDocumentsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementRfqStructureDocumentsUIStandardService';
						config.dataServiceName = 'procurementRfqStructureDocumentForSendRfqService';
						break;
					case '861e8aef7aa24b4584a4f68448569b9a':// basicsWorkflowEntityApproverController
						layServ = $injector.get('basicsWorkflowEntityApproversCommonColumns');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsWorkflowEntityApproversCommonColumns';
						config.dataServiceName = 'basicsWorkflowEntityApproversDataService';
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break;
				}
				return config;
			};
			return service;
		}
	]);

})(angular);
