(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementContractContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */

	angular.module(moduleName).factory('procurementContractContainerInformationService', ['$injector', 'procurementContextService',
		function ($injector, moduleContext) {

			var service = {};

			// noinspection JSUnusedLocalSymbols
			var leadingService = $injector.get('procurementContractHeaderDataService'); // jshint ignore:line
			/* jshint -W074 */
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var layServ = null;
				var config = {};
				moduleContext.setMainService(leadingService);
				moduleContext.setLeadingService(leadingService);
				var uISerivce = $injector.get('procurementContractHeaderUIStandardService');
				var mainService = $injector.get('procurementContractHeaderDataService');
				var validateService = $injector.get('contractHeaderElementValidationService');
				switch (guid) {
					case 'E5B91A61DBDD4276B3D92DDC84470162':// procurementContractHeaderGridController
						layServ = $injector.get('procurementContractHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.dataServiceName = 'procurementContractHeaderDataService';
						config.validationServiceName = 'contractHeaderElementValidationService';
						config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, 'e5b91a61dbdd4276b3d92ddc84470162');
						break;
					case 'B3B0FDF482AE4973A4B6BBEA754876C3':// procurementContractHeaderFormController
						layServ = $injector.get('procurementContractHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.dataServiceName = 'procurementContractHeaderDataService';
						config.validationServiceName = 'contractHeaderElementValidationService';
						var configServ = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory').getService(mainService, uISerivce, validateService, 'e5b91a61dbdd4276b3d92ddc84470162');
						config.standardConfigurationService = configServ;
						break;
					case 'DEF60CC8FA044FE08FF72B773AF9D7EF':// procurementCommonPrcItemListController -> item grid
						layServ = $injector.get('procurementCommonItemUIStandardService');
						config.layout = layServ.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceName = 'procurementContractItemDataService';
						config.validationServiceName = 'procurementContractItemValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '32BD7DDE490A449EBAD0395FF8EFFD1E':// procurementCommonPrcItemFormController -> item form
						layServ = $injector.get('procurementCommonItemUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView(moduleName);
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItemUIStandardService';
						config.dataServiceName = 'procurementContractItemDataService';
						config.validationServiceName = 'procurementContractItemValidationService';
						break;
					case 'c18b6ffa74254e76bbedce5ea1c8fb9c':// procurementCommonPrcItem2PlantListController -> item2plant grid
						layServ = $injector.get('procurementCommonItem2PlantUIStandardService');
						config.layout = layServ.getStandardConfigForListView(moduleName);
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItem2PlantUIStandardService';
						config.dataServiceName = 'prcCommonItem2plantDataService';
						config.validationServiceName = '';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '1ddef8ec0a2340a2adf4c63908556ca1':// procurementCommonPrcItem2PlantFormController -> item2plant form
						layServ = $injector.get('procurementCommonItem2PlantUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView(moduleName);
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItem2PlantUIStandardService';
						config.dataServiceName = 'prcCommonItem2plantDataService';
						config.validationServiceName = '';
						break;
					case 'B19C1F681EEE490EBB3AC023854DB68D':// procurementCommonTotalListController
						layServ = $injector.get('procurementCommonTotalUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonTotalUIStandardService';
						config.dataServiceName = 'procurementContractTotalDataService';
						config.validationServiceName = 'procurementContractTotalValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '2060A0F87A74486DA566831AC64C8BE6':// procurementCommonTotalDetailController
						layServ = $injector.get('procurementCommonTotalUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonTotalUIStandardService';
						config.dataServiceName = 'procurementContractTotalDataService';
						config.validationServiceName = 'procurementContractTotalValidationService';
						break;
					case '314DF1FA485D4D1AA8722A086BD57C70':// procurementCommonOverviewController
						layServ = $injector.get('procurementCommonOverviewUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonOverviewUIStandardService';
						config.dataServiceName = 'procurementContractOverviewDataService';
						config.validationServiceName = 'procurementContractOverviewValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'AF859543498E499FB082581FF7DA6201':// procurementCommonHeaderTextController text   //container type check
						layServ = $injector.get('procurementCommonHeaderTextUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonHeaderTextUIStandardService';
						config.dataServiceName = 'procurementContractHeaderTextNewDataService';
						config.validationServiceName = 'procurementContractHeaderTextValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'AAC4FC428BB1456CBF580ECD442CD802':// procurementCommonHeaderTextController plainText   //container type check
						layServ = $injector.get('procurementCommonHeaderTextUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonHeaderTextUIStandardService';
						config.dataServiceName = 'procurementContractHeaderTextNewDataService';
						config.validationServiceName = 'procurementContractHeaderTextValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'F9C0779669854BD0ABD9836DF8C9A0D1':// procurementCommonItemTextController  itemTextsTitle //container type check
						layServ = $injector.get('procurementCommonItemTextUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemTextUIStandardService';
						config.dataServiceName = 'procurementContractItemTextNewDataService';
						config.validationServiceName = 'procurementContractItemTextValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '75A2C7C6748B4C7BBE489EE5575939C8':// procurementCommonItemTextController  itemPlainTitle  //container type check
						layServ = $injector.get('procurementCommonItemTextUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemTextUIStandardService';
						config.dataServiceName = 'procurementContractItemTextNewDataService';
						config.validationServiceName = 'procurementContractItemTextValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '3BC0EAFCAE734307B5CC0974405BA10F':// procurementCommonDeliveryScheduleListController
						layServ = $injector.get('procurementCommonItemdeliveryUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonItemdeliveryUIStandardService';
						config.dataServiceName = 'procurementCommonDeliveryScheduleDataService';
						config.validationServiceName = 'procurementContractDeliveryScheduleValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '57F7A43EDC2D40F198704F06E2B7AD5B':// procurementCommonDeliveryScheduleFormController
						layServ = $injector.get('procurementCommonItemdeliveryUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonItemdeliveryUIStandardService';
						config.dataServiceName = 'procurementCommonDeliveryScheduleDataService';
						config.validationServiceName = 'procurementContractDeliveryScheduleValidationService';
						break;
					case '5055BA9CE9C14F78B445A97D74BC8B90':// procurementCommonCertificatesController
						layServ = $injector.get('procurementCommonCertificateUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonCertificateUIStandardService';
						config.dataServiceName = 'procurementContractCertificateNewDataService';
						config.validationServiceName = 'procurementCommonCertificatesValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '2EF9CDB7254C4FB597DD79B86CEFA948':// procurementCommonCertificatesFormController
						layServ = $injector.get('procurementCommonCertificateUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonCertificateUIStandardService';
						config.dataServiceName = 'procurementContractCertificateNewDataService';
						config.validationServiceName = 'procurementCommonCertificatesValidationService';
						break;
					case 'E146E86368BF41FF9682B989A9DF3291':// procurementCommonMilestoneListController
						layServ = $injector.get('procurementCommonMilestoneUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceName = 'procurementContractMilestoneDataService';
						config.validationServiceName = 'procurementContractMilestoneValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '5F9769E2287446ECA7BAB31FA2BADF04':// procurementCommonMilestoneFormController
						layServ = $injector.get('procurementCommonMilestoneUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonMilestoneUIStandardService';
						config.dataServiceName = 'procurementContractMilestoneDataService';
						config.validationServiceName = 'procurementContractMilestoneValidationService';
						break;
					case '0613476F0A9A4A87BA62F830FFF99C7D':// procurementCommonPaymentScheduleListController
						layServ = $injector.get('procurementCommonPaymentScheduleUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPaymentScheduleUIStandardService';
						config.dataServiceName = 'procurementContractPaymentScheduleDataService';
						config.validationServiceName = 'procurementContractPaymentScheduleValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '6E93FB1D19E841D190F240C0013E164D':// procurementCommonPaymentScheduleFormController
						layServ = $injector.get('procurementCommonPaymentScheduleUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonPaymentScheduleUIStandardService';
						config.dataServiceName = 'procurementContractPaymentScheduleDataService';
						config.validationServiceName = 'procurementContractPaymentScheduleValidationService';
						break;
					case 'EC2420D04C8D458490C29EDBD9B9CAFC':// procurementCommonDocumentListController
						layServ = $injector.get('procurementCommonDocumentUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonDocumentUIStandardService';
						config.dataServiceName = 'procurementContractDocumentCoreDataService';
						config.validationServiceName = 'procurementCommonDocumentValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '2A7E35D3FDDC41A0ABB141DC2D868EBD':// procurementCommonSubcontractorListController
						layServ = $injector.get('procurementCommonSubcontractorUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceName = 'procurementContractSubcontractorDataService';
						config.validationServiceName = 'procurementCommonSubcontractorValidationDataService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '3C851039B52B493FBB86F7AE4A459EC0':// procurementCommonSubcontractorFormController
						layServ = $injector.get('procurementCommonSubcontractorUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonSubcontractorUIStandardService';
						config.dataServiceName = 'procurementContractSubcontractorDataService';
						config.validationServiceName = 'procurementCommonSubcontractorValidationDataService';
						break;
					case '54DC0AE6C79E44548AD5C84EDD339DB4':// procurementCommonGeneralsListController
						layServ = $injector.get('procurementCommonGeneralsUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceName = 'procurementContractGeneralsDataService';
						config.validationServiceName = 'procurementContractGeneralsValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '85354099AE654207B6AB5C3C770F4837':// procurementCommonGeneralsFormController
						layServ = $injector.get('procurementCommonGeneralsUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonGeneralsUIStandardService';
						config.dataServiceName = 'procurementContractGeneralsDataService';
						config.validationServiceName = 'procurementContractGeneralsValidationService';
						break;
					case 'DC5C6ADCDC2346E09ADADBF5508842DE':// prcBoqMainNodeController -> boq Structure
						config.layout = $injector.get('procurementContractPrcBoqMainUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementContractPrcBoqMainUIStandardService';
						config.dataServiceName = 'procurementContractBoqMainNodeDataService';
						config.validationServiceName = 'boqMainElementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '03CDF7295D694522A9AC00F1135FEE33':// prcBoqMainDetailFormController -> boq detail
						config = $injector.get('procurementContractPrcBoqMainUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementContractPrcBoqMainUIStandardService';// procurementCommonPrcBoqMainUIStandardService
						config.dataServiceName = 'procurementContractPrcBoqDetailDataService';// check
						config.validationServiceName = 'boqMainElementValidationService';
						break;
					case '51D11ADE0EAB47CC8AB1C5BACED1D5AF':
						break;// prcBoqMainSpecificationController  //check container type
					case 'A56A75CBE90545ECBFAFA5DE3F437F10':// procurementCommonPrcBoqListController -> procurement boq
						layServ = $injector.get('procurementCommonPrcBoqUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceName = 'procurementContractBoqDataService';
						config.validationServiceName = 'procurementContractPrcBoqValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '28A7DC156449404D83CD5109D4321461':// procurementCommonPrcBoqDetailController -> procurement boq detail
						layServ = $injector.get('procurementCommonPrcBoqUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementCommonPrcBoqUIStandardService';
						config.dataServiceName = 'procurementContractBoqDataService';
						config.validationServiceName = 'procurementContractPrcBoqValidationService';
						break;
					case '0F6AE8F1F34545559C008FCA53BE2754':// businesspartnerCertificateActualCertificateListController
						config.layout = $injector.get('procurementContractCertificateActualUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementContractCertificateActualUIStandardService';// businesspartnerCertificateToContractLayout
						config.dataServiceName = 'procurementContractCertificateActualDataService';
						config.validationServiceName = 'procurementContractCertificateActualValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '724E448CCE7249328149F8CE8F830940':// businesspartnerCertificateActualCertificateDetailController
						config = $injector.get('procurementContractCertificateActualUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementContractCertificateActualUIStandardService';
						config.dataServiceName = 'procurementContractCertificateActualDataService';
						config.validationServiceName = 'procurementContractCertificateActualValidationService';
						break;
					case '13FD1F28813A4772A4CE9074FAEFCB0A':// basicsUserFormFormDataController
						layServ = $injector.get('basicsUserFormFormDataCommonColumns');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsUserFormFormDataCommonColumns';
						config.dataServiceName = 'procurementContractFormDataDataService';
						config.validationServiceName = 'basicsUserformFormDataValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'c6079d3605874e1691c1221c77e8421a':// basicsWorkflowEntityApproverController
						layServ = $injector.get('basicsWorkflowEntityApproversCommonColumns');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'basicsWorkflowEntityApproversCommonColumns';
						config.dataServiceName = 'basicsWorkflowEntityApproversDataService';
						config.validationServiceName = null;
						config.listConfig = { initCalled: false, columns: [] };
						break;
					/* case 'd2b5525ef2ee49e4b820de6004dfb8c4'://basicsCharacteristicDataController
					 config.layout = $injector.get('procurementContractCharacteristicUIStandardService').getStandardConfigForListView();
					 config.ContainerType = 'Grid';
					 config.standardConfigurationService = 'procurementContractCharacteristicUIStandardService';
					 config.dataServiceName = 'procurementContractCharacteristicDataService';
					 config.validationServiceName = null;
					 config.validationServiceProvider = function validationServiceProvider() {
							return null;
						};
					 config.listConfig = { initCalled: false, columns: [] };
					 break; */
					case '4EAA47C530984B87853C6F2E4E4FC67E':// documentsProjectDocumentController
						layServ = $injector.get('documentProjectHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementContractDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '9fe6a21dfcca4747b817480e059db4d0':// documentsProjectDocumentController
						var uiService = 'procurementRfqDocumentForSendRfqUIStandardService';
						layServ = $injector.get(uiService);
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = uiService;
						config.dataServiceName = 'procurementContractConfirmProjectDocumentsService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '3473623dccd04ef7ad14a2cf18e74eb5':// contractDocumentController
						var uiService1 = 'procurementRfqDocumentForSendRfqUIStandardService';
						layServ = $injector.get(uiService1);
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = uiService1;
						config.dataServiceName = 'procurementContractDocumentDataService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '8BB802CB31B84625A8848D370142B95C':// documentsProjectDocumentDetailController
						layServ = $injector.get('documentProjectHeaderUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentProjectHeaderUIStandardService';
						config.dataServiceName = 'procurementContractDocumentDataService';
						config.validationServiceName = 'documentProjectHeaderValidationService';
						break;
					case '684F4CDC782B495E9E4BE8E4A303D693':// documentsProjectDocumentRevisionController
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementContractDocumentRevisionDataService';
						config.validationServiceName = null;
						config.validationServiceProvider = function validationServiceProvider() {
							return null;
						};
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'D8BE3B30FED64AAB809B5DC7170E6219':// documentsProjectDocumentRevisionDetailController
						layServ = $injector.get('documentsProjectDocumentRevisionUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'documentsProjectDocumentRevisionUIStandardService';
						config.dataServiceName = 'procurementContractDocumentRevisionDataService';
						config.validationServiceName = null;
						config.validationServiceProvider = function validationServiceProvider() {
							return null;
						};
						break;
					case '16d4b43815ce46bfb37189ec58d973bb': // procurementContractCallOffAgreementGridController
						var layCallOffAgreementGridServ = $injector.get('procurementContractCallOffAgreementUIStandardService');
						config.layout = layCallOffAgreementGridServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementContractCallOffAgreementUIStandardService';
						config.dataServiceName = 'procurementContractCallOffAgreementDataService';
						config.validationServiceName = 'procurementContractCallOffAgreementValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '7c9932be107843f4979bd93de61f72ad': // procurementContractCallOffAgreementFormController
						var layCallOffAgreementCallOffAgreementFormServ = $injector.get('procurementContractCallOffAgreementUIStandardService');
						config = layCallOffAgreementCallOffAgreementFormServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementContractCallOffAgreementUIStandardService';
						config.dataServiceName = 'procurementContractCallOffAgreementDataService';
						config.validationServiceName = 'procurementContractCallOffAgreementValidationService';
						break;
					case 'bf1dc8854bd945928f5f890af558a5e5': // procurementContractMandatoryDeadlineGridController
						var layMandatoryDeadlinGridServ = $injector.get('procurementContractMandatoryDeadlineUIStandardService');
						config.layout = layMandatoryDeadlinGridServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementContractMandatoryDeadlineUIStandardService';
						config.dataServiceName = 'procurementContractMandatoryDeadlineDataService';
						config.validationServiceName = 'procurementContractMandatoryDeadlineValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '4f95fed11a894177975dc33975405e42': // procurementContractMandatoryDeadlineFormController
						var layMandatoryDeadlinFormServ = $injector.get('procurementContractMandatoryDeadlineUIStandardService');
						config = layMandatoryDeadlinFormServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementContractMandatoryDeadlineUIStandardService';
						config.dataServiceName = 'procurementContractMandatoryDeadlineDataService';
						config.validationServiceName = 'procurementContractMandatoryDeadlineValidationService';
						break;
					case '1C5E0A69E0A343EEB3E9F9E700F171EB': // procurementContractAccountAssignmentGridController
						var layAccountAssignmentGridService = $injector.get('procurementContractAccountAssignmentUIStandardService');
						config.layout = layAccountAssignmentGridService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementContractAccountAssignmentUIStandardService';
						config.dataServiceName = 'procurementContractAccountAssignmentGetDataService';
						config.validationServiceName = 'procurementContractAccountAssignmentGetValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '41536BFCB3804F9DB46E1373AF41F561': // procurementContractAccountAssignmentFormController
						var layAccountAssignmentFormService = $injector.get('procurementContractAccountAssignmentUIStandardService');
						config = layAccountAssignmentFormService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementContractAccountAssignmentUIStandardService';
						config.dataServiceName = 'procurementContractAccountAssignmentGetDataService';
						config.validationServiceName = 'procurementContractAccountAssignmentGetValidationService';
						break;
					case '518782BB7E024921B68890D83332867A': // procurementContractCrewGridController
						var layCrewGridService = $injector.get('procurementContractCrewUIStandardService');
						config.layout = layCrewGridService.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementContractCrewUIStandardService';
						config.dataServiceName = 'procurementContractCrewDataService';
						config.validationServiceName = 'procurementContractCrewValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'CD70F3E8A849453DBCCE28E511B9BEA6': // procurementContractCrewFormController
						var layCrewFormService = $injector.get('procurementContractCrewUIStandardService');
						config = layCrewFormService.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementContractCrewUIStandardService';
						config.dataServiceName = 'procurementContractCrewDataService';
						config.validationServiceName = 'procurementContractCrewValidationService';
						break;
					case '9d95591bec814875bed99ec4919374b4': // procurementContractProjectChangeController
						var contractChangeGridServ = $injector.get('changeMainConfigurationService');
						config.layout = contractChangeGridServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'changeMainConfigurationService';
						config.dataServiceName = 'changeMainContractChangeDataService';
						config.validationServiceName = 'changeMainValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case 'e7b68e56026c414f9e50e3017467e753': // procurementContractProjectChangeDetailController
						var contractChangeFormServ = $injector.get('changeMainConfigurationService');
						config = contractChangeFormServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'changeMainConfigurationService';
						config.dataServiceName = 'changeMainContractChangeDataService';
						config.validationServiceName = 'changeMainValidationService';
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
					case '22307f2249d04061986c26508e5f6b1a': // ConHeaderApprovalListController
						layServ = $injector.get('procurementContractHeaderApprovalUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementContractHeaderApprovalUIStandardService';
						config.dataServiceName = 'procurementContractHeaderApprovalDataService';
						config.validationServiceName = 'procurementContractHeaderApprovalValidationService';
						config.listConfig = {initCalled: false, columns: []};
						break;
					case '0e76058ee10645f186195895a9502b7a': // ConHeaderApprovalListController
						layServ = $injector.get('procurementContractHeaderApprovalUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementContractHeaderApprovalUIStandardService';
						config.dataServiceName = 'procurementContractHeaderApprovalDataService';
						config.validationServiceName = 'procurementContractHeaderApprovalValidationService';
						break;
					case '9f5d33b39555424ba877447f2bfd1269':
						var billingSchemaService = $injector.get('basicsBillingSchemaServiceFactory');
						var billingSchemaValidation = $injector.get('basicsBillingSchemaValidationFactory');
						var billingSchemaUIStandardService = $injector.get('basicsBillingSchemaUIStandardServiceFactory');

						var dataService = billingSchemaService.getService('procurement.contract.billingschmema', leadingService);
						validateService = billingSchemaValidation.getService('procurement.contract.billingschmema', dataService);
						config.layout =  billingSchemaUIStandardService.getUIStandardService('procurement.contract.billingschmema').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.dataServiceProvider = function () {
							return dataService;
						};
						config.validationServiceProvider = function () {
							return validateService;
						};
						config.dataServiceName = 'prcContractBillingSchemaDataService';
						config.listConfig = {initCalled: false, columns: []};
						break;

					case '7879859FDBD94C1CA3462C7919B7BC6E':
						var packageEventService = $injector.get('procurementPackageEventService');
						var loadInitDataGrid = packageEventService.loadControllerInitData();
						layServ = $injector.get('procurementPackageEventUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'procurementPackageEventUIStandardService';
						config.dataServiceProvider = function () {
							return loadInitDataGrid.dataService;
						};
						config.validationServiceProvider = function () {
							return loadInitDataGrid.validationService;
						};
						config.listConfig = {initCalled: false, columns: []};
						break;

					case '27b072c4d6074bf9938718b79d95c967':
						var packageEventServiceDetail = $injector.get('procurementPackageEventService');
						var loadInitDataDetail = packageEventServiceDetail.loadControllerInitData();
						layServ = $injector.get('procurementPackageEventUIStandardService');
						config.layout = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'procurementPackageEventUIStandardService';
						config.dataServiceProvider = function () {
							return loadInitDataDetail.dataService;
						};
						config.validationServiceProvider = function () {
							return loadInitDataDetail.validationService;
						};
						break;
					case '54dbff34150c4db09300d900d521baf0':
						config.ContainerType = 'chart';
						config.dataServiceProvider = function () {
							return {
								getServiceName: function () {
									return 'contactCommentService';
								}
							};
						};
						break;
					case 'D3C764793B92489EABD741230A7C2741':// procurementPackage2ExtBidderGridController
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
					case '70790606C90B43D59702EF94833E8101':// procurementPackage2ExtBidderFormController
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
					case '931850b088e64590a395b0eb21e5f4dc':// Business Partner Container Contract Confirm Wizard
						// noinspection JSCheckFunctionSignatures
						var containerInformationServiceUtil = $injector.get('basicsCommonContainerInformationServiceUtil');
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'procurementRfqBusinessPartnerWizardUIStandardService',
							dataSvc: 'businesspartnerMainHeaderDataService',
							validationSvc: 'businesspartnerMainHeaderValidationService'
						});
						break;
					case'55bc306e62014bb6aa03336eb58d8c51': // cover letter container Contract Confirm Wizard
						config.ContainerType = 'chart';
						config.forceServiceCreate = true;
						config.dataServiceName = 'procurementContractConfirmCoverLetterService';
						break;
					case'8777043964bd45caab4f58af28a6a0b7': // report container Contract Confirm Wizard
						config.ContainerType = 'chart';
						config.forceServiceCreate = true;
						config.dataServiceName = 'procurementContractConfirmReportService';
						break;
				}

				return config;
			};
			service.getNavigatorFieldByGuid = function getNavigatorByGuid(guid) {
				var navInfo = null;

				switch (guid) {
					case 'E5B91A61DBDD4276B3D92DDC84470162':
					case 'B3B0FDF482AE4973A4B6BBEA754876C3':
						navInfo = {
							field: 'Code',
							navigator: {
								moduleName: 'procurement.contract',
								registerService: 'procurementContractHeaderDataService',
								targetIdProperty: 'Id'
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