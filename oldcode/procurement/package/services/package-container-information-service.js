(function (angular) {

	'use strict';
	var moduleName = 'procurement.package';

	/**
	 * @ngdoc service
	 * @name procurementPackageContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('procurementPackageContainerInformationService', ['$injector', 'procurementContextService',
		'procurementPackageDataService', 'procurementPackagePackage2HeaderService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector, moduleContext, leadingService, mainService) {

			var service = {};

			var layServ = null;

			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				moduleContext.setLeadingService(leadingService);
				moduleContext.setMainService(mainService);
				var headerService = $injector.get('procurementPackageDataService');
				var validateService = $injector.get('procurementPackageValidationService');
				switch (guid) {
					case '1D58A4DA633A485981776456695E3241':// procurementPackageGridController
						layServ = $injector.get('procurementPackageUIStandardExtendedService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.dataServiceName = 'procurementPackageDataService';
						config.validationServiceName = 'procurementPackageValidationService';
						var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(headerService, layServ, validateService, '1d58a4da633a485981776456695e3241');
						config.standardConfigurationService = configService;
						break;
					case '2394ED1A419C49929BB3D3AAC991E628':// procurementPackageFormController
						layServ = $injector.get('procurementPackageUIStandardExtendedService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.dataServiceName = 'procurementPackageDataService';
						config.validationServiceName = 'procurementPackageValidationService';
						var configServ = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(headerService, layServ, validateService, '1d58a4da633a485981776456695e3241');
						config.standardConfigurationService = configServ;
						break;
					case 'DAF1942244AF4B3F84E87DB3E7B906C2':// procurementPackageEventGridController
						layServ = $injector.get('procurementPackageEventUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackageEventUIStandardService';
						config.dataServiceName = 'procurementPackageEventService';
						config.validationServiceName = 'procurementPackageEventValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'D2CD3A65CA444FDF89DC4C7025D53083':// procurementPackageEventFormController
						layServ = $injector.get('procurementPackageEventUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementPackageEventUIStandardService';
						config.dataServiceName = 'procurementPackageEventService';
						config.validationServiceName = 'procurementPackageEventValidationService';
						break;
					case '35DBEB11E37B46869A4DECC4FD01F56E':// procurementCommonTotalListController
						layServ = $injector.get('procurementCommonTotalUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonTotalUIStandardService';
						config.dataServiceName = 'procurementPackageTotalDataService';
						config.validationServiceName = 'procurementPackageTotalValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '518524D88C2F4C6FB3ED8DF003624BF8':// procurementCommonTotalDetailController
						layServ = $injector.get('procurementCommonTotalUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonTotalUIStandardService';
						config.dataServiceName = 'procurementPackageTotalDataService';
						config.validationServiceName = 'procurementPackageTotalValidationService';
						break;
					// procurementPackageRemarkController //1CV22AB7897R4B0F8196F4C5978EXA59
					case 'FC591E48F5E740AD84068D97747A31AD':// procurementPackagePackage2HeaderGridController
						layServ = $injector.get('procurementPackagePackage2HeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackagePackage2HeaderUIStandardService';
						config.dataServiceName = 'procurementPackagePackage2HeaderService';
						config.validationServiceName = 'procurementPackagePackage2HeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '6DD9B281D92540EF82E0A9D0E4CC12DF':// procurementPackagePackage2HeaderFormController
						layServ = $injector.get('procurementPackagePackage2HeaderUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementPackagePackage2HeaderUIStandardService';
						config.dataServiceName = 'procurementPackagePackage2HeaderService';
						config.validationServiceName = 'procurementPackagePackage2HeaderValidationService';
						break;
					case 'FB938008027F45A5804B58354026EF1C':// procurementCommonPrcItemListController.
						layServ = $injector.get('procurementCommonItemUIStandardService');
						config.layout = layServ.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceName = 'procurementPackageItemDataService';
						config.validationServiceName = 'procurementPackageItemValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'F68A72C231C942E78FB499F0F8EE0CB0':// procurementCommonPrcItemFormController
						layServ = $injector.get('procurementCommonItemUIStandardService');
						config = layServ.getStandardConfigForDetailView(moduleName);
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceName = 'procurementPackageItemDataService';
						config.validationServiceName = 'procurementPackageItemValidationService';
						break;
					/* case 'A476CF6A63564EA1B67BD703F11B0B0F'://procurementCommonItemTextController
					case '8C25191E61064DE2A4F576E39D1CB837'://procurementCommonItemTextController
					case '864613B03ABF4F7BBF7D35FEC6E7DF0D'://procurementCommonHeaderTextController//text
					case '885916F94A234818B9EB5976ED88D1B1'://procurementCommonHeaderTextController//plaintext
					case 'D0744D56872147899ED68B3533DF8442'://procurementCommonOverviewController */
					case '3899AD6A9FCE4B75981A350D4F5C1F6B':// procurementCommonDocumentListController
						layServ = $injector.get('procurementCommonDocumentUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonDocumentUIStandardService';
						config.dataServiceName = 'procurementPackageDocumentCoreDataService';
						config.validationServiceName = 'procurementPackageDocumentValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '502EBB0D396C4E80BA8A76DA068EC9EE':// procurementCommonDeliveryScheduleListController
						layServ = $injector.get('procurementCommonItemdeliveryUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemdeliveryUIStandardService';
						config.dataServiceName = 'procurementPackageDeliveryScheduleDataService';
						config.validationServiceName = 'procurementPackageDeliveryScheduleValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '4800DAB2A7CC488BB26C84EAB579C27B':// procurementCommonDeliveryScheduleFormController
						layServ = $injector.get('procurementCommonItemdeliveryUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItemdeliveryUIStandardService';
						config.dataServiceName = 'procurementPackageDeliveryScheduleDataService';
						config.validationServiceName = 'procurementPackageDeliveryScheduleValidationService';
						break;
					case 'D58E6439ACB14016B269896987C1DFF1':// procurementCommonMilestoneListController
						layServ = $injector.get('procurementCommonMilestoneUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceName = 'procurementPackageMilestoneDataService';
						config.validationServiceName = 'procurementPackageMilestoneValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'EDCDE96FB9AD445F9C6869BB7FA7E69F':// procurementCommonMilestoneFormController
						layServ = $injector.get('procurementCommonMilestoneUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceName = 'procurementPackageMilestoneDataService';
						config.validationServiceName = 'procurementPackageMilestoneValidationService';
						break;
					case '49DEF9119F124A4B98AB3FF47D9130F3':// procurementCommonGeneralsListController
						layServ = $injector.get('procurementCommonGeneralsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceName = 'procurementPackageGeneralsDataService';
						config.validationServiceName = 'procurementPackageGeneralsValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'D2AF94D6ACED40EDB102A0B890E9F8D8':// procurementCommonGeneralsFormController
						layServ = $injector.get('procurementCommonGeneralsUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceName = 'procurementPackageGeneralsDataService';
						config.validationServiceName = 'procurementPackageGeneralsValidationService';
						break;

					case '29633DBCE00E41C4B494F867D7699EA5': // boq Structure
						var prcBoqMainUIStandardService = $injector.get('procurementCommonPrcBoqMainUIStandardService');
						var prcBoqMainService = $injector.get('prcBoqMainService');
						config.layout = prcBoqMainUIStandardService.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.dataServiceProvider = function () {
							return prcBoqMainService.getService(mainService);
						};
						config.validationServiceName = 'boqMainElementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'B81511E936A24DC3B116C8523D844174':// BoQ Details
						config = $injector.get('procurementCommonPrcBoqMainUIStandardService').getStandardConfigForDetailView(moduleName);
						var prcBoqMainServiceDetail = $injector.get('prcBoqMainService');
						config.ContainerType = 'Detail';
						config.dataServiceProvider = function () {
							return prcBoqMainServiceDetail.getService(mainService);
						};
						config.validationServiceName = 'boqMainElementValidationService';
						break;
					// prcBoqMainNodeController //29633DBCE00E41C4B494F867D7699EA5
					// prcBoqMainSpecificationController //9223AC27140C4B5DB9AE1F09DA548C6F
					case 'D25A80A90961449EB38A0B54A34B6BBF':// procurementCommonPrcBoqListController -> procurement Boq
						layServ = $injector.get('procurementCommonPrcBoqUIStandardService');
						config.layout = layServ.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceName = 'procurementPackageBoqDataService';
						config.validationServiceName = 'procurementPackagePrcBoqValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '9697DCE34AFB430AAAA5788569AEFA51':// procurementCommonPrcBoqDetailController ->Procurement BoQ Detail
						layServ = $injector.get('procurementCommonPrcBoqUIStandardService');
						config = layServ.getStandardConfigForDetailView(moduleName);
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceName = 'procurementPackageBoqDataService';
						config.validationServiceName = 'procurementPackagePrcBoqValidationService';
						break;
					// not have controller  boqCopy //B937A12E559744E1BACDDBE3968FA171
					case '2682301EE1AD4B4AB523DF2361A9FB3F':// procurementPackageEstimateHeaderGridController
						layServ = $injector.get('procurementPackageEstHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackageEstHeaderUIStandardService';
						config.dataServiceName = 'procurementPackageEstimateHeaderDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '067BE143D76D4AD080660EF147349F1D':// packageEstimateLineItemListController
						layServ = $injector.get('estimateMainStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'estimateMainStandardConfigurationService';
						config.dataServiceName = 'procurementPackageEstimateLineItemDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '691DF3BC90574BE182ED007600A15D44':// procurementPackageEstimateResourceListController
						layServ = $injector.get('estimateMainResourceConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'estimateMainResourceConfigurationService';
						config.dataServiceName = 'procurementPackageEstimateResourceDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '6B32AE890E4A4317BF1C422E9A492F30':// procurementCommonCertificatesController
						layServ = $injector.get('procurementCommonCertificateUIStandardService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackageCertificateNewDataService';
						config.dataServiceName = 'procurementPackageCertificateNewDataService';
						config.validationServiceName = 'procurementPackageCertificatesValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '31423155A00D4FEC9DCAA61B9F51ED6E':// procurementCommonCertificatesFormController
						layServ = $injector.get('procurementCommonCertificateUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonCertificateUIStandardService';
						config.dataServiceName = 'procurementPackageCertificateNewDataService';
						config.validationServiceName = 'procurementPackageCertificatesValidationService';
						break;
					case '8A276C0574F94690A6087D9F22A06519':// procurementPackageImportGridController
						layServ = $injector.get('procurementPackagePackageImportUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackagePackageImportUIStandardService';
						config.dataServiceName = 'procurementPackageImportService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					/* case '9924C2AB872E4AAC83B8F06034901A2F'://procurementPackageImportWarningGridController
						config = procurementPackageImportWarningGridColumns.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackageImportWarningGridColumns';
						config.dataServiceName = 'procurementPackageImportWaringService';
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break; */
					// characteristic not have controller //5a8146afeee2404780c8a65e537f6f30
					case 'bc860c5260774379a8509355f4048f31':// procurementCommonSubcontractorListController
						layServ = $injector.get('procurementCommonSubcontractorUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceName = 'procurementPackageSubcontractorDataService';
						config.validationServiceName = 'procurementPackageSubcontractorValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '5516761ED60C449E9F8FEF302C4595D3':// procurementCommonSubcontractorFormController
						layServ = $injector.get('procurementCommonSubcontractorUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceName = 'procurementPackageSubcontractorDataService';
						config.validationServiceName = 'procurementPackageSubcontractorValidationService';
						break;
					case '4EAA47C530984B87853C6F2E4E4FC67E':// documentsProjectDocumentController
						layServ = $injector.get('documentProjectHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementPackageDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693':// documentsProjectDocumentRevisionController
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementPackageDocumentRevisionDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '8BB802CB31B84625A8848D370142B95C':// documentsProjectDocumentDetailController
						layServ = $injector.get('documentProjectHeaderUIStandardService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementPackageDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// documentsProjectDocumentRevisionDetailController
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementPackageDocumentRevisionDataService';
						config.validationServiceName = null;
						break;
					case '39d0d1c6753b49029b3c953165f8ceb7':// documentsProjectDocumentHistoryController
						layServ = $injector.get('documentProjectHistoryUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHistoryUIStandardService';
						config.dataServiceName = 'documentsProjectDocumentHistoryDataService';
						config.validationServiceName = null;
						break;
					case '41AFADE866F340C5B43760A3EA572DF9':
						layServ = $injector.get('packageItemAssignmentUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'packageItemAssignmentUIStandardService';
						config.dataServiceName = 'procurementPackageItemAssignmentDataService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '49892C71FFEE4DA096CECFD6834A29B9':
						layServ = $injector.get('packageItemAssignmentUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'packageItemAssignmentUIStandardService';
						config.dataServiceName = 'procurementPackageItemAssignmentDataService';
						config.validationServiceName = null;
						break;
					case '3F5E1709104C407EA503562029609DFD':// procurementCommonPaymentScheduleListController
						layServ = $injector.get('procurementCommonPaymentScheduleUIStandardService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPaymentScheduleUIStandardService';
						config.dataServiceName = 'procurementPackagePaymentScheduleDataService';
						config.validationServiceName = 'procurementPackagePaymentScheduleValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'AFB82D25D24442228408B32350839C22':// procurementCommonPaymentScheduleFormController
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementPackagePaymentScheduleDataService';
						config.dataServiceName = 'procurementPackagePaymentScheduleValidationService';
						config.validationServiceName = null;
						break;
					case 'a2525a0d73a546fa9990b56cccc0ebb5':// procurementCommonWarrantyController
						layServ = $injector.get('procurementCommonWarrantyUIStandardService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPaymentScheduleUIStandardService';
						config.dataServiceName = 'procurementCommonWarrantyDataService';
						config.validationServiceName = 'procurementCommonWarrantyValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '78a49c3ff455435bad377696a3bc6904':// procurementCommonWarrantyDetailController
						layServ = $injector.get('procurementCommonWarrantyUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonWarrantyDataService';
						config.dataServiceName = 'procurementCommonWarrantyValidationService';
						config.validationServiceName = null;
						break;
					// grouped imports from model.main
					case '3b5c28631ef44bb293ee05475a9a9513': // modelMainViewerLegendListController
					case 'd12461a0826a45f1ab76f53203b48ec6': // modelMainViewerLegendDetailController
						config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid(guid);
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
					case '303ec5db40624e68a858065a0b1a6b8d':// packageBoqChangeOverviewController   303ec5db40624e68a858065a0b1a6b8d
						layServ = $injector.get('prcPackageBoqChangeOverviewUIStandardService');
						config.layout = layServ.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Gird';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceName = 'procurementPackageBoqDataService';
						config.validationServiceName = 'procurementPackagePrcBoqValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'DE4193FE7CAF4AA1BD69C0FCAAC8041D':// procurementPackage2ExtBidderGridController
						layServ = $injector.get('procurementPackage2ExtBidderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackage2ExtBidderUIStandardService';
						config.dataServiceName = 'procurementPackage2ExtBidderService';
						config.validationServiceName = 'procurementPackage2ExtBidderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '1FA76A49988C4A548F45DD554CE30F3F':// procurementPackage2ExtBidderFormController
						layServ = $injector.get('procurementPackage2ExtBidderUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementPackage2ExtBidderUIStandardService';
						config.dataServiceName = 'procurementPackage2ExtBidderService';
						config.validationServiceName = 'procurementPackage2ExtBidderValidationService';
						break;

				}

				return config;
			};

			service.getNavigatorFieldByGuid = function getNavigatorByGuid(guid) {
				var navInfo = null;

				switch (guid) {
					case '1D58A4DA633A485981776456695E3241':
						navInfo = {field: 'Code', navigator: {moduleName: 'procurement.package', targetIdProperty: 'Id'}};
						break;
					case '2394ED1A419C49929BB3D3AAC991E628':
						navInfo = {field: 'Code', navigator: {moduleName: 'procurement.package', targetIdProperty: 'Id'}};
						break;
				}

				return navInfo;
			};

			return service;
		}
	]);
})(angular);