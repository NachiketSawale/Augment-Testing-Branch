(function (angular) {

	'use strict';
	let moduleName = 'procurement.requisition';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementRequisitionContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('procurementRequisitionContainerInformationService', ['$injector','procurementContextService', 'procurementRequisitionHeaderDataService',
		function ($injector,moduleContext,leadingService) {

			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				let layServ = null;
				// set context values
				moduleContext.setLeadingService(leadingService);
				moduleContext.setMainService(leadingService);
				let mainService = $injector.get('procurementRequisitionHeaderDataService');
				let uISerivce =  $injector.get('procurementRequisitionHeaderUIStandardService');
				let validateService = $injector.get('procurementRequisitionHeaderValidationService');
				switch (guid) {
					case '509F8B1F81EA475FBEBF168935641489':// procurementRequisitionHeaderGridController
					{
						layServ = $injector.get('procurementRequisitionHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.dataServiceName = 'procurementRequisitionHeaderDataService';
						config.validationServiceName = 'procurementRequisitionHeaderValidationService';
						let configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, '509f8b1f81ea475fbebf168935641489');
						config.standardConfigurationService = configService;
						break;
					}
					case 'CEEEE3E1A4CA4696B5AEBBE32F7CBDF6':// procurementRequisitionHeaderFormController
					{
						layServ = $injector.get('procurementRequisitionHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.dataServiceName = 'procurementRequisitionHeaderDataService';
						config.validationServiceName = 'procurementRequisitionHeaderValidationService';
						let configServ = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, '509f8b1f81ea475fbebf168935641489');
						config.standardConfigurationService = configServ;
						break;
					}
					case '5D58A4A9633A485986776456695E1241':// procurementCommonPrcItemListController
						layServ = $injector.get('procurementCommonItemUIStandardService');
						config.layout = layServ.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceName = 'procurementRequisitionItemDataService';
						config.validationServiceName = 'procurementRequisitionItemValidationService';
						config.listConfig = {initCalled: false, columns: []};

						break;
					case '7393ED1E419C49199BB3D3AAA993E628':// procurementCommonPrcItemFormController
						layServ = $injector.get('procurementCommonItemUIStandardService');
						config = layServ.getStandardConfigForDetailView(moduleName);
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceName = 'procurementRequisitionItemDataService';
						config.validationServiceName = 'procurementRequisitionItemValidationService';
						break;
					case '985F496B39EB4CD08D9CD4F9F3C8D1E4':// procurementCommonTotalListController
						layServ = $injector.get('procurementCommonTotalUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonTotalUIStandardService';
						config.dataServiceName = 'procurementRequisitionTotalDataService';
						config.validationServiceName = 'procurementRequisitionTotalValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '8A1689BCF59A4307A766432E7913657E':// procurementCommonTotalDetailController
						layServ = $injector.get('procurementCommonTotalUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonTotalUIStandardService';
						config.dataServiceName = 'procurementRequisitionTotalDataService';
						config.validationServiceName = 'procurementRequisitionTotalValidationService';
						break;
					// todo: graphic and view container we do not need currently,it will be implemented when needed.
					/* case '3B00687C0B074929931931A4B75A45DB'://procurementCommonOverviewController
					 case 'C8611FE10FBD4999868BCE45EF09A057'://procurementCommonHeaderTextController
					 case '112C7827943D4F00856FE78CEA98DCA0'://procurementCommonHeaderTextController plaintext
					 case 'E74AB9B6D95D44ABBA7E920E9FC231CE'://procurementCommonItemTextController
					 case 'E6F8A91E1F2A40DAA4AD92D5740EBC5A'://procurementCommonItemTextController plaintext //check container type */
					case 'A3F91320A8ED4A56BC711537A31F1A2A':// procurementCommonDeliveryScheduleListController
						layServ = $injector.get('procurementCommonItemdeliveryUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemdeliveryUIStandardService';
						config.dataServiceName = 'procurementRequisitionDeliveryScheduleDataService';
						config.validationServiceName = 'procurementRequisitionDeliveryScheduleValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '862C6FFCAC5B41B299EF2F1131F95636':// procurementCommonDeliveryScheduleFormController
						layServ = $injector.get('procurementCommonItemdeliveryUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItemdeliveryUIStandardService';
						config.dataServiceName = 'procurementRequisitionDeliveryScheduleDataService';
						config.validationServiceName = 'procurementRequisitionDeliveryScheduleValidationService';
						break;
					case '5516761ED60C449E9F8FEF302C4595D3':// procurementCommonContactController
						layServ = $injector.get('procurementCommonContactUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonContactUIStandardService';
						config.dataServiceName = 'procurementRequisitionContactDataService';
						config.validationServiceName = 'procurementRequisitionContactValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'EF539E3368C646569288157F9A7C7076':// procurementCommonContactDetailController
						layServ = $injector.get('procurementCommonContactUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonContactUIStandardService';
						config.dataServiceName = 'procurementRequisitionContactDataService';
						config.validationServiceName = 'procurementRequisitionContactValidationService';
						break;
					case '3304C905EC9249DCA401CF64FF00A765':// procurementCommonCertificatesController
						layServ = $injector.get('procurementCommonCertificateUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonCertificateUIStandardService';
						config.dataServiceName = 'procurementRequisitionCertificateNewDataService';
						config.validationServiceName = 'procurementRequisitionCertificatesValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'DB13E336F3B84535A20888BD2F6B82D7':// procurementCommonCertificatesFormController
						layServ = $injector.get('procurementCommonCertificateUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonCertificateUIStandardService';
						config.dataServiceName = 'procurementRequisitionCertificateNewDataService';
						config.validationServiceName = 'procurementRequisitionCertificatesValidationService';
						break;
					case '7C83FC5CEA7A4C8396D47877AE72B4B4':// procurementCommonMilestoneListController
						layServ = $injector.get('procurementCommonMilestoneUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceName = 'procurementRequisitionMilestoneDataService';
						config.validationServiceName = 'procurementRequisitionMilestoneValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '0BB47DCA70154864908D62C04BB5357A': // procurementCommonMilestoneFormController
						layServ = $injector.get('procurementCommonMilestoneUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceName = 'procurementRequisitionMilestoneDataService';
						config.validationServiceName = 'procurementRequisitionMilestoneValidationService';
						break;
					case '4006012996104D98A9A6BC11D4B0BEA4':// procurementCommonDocumentListController
					{
						layServ = $injector.get('procurementCommonDocumentUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonDocumentUIStandardService';
						config.dataServiceName = 'procurementRequisitionDocumentCoreDataService';
						config.validationServiceName = 'procurementRequisitionDocumentValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case 'B5431F508A644C73AE29CC90B8E6073B':// procurementCommonSubcontractorListController
					{
						layServ = $injector.get('procurementCommonSubcontractorUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceName = 'procurementRequisitionSubcontractorDataService';
						config.validationServiceName = 'procurementRequisitionSubcontractorValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case '21676554D0E7405EB6EC6EF75D4BD6DF':// procurementCommonSubcontractorFormController
					{
						layServ = $injector.get('procurementCommonSubcontractorUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceName = 'procurementRequisitionSubcontractorDataService';
						config.validationServiceName = 'procurementRequisitionSubcontractorValidationService';
						break;
					}
					case 'D3873514781444DC9F62255CA041E394':// procurementCommonGeneralsListController
					{
						layServ = $injector.get('procurementCommonGeneralsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceName = 'procurementRequisitionGeneralsDataService';
						config.validationServiceName = 'procurementRequisitionGeneralsValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case 'AAA310C6EF324CFBA4C90E4333D1EFB2':// procurementCommonGeneralsFormController
					{
						layServ = $injector.get('procurementCommonGeneralsUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceName = 'procurementRequisitionGeneralsDataService';
						config.validationServiceName = 'procurementRequisitionGeneralsValidationService';
						break;
					}
					// todo: currently implement grid/detail container,graphic and view container we do not need currently,it will be implemented when needed.
					/* case '58F71F3079C9450D9723FC7194E433C2'://prcBoqMainNodeController
					 case 'A6DCABDDC69F45408C3DD3A9504A2AC5'://prcBoqMainDetailFormController
					 case 'C88C6E155FE74A1992D316B36BE16BBB'://prcBoqMainSpecificationController //check */
					case '3AF545F7AA6B40498908EBF41ABB78D8':// procurementCommonPrcBoqListController -> procurement Boq
					{
						layServ = $injector.get('procurementCommonPrcBoqUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceName = 'procurementRequisitionBoqDataService';
						config.validationServiceName = 'procurementRequisitionPrcBoqValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case '9F89374BC6E64CB8944DEF315FEF8A4A':  // procurement Boq detail
					{
						layServ = $injector.get('procurementCommonPrcBoqUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceName = 'procurementPackageBoqDataService';
						config.validationServiceName = 'procurementPackagePrcBoqValidationService';
						break;
					}
					case '58F71F3079C9450D9723FC7194E433C2': // boq Structure
					{
						let prcBoqMainUIStandardService = $injector.get('procurementCommonPrcBoqMainUIStandardService');
						let prcBoqMainService = $injector.get('prcBoqMainService');
						config.layout = prcBoqMainUIStandardService.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.dataServiceProvider = function () {
							return prcBoqMainService.getService(leadingService);
						};
						config.validationServiceName = 'boqMainElementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case 'A6DCABDDC69F45408C3DD3A9504A2AC5':// BoQ Details
					{
						config = $injector.get('procurementCommonPrcBoqMainUIStandardService').getStandardConfigForDetailView(moduleName);
						let prcBoqMainServiceDetail = $injector.get('prcBoqMainService');
						config.ContainerType = 'Detail';
						config.dataServiceProvider = function () {
							return prcBoqMainServiceDetail.getService();
						};
						config.validationServiceName = 'boqMainElementValidationService';
						break;
					}
					// characteristic not have controller                  b3f1b7a59f40437f878f680a1bd4f8e7
					// containerheader not have controller              feaf4354d1ef454ea45fd6a40b1468c0
					/* case '9F8740ECF4FB46E9874633478F9F8585'://basicsUserFormFormDataController */
					case '4EAA47C530984B87853C6F2E4E4FC67E':// documentsProjectDocumentController
					{
						layServ = $injector.get('documentProjectHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementRequisitionDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case '8BB802CB31B84625A8848D370142B95C':// documentsProjectDocumentDetailController
					{
						layServ = $injector.get('documentProjectHeaderUIStandardService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementRequisitionDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					}
					case '684F4CDC782B495E9E4BE8E4A303D693':// documentsProjectDocumentRevisionController
					{
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementRequisitionDocumentRevisionDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// documentsProjectDocumentRevisionDetailController
					{
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementRequisitionDocumentRevisionDataService';
						config.validationServiceName = null;
						break;
					}
					case '423730D7024B4D8BABE269DDA3790B59':// procurementCommonPaymentScheduleListController
					{
						layServ = $injector.get('procurementCommonPaymentScheduleUIStandardService');
						config = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPaymentScheduleUIStandardService';
						config.dataServiceName = 'procurementRequisitionPaymentScheduleDataService';
						config.validationServiceName = 'procurementRequisitionPaymentScheduleValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case '7A7709EEFC9A4489B7EE00A0B8EB0781':// procurementCommonPaymentScheduleFormController
					{
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementRequisitionPaymentScheduleDataService';
						config.dataServiceName = 'procurementRequisitionPaymentScheduleValidationService';
						config.validationServiceName = null;
						break;
					}
					case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
					{
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					}
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
					{
						layServ = $injector.get('centralQueryClerkConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						break;
					}
					case '10ED32C7738B48B39E3A52BD41379E87':// procurementPackage2ExtBidderGridController
					{
						let package2ExtBidderService = $injector.get('procurementPackage2ExtBidderService');
						let load2ExtBidderInitDataGrid = package2ExtBidderService.loadControllerInitData();
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
					}
					case 'D4295B299A3D40C7AAFF8B61EB190B6F':// procurementPackage2ExtBidderFormController
					{
						let package2ExtBidderServiceDetail = $injector.get('procurementPackage2ExtBidderService');
						let load2ExtBidderInitDataDetail = package2ExtBidderServiceDetail.loadControllerInitData();
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
				}

				return config;
			};
			service.getNavigatorFieldByGuid = function getNavigatorByGuid(guid) {
				let navInfo = null;

				switch (guid) {
					case '509F8B1F81EA475FBEBF168935641489':
					case 'CEEEE3E1A4CA4696B5AEBBE32F7CBDF6':
						navInfo = {
							field: 'Code',
							navigator: {
								moduleName: 'procurement.requisition'
							}
						};
						break;
				}
				return navInfo;
			};

			return service;
		}
	]);
})(angular);