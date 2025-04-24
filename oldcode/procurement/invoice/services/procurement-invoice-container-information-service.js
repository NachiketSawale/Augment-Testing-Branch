(function (angular) {

	'use strict';
	var moduleName = 'procurement.invoice';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementInvoiceContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('procurementInvoiceContainerInformationService', ['$injector', 'procurementInvoiceUIStandardService',
		'procurementInvoicePESUIStandardService', 'procurementInvoiceOtherUIStandardService',
		'procurementInvoiceRejectionUIStandardService', 'procurementInvoiceContractUIStandardService',
		'procurementInvoiceGeneralUIStandardService',
		'procurementInvoiceHeader2HeaderUIStandardService', 'procurementInvoiceReconciliation2GridColumns',
		'procurementInvoiceCertificateUIStandardService', 'procurementInvoiceImportResultUIStandardService',
		'procurementInvoiceImportWarningGridColumns', 'documentProjectHeaderUIStandardService',
		'documentsProjectDocumentRevisionUIStandardService', 'procurementInvoiceBillingSchemaUIStandardService',
		'procurementInvoiceAccountAssignmentUIStandardService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector, procurementInvoiceUIStandardService, procurementInvoicePESUIStandardService, procurementInvoiceOtherUIStandardService,
			procurementInvoiceRejectionUIStandardService, procurementInvoiceContractUIStandardService,
			procurementInvoiceGeneralUIStandardService,
			procurementInvoiceHeader2HeaderUIStandardService, procurementInvoiceReconciliation2GridColumns,
			procurementInvoiceCertificateUIStandardService, procurementInvoiceImportResultUIStandardService,
			procurementInvoiceImportWarningGridColumns, documentProjectHeaderUIStandardService,
			documentsProjectDocumentRevisionUIStandardService, procurementInvoiceBillingSchemaUIStandardService,
			procurementInvoiceAccountAssignmentUIStandardService) {

			var service = {};

			// noinspection JSUnusedLocalSymbols
			var leadingService = $injector.get('procurementInvoiceHeaderDataService'); // jshint ignore:line
			var uISerivce = $injector.get('procurementInvoiceUIStandardService');
			var validateService = $injector.get('invoiceHeaderElementValidationService');
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};
				switch (guid) {
					case 'da419bc1b8ee4a2299cf1dde81cf1884':// procurementInvoiceHeaderGridController
						config.layout = procurementInvoiceUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.dataServiceName = 'procurementInvoiceHeaderDataService';
						config.validationServiceName = 'invoiceHeaderElementValidationService';
						var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(leadingService, uISerivce, validateService, guid);
						config.standardConfigurationService = configService;
						break;
					case '295FE4EE5C974E0TTT3CFD5473574D2B':// procurementInvoiceHeaderFormController
						config = procurementInvoiceUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.dataServiceName = 'procurementInvoiceHeaderDataService';
						config.validationServiceName = 'invoiceHeaderElementValidationService';
						var configServ = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(leadingService, uISerivce, validateService, 'da419bc1b8ee4a2299cf1dde81cf1884');
						config.standardConfigurationService = configServ;
						break;
					case '49D1400580C74AB99C88C73B744DFDAA':// procurementInvoiceHeaderRejectionRemarkFormController
						config = procurementInvoiceUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.dataServiceName = 'procurementInvoiceHeaderDataService';
						config.validationServiceName = 'invoiceHeaderElementValidationService';
						config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(leadingService, uISerivce, validateService, 'da419bc1b8ee4a2299cf1dde81cf1884');
						break;
					case 'AB72D4BED5BA408BBB77B429E8A462EF':// procurementInvoicePesGridController
						config.layout = procurementInvoicePESUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoicePESUIStandardService';
						config.dataServiceName = 'procurementInvoicePESDataService';
						config.validationServiceName = 'procurementInvoicePESValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '1FC9C49861644F4ABB0F83E6ED6FD76A':// procurementInvoicePesFormController
						config = procurementInvoicePESUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoicePESUIStandardService';
						config.dataServiceName = 'procurementInvoicePESDataService';
						config.validationServiceName = 'procurementInvoicePESValidationService';
						break;
					case '4CF775EB68064CD5AD1F75E38AFFE41F':// procurementInvoiceOtherGridController
						config.layout = procurementInvoiceOtherUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceOtherUIStandardService';
						config.dataServiceName = 'procurementInvoiceOtherDataService';
						config.validationServiceName = 'procurementInvoiceOtherValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'D7B759C877E44D4D82735DAA65EBC340':// procurementInvoiceOtherFormController
						config = procurementInvoiceOtherUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoiceOtherUIStandardService';
						config.dataServiceName = 'procurementInvoiceOtherDataService';
						config.validationServiceName = 'procurementInvoiceOtherValidationService';
						break;
					case 'B5EA8B9CAE134B96A91FE364B4012121':// procurementInvoiceRejectionGridController
						config.layout = procurementInvoiceRejectionUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceRejectionUIStandardService';
						config.dataServiceName = 'procurementInvoiceRejectionDataService';
						config.validationServiceName = 'procurementInvoiceRejectionValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'B7F11367557442528540FF73850B8A1E':// procurementInvoiceRejectionFormController
						config = procurementInvoiceRejectionUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoiceRejectionUIStandardService';
						config.dataServiceName = 'procurementInvoiceRejectionDataService';
						config.validationServiceName = 'procurementInvoiceRejectionValidationService';
						break;
					case '75F8704D0EEE480BA3DFD2528D99ADA1':// procurementInvoiceContractGridController
						config.layout = procurementInvoiceContractUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceContractUIStandardService';
						config.dataServiceName = 'procurementInvoiceContractDataService';
						config.validationServiceName = 'procurementInvoiceContractValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7AB56CA10A254EC3BCEED4C8D9561AB2':// procurementInvoiceContractFormController
						config = procurementInvoiceContractUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoiceContractUIStandardService';
						config.dataServiceName = 'procurementInvoiceContractDataService';
						config.validationServiceName = 'procurementInvoiceContractValidationService';
						break;
					case 'B6F91E1D615D4501A546E1E999FE6153':// procurementInvoiceGeneralGridController
						config.layout = procurementInvoiceGeneralUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceGeneralUIStandardService';
						config.dataServiceName = 'procurementInvoiceGeneralDataService';
						config.validationServiceName = 'procurementInvoiceGeneralsValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '81D1F21FED6F47AE82D1ED8ABE850142':// procurementInvoiceGeneralFormController
						config = procurementInvoiceGeneralUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoiceGeneralUIStandardService';
						config.dataServiceName = 'procurementInvoiceGeneralDataService';
						config.validationServiceName = 'procurementInvoiceGeneralsValidationService';
						break;
					/* case '9752FD548EB240F98851C696E53CDE68'://basicsCommonCommentController
						config = procurementInvoiceUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';//check
						config.standardConfigurationService = 'procurementInvoiceUIStandardService';
						config.dataServiceName = 'procurementInvoiceHeaderDataService';
						config.validationServiceName = 'invoiceHeaderElementValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break; */
					case '5F8DCFED83324BBEB9704576B94651FC':// procurementInvoiceHeader2HeaderGridController
						config.layout = procurementInvoiceHeader2HeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceHeader2HeaderUIStandardService';
						config.dataServiceName = 'procurementInvoiceHeader2HeaderDataService';
						config.validationServiceName = 'procurementInvoiceHeader2HeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '11EC024D7DD3412BB53BEDA7741B6636':// procurementInvoiceCertificateGridController
						config.layout = procurementInvoiceCertificateUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceCertificateUIStandardService';
						config.dataServiceName = 'procurementInvoiceCertificateDataService';
						config.validationServiceName = 'procurementInvoiceCertificateValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '90D5538E5A104059930D394296E96D8B':// procurementInvoiceCertificateFormController
						config = procurementInvoiceCertificateUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoiceCertificateUIStandardService';
						config.dataServiceName = 'procurementInvoiceCertificateDataService';
						config.validationServiceName = 'procurementInvoiceCertificateValidationService';
						break;
					case '1EC2793FB7854C209EB128810298FA89': // invoiceBillingSchemaGridController
						config.layout = procurementInvoiceBillingSchemaUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceBillingSchemaUIStandardService';
						config.dataServiceName = 'invoiceBillingSchemaDataService';
						config.validationServiceName = 'procurementInvoiceBillingSchemaValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '0E14D4C48DF94E85B816119C2F95F20B':// procurementInvoiceReconciliation2GridController
						config.layout = procurementInvoiceReconciliation2GridColumns.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceReconciliation2GridColumns';
						config.dataServiceName = 'procurementInvoiceReconciliation2DataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '4EAA47C530984B87853C6F2E4E4FC67E':// documentsProjectDocumentController
						config.layout = documentProjectHeaderUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementInvoiceDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '8BB802CB31B84625A8848D370142B95C':// documentsProjectDocumentDetailController
						config = documentProjectHeaderUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementInvoiceDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693':// documentsProjectDocumentRevisionController
						config.layout = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementInvoiceDocumentRevisionDataService';
						config.validationServiceName = null;
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// documentsProjectDocumentRevisionDetailController
						config = documentsProjectDocumentRevisionUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementInvoiceDocumentRevisionDataService';
						config.validationServiceName = null;
						break;
					case '8AE614753E634735B87FCC3A8A033099':// businesspartnerCertificateActualCertificateListController
						config.layout = $injector.get('procurementInvoiceCertificateActualUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceCertificateActualUIStandardService';// businesspartnerCertificateToContractLayout
						config.dataServiceName = 'procurementInvoiceCertificateActualDataService';
						config.validationServiceName = 'procurementInvoiceCertificateActualValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'EF81E82E2EC3496D8916F3C486CD2778':// businesspartnerCertificateActualCertificateDetailController
						config = $injector.get('procurementInvoiceCertificateActualUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoiceCertificateActualUIStandardService';
						config.dataServiceName = 'procurementInvoiceCertificateActualDataService';
						config.validationServiceName = 'procurementInvoiceCertificateActualValidationService';
						break;
					case '94D42D2AD7474BD6B4FF95C437ECE934': // procurementInvoicetAccountAssignmentGridController
						config.layout = procurementInvoiceAccountAssignmentUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementInvoiceAccountAssignmentUIStandardService';
						config.dataServiceName = 'procurementInvoiceAccountAssignmentGetDataService';
						config.validationServiceName = 'procurementInvoiceAccountAssignmentGetValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '1EB6D69BB01847C2B6FFC59254E2F3C1': // procurementInvoiceAccountAssignmentFormController
						config = procurementInvoiceAccountAssignmentUIStandardService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementInvoiceAccountAssignmentUIStandardService';
						config.dataServiceName = 'procurementInvoiceAccountAssignmentGetDataService';
						config.validationServiceName = 'procurementInvoiceAccountAssignmentGetValidationService';
						break;
					case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
						config.layout = $injector.get('centralQueryClerkConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
						var deailtLayServ = $injector.get('centralQueryClerkConfigurationService');
						config = deailtLayServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'centralQueryClerkConfigurationService';
						config.dataServiceName = 'centralQueryClerkService';
						config.validationServiceName = 'centralQueryClerkValidationService';
						break;
					case 'D4F39AE248194046A641AD22769C0607':// procurementPackage2ExtBidderGridController
						var package2ExtBidderService = $injector.get('procurementPackage2ExtBidderService');
						var load2ExtBidderInitDataGrid = package2ExtBidderService.loadControllerInitData();
						config.layout = $injector.get('procurementPackage2ExtBidderUIStandardService').getStandardConfigForListView();
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
					case 'A31906810F4F47CA87BF081D37A393C8':// procurementPackage2ExtBidderFormController
						var package2ExtBidderServiceDetail = $injector.get('procurementPackage2ExtBidderService');
						var load2ExtBidderInitDataDetail = package2ExtBidderServiceDetail.loadControllerInitData();
						config =  $injector.get('procurementPackage2ExtBidderUIStandardService').getStandardConfigForDetailView();
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