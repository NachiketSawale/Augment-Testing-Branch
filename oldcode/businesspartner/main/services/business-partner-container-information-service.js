/**
 * Created by xsi on 2016-07-06.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businesspartnerMainContainerInformationService', ['$injector', 'basicsCommonContainerInformationServiceUtil',
		function ($injector, containerInformationServiceUtil) {
			var service = {};
			var leadingService = $injector.get('businesspartnerMainHeaderDataService');

			var documentProjectHeaderUIStandardService;
			/* jshint -W074 */
			service.getContainerInfoByGuid = function (guid) {
				var config = {};
				var uISerivce = $injector.get('businessPartnerMainBusinessPartnerUIStandardService');
				var mainService = $injector.get('businesspartnerMainHeaderDataService');
				var validateService = $injector.get('businesspartnerMainHeaderValidationService');
				switch (guid) {
					case '75dcd826c28746bf9b8bbbf80a1168e8':// Business Partners
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainBusinessPartnerUIStandardService',
							dataSvc: 'businesspartnerMainHeaderDataService',
							validationSvc: 'businesspartnerMainHeaderValidationService'
						}, null);
						var configService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, guid);
						config.standardConfigurationService = configService;

						break;
					case '411D27CFBB0B4643A368B19FA95D1B40':// Business Partners Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainBusinessPartnerUIStandardService',
							dataSvc: 'businesspartnerMainHeaderDataService',
							validationSvc: 'businesspartnerMainHeaderValidationService'
						});
						var configServ = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, '75dcd826c28746bf9b8bbbf80a1168e8');
						config.standardConfigurationService = configServ;
						break;
					case 'C87F45D900E640768A08D471BD476B2C':// Activities
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainActivityUIStandardService',
							dataSvc: 'businesspartnerMainActivityDataService',
							validationSvc: 'businesspartnerMainActivityValidationService'
						}, null);
						break;
					case 'B47A6A7BB5C7964D3ACB4E6A8FF4DAFB':// Activity Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainActivityUIStandardService',
							dataSvc: 'businesspartnerMainActivityDataService',
							validationSvc: 'businesspartnerMainActivityValidationService'
						});
						break;
					case '9299C9B28B41432DAC41FEE1D53EB868':// Actual Certificates
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businesspartnerCertificateCertificateUIStandardService',
							dataSvc: 'businesspartnerCertificateCertificateDataService',
							validationSvc: 'businesspartnerCertificateCertificateValidationService'
						}, null);
						break;
					case 'EB367EE13D5844D8B9092FEFC65E3B17':// Actual Certificates Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businesspartnerCertificateCertificateUIStandardService',
							dataSvc: 'businesspartnerCertificateCertificateDataService',
							validationSvc: 'businesspartnerCertificateCertificateValidationService'
						});
						break;
					case '9c8641a6e04b406d8481fb404ee7d85e':// Agreements
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businesspartnerMainAgreementUIStandardService',
							dataSvc: 'businesspartnerMainAgreementDataService',
							validationSvc: 'businesspartnerMainAgreementValidationService'
						}, null);
						break;
					case '20616D61A4A048029721C68BEBD8F64C':// Agreement Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businesspartnerMainAgreementUIStandardService',
							dataSvc: 'businesspartnerMainAgreementDataService',
							validationSvc: 'businesspartnerMainAgreementValidationService'
						});
						break;
					case '44BD90285B354396A90EFB0F8466C0C9':// Banks
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainBankUIStandardService',
							dataSvc: 'businesspartnerMainBankDataService',
							validationSvc: 'businesspartnerMainBankValidationService'
						}, null);
						break;
					case 'A484373668E242CD8E6F220874C4F533':// Bank Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainBankUIStandardService',
							dataSvc: 'businesspartnerMainBankDataService',
							validationSvc: 'businesspartnerMainBankValidationService'
						});
						break;
					case '73B015CA045844778ECA8E88BE4D7505':// Business Partner Relation
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerRelationUIStandardService',
							dataSvc: 'businessPartnerRelationDataService',
							validationSvc: 'businessPartnerRelationValidationService'
						}, null);
						break;
					case 'A2V6EQ1F6DJ84FD8BR6J25E6C3A43VUG':// Business Partner Relation Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerRelationUIStandardService',
							dataSvc: 'businessPartnerRelationDataService',
							validationSvc: 'businessPartnerRelationValidationService'
						});
						break;
					case '5E83DC4BE236407E94844A77DBD33010':// Business Partner FormData
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'basicsUserFormFormDataCommonColumns',
							dataSvc: 'basicsUserFormFormDataDataService',
							validationSvc: 'basicsUserformFormDataValidationService'
						}, null);
						break;
					case '791481c3c29d4e7ca10030977895ff83':// Contact FormData
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'basicsUserFormFormDataCommonColumns',
							dataSvc: 'basicsUserFormFormDataDataService',
							validationSvc: 'basicsUserformFormDataValidationService'
						}, null);
						break;
					case '72F38C9D2F4B429BAE5F70DA33068AE3':// Contacts
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainContactUIStandardService',
							dataSvc: 'businesspartnerMainContactDataService',
							validationSvc: 'businessPartnerMainContactValidationService'
						}, null);
						break;
					case '2BEA71E2F2BF42EAA0EA2FC60F8F5615':// Contact Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainContactUIStandardService',
							dataSvc: 'businesspartnerMainContactDataService',
							validationSvc: 'businessPartnerMainContactValidationService'
						});
						break;
					case '53AA731B7DA144CDBFF201A7DF205016':// Customer
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainCustomerUIStandardService',
							dataSvc: 'businesspartnerMainCustomerDataService',
							validationSvc: 'businesspartnerMainCustomerValidationService'
						}, null);
						break;
					case 'CB4E664D3A796AFA8FB47A5CD74BBAFB':// Customer Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainCustomerUIStandardService',
							dataSvc: 'businesspartnerMainCustomerDataService',
							validationSvc: 'businesspartnerMainCustomerValidationService'
						});
						break;
					case '4EAA47C530984B87853C6F2E4E4FC67E':// Documents Project
						documentProjectHeaderUIStandardService = $injector.get('documentProjectHeaderUIStandardService'); // rei@13.11 prevent loading with its dependecies
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
					case '8BB802CB31B84625A8848D370142B95C':// Documents Project Form
						documentProjectHeaderUIStandardService = $injector.get('documentProjectHeaderUIStandardService');
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
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'documentsProjectDocumentRevisionUIStandardService',
							dataSvc: 'documentsProjectDocumentRevisionDataService'
						}, null);
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// Documents Revision Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'documentsProjectDocumentRevisionUIStandardService',
							dataSvc: 'documentsProjectDocumentRevisionDataService'
						});
						break;
					case '47620dd38c874f97b75ee3b6ce342666': // DocumentClerkListController
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'centralQueryClerkConfigurationService',
							dataSvc: 'centralQueryClerkService',
							validationSvc: 'centralQueryClerkValidationService'
						}, null);
						break;
					case '7806e7a22b2142f8865ab189efe23c5a': // documentClerkDetailController
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'centralQueryClerkConfigurationService',
							dataSvc: 'centralQueryClerkService',
							validationSvc: 'centralQueryClerkValidationService'
						});
						break;
					case '72121AD6A4774CBEA673753606FB19D2':// Objects of Customer
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainRealestateUIStandardService',
							dataSvc: 'businesspartnerMainRealestateDataService',
							validationSvc: 'businesspartnerMainRealestateValidationService'
						}, null);
						break;
					case 'CDC1A6ECEE8946079C1CCCB1215B931B':// Objects of Customer Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainRealestateUIStandardService',
							dataSvc: 'businesspartnerMainRealestateDataService',
							validationSvc: 'businesspartnerMainRealestateValidationService'
						});
						break;
					case '1E2AC147D54F452ABC4FB6AD6BC62BED':// Registered for Company
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainBusinessPartner2CompanyUIStandardService',
							dataSvc: 'businessPartnerMainBP2CompanyDataService',
							validationSvc: 'businessPartnerMainBusinessPartner2CompanyValidationService'
						}, null);
						break;
					case 'F7A6A2B30BC776EA84B4964DFBE65CDA':// Registered for Company Form
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainBusinessPartner2CompanyUIStandardService',
							dataSvc: 'businessPartnerMainBP2CompanyDataService',
							validationSvc: 'businessPartnerMainBusinessPartner2CompanyValidationService'
						});
						break;
					case 'E48C866C714440F08A1047977E84481F':// Subsidiary
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainSubsidiaryUIStandardService',
							dataSvc: 'businesspartnerMainSubsidiaryDataService',
							validationSvc: 'businesspartnerMainSubsidiaryValidationService'
						}, null);
						break;
					case '79D7F116FE29482687375A6AFA9149FE':// Subsidiary Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainSubsidiaryUIStandardService',
							dataSvc: 'businesspartnerMainSubsidiaryDataService',
							validationSvc: 'businesspartnerMainSubsidiaryValidationService'
						});
						break;
					case '7F5057A88B974ACD9FB5A00CEE60A33D':// Suppliers
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainSupplierUIStandardService',
							dataSvc: 'businesspartnerMainSupplierDataService',
							validationSvc: 'businesspartnerMainSupplierValidationService'
						}, null);
						break;
					case '23F48D0283624C7BB3D5B57339D5F038':// Suppliers Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainSupplierUIStandardService',
							dataSvc: 'businesspartnerMainSupplierDataService',
							validationSvc: 'businesspartnerMainSupplierValidationService'
						});
						break;
					case 'eda4fc727cfd4d23a0c0118a01a57d83':  // Synchronize Contacts to Exchange Server
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerContact2ExchangeUIStandardService',
							dataSvc: 'businesspartnerContact2ExchangeDataService'
						}, null);
						break;
					case '7C29553FDAE541DDA903D4707D0C8DF3':// Update Request
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainUpdateRequestUIStandardService',
							dataSvc: 'businesspartnerMainUpdateRequestDataService'
						}, null);
						break;

					case '77964D3AA8FB47A6AF4BBCB4E65CDAFB':  // Procurement Structure
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businesspartnerMainPrcStructureUIStandardService',
							dataSvc: 'businesspartnerMainProcurementStructureDataService',
							validationSvc: 'businesspartnerMainPrcStructureValidationService'
						}, null);
						break;

					case '953895e120714ab4b6d7283c2fc50e14': // Evaluation
						var evaluationAdaptorHelper = $injector.get('commonBusinessPartnerEvaluationAdaptorHelper');
						var adaptorContainer = evaluationAdaptorHelper.createAdaptorContainer('953895e120714ab4b6d7283c2fc50e14', $injector.get('businessPartnerEvaluationAdaptorService'));
						var serviceContainer = adaptorContainer.serviceContainer;
						config.layout = serviceContainer.evaluationTreeUIStandardService.getStandardConfigForListView();
						config.ContainerType = 'chart';
						config.dataServiceProvider = function () {
							return serviceContainer.evaluationTreeService;
						};
						config.validationServiceProvider = function () {
							return serviceContainer.evaluationValidationService;
						};
						config.listConfig = {initCalled: false, columns: []};
						break;

					case '12394ae7fb944ba1b1006bd13864149a':  // Business Partner Relation
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerRelationUIStandardService',
							dataSvc: 'businessPartnerRelationDataService',
							validationSvc: 'businessPartnerRelationValidationService'
						}, null);
						break;

					case 'B3A462AFC69040048F267A15244AADB8': // customer satisfaction container
						config.ContainerType = 'chart';
						config.dataServiceName = 'businesspartnerMainRatingViewDataService';
						break;

					case '11DD248F6DB045029BA634BAA501FAAD': // business partner relation Chart container
						config.ContainerType = 'chart';
						config.dataServiceName = 'businessPartnerRelationChartService';
						break;

					case '4f864faad8094b4c97b3e1edb28d21f8':
						var characteristicDataService = $injector.get('basicsCharacteristicDataServiceFactory');
						var dataService = characteristicDataService.getService(leadingService, '2', '');

						config.ContainerType = 'chart';
						config.dataServiceProvider = function () {
							return dataService;
						};
						break;
					case 'ab732806d7ef4ffc92b6a4e60ff1fa67':// Region
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'businessPartnerMainRegionUIStandardService',
							dataSvc: 'businessPartnerMainRegionDataService',
						}, null);
						break;
					case '1f3b4fb819584c0395af28c85bd8a648':// Region Detail
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'businessPartnerMainRegionUIStandardService',
							dataSvc: 'businessPartnerMainRegionDataService',
							validationSvc: 'businessPartnerMainRegionValidationService',
						});
						break;
				}
				return config;
			};
			return service;
		}

	]);

})(angular);