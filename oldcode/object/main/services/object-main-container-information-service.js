(function (angular) {
	'use strict';
	var objectMainModule = angular.module('object.main');
	/**
	 * @ngdoc service
	 * @name objectMainContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	objectMainModule.service('objectMainContainerInformationService', ObjectMainContainerInformationService);

	ObjectMainContainerInformationService.$inject = ['_', '$injector', 'platformLayoutHelperService', 'objectMainConstantValues', 'basicsLookupdataConfigGenerator','objectCommonDragDropService'];

	function ObjectMainContainerInformationService(_, $injector, platformLayoutHelperService, objectMainConstantValues, basicsLookupdataConfigGenerator, objectCommonDragDropService) {
		const self = this;
		let dynamicConfigurations = {};
		const guids = objectMainConstantValues.uuid.container;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {
				case '5aab63404ccf4e6aa31c8ac386b28850': // objectMainHeaderListController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('34ce2fbe7aa74734b5389b19df8646b6');
					break;
				case '258804845bbb4a6fa8357a4df794dc5a': // objectMainHeaderDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('e542d3f1f9374fd8815de4aef382b6a1');
					break;
				case '8c8895bd673e427995f174d41ca54e0b': // objectMainLevelListController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('230a2d63c31e429486325c62660afcca');
					break;
				case '49476607b99440b183ef193413d78d85': // objectMainLevelDetailController
					config = $injector.get('modelMainContainerInformationService').getContainerInfoByGuid('cb60bceef3e243929c9e2b3d1a1292cb');
					break;
				case 'f863261368cb4f2c90224df8b9847afe': // objectMainUnitListController
					layServ = $injector.get('objectMainUnitUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainUnitUIStandardService';
					config.dataServiceName = 'objectMainUnitService';
					config.validationServiceName = 'objectMainUnitValidationService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						dragDropService: objectCommonDragDropService,
						type: 'object.main',
						pinningContext: { required: ['project.main', 'object.main'] }
					};
					break;
				case '3d333462cfc848cb95e79b82e718101a': // objectMainUnitDetailController
					layServ = $injector.get('objectMainUnitUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainUnitUIStandardService';
					config.dataServiceName = 'objectMainUnitService';
					config.validationServiceName = 'objectMainUnitValidationService';
					break;
				case '283a88b5a04a423d938180b0774c3040': // objectMainUnitAreaListController
					layServ = $injector.get('objectMainUnitAreaUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainUnitAreaUIStandardService';
					config.dataServiceName = 'objectMainUnitAreaService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '1f1e8da2c5a54d4e83ba29cadf13fcd2': // objectMainUnitAreaDetailController
					layServ = $injector.get('objectMainUnitAreaUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainUnitAreaUIStandardService';
					config.dataServiceName = 'objectMainUnitAreaService';
					config.validationServiceName = '';
					break;
				case 'f288176f4614422f95e33d79dee8dba5': // objectMainUnitPriceListController
					layServ = $injector.get('objectMainUnitPriceUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainUnitPriceUIStandardService';
					config.dataServiceName = 'objectMainUnitPriceService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'f73af0eec7524ed7824884e67b003c7f': // objectMainUnitPriceDetailController
					layServ = $injector.get('objectMainUnitPriceUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainUnitPriceUIStandardService';
					config.dataServiceName = 'objectMainUnitPriceService';
					config.validationServiceName = '';
					break;
				case '0fe9e5cff36745768670d19df28dfe9f': // objectMainDocumentListController
					layServ = $injector.get('objectMainDocumentUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainDocumentUIStandardService';
					config.dataServiceName = 'objectMainDocumentService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '916d6a951ca640808cfe0b80d634b20b': // objectMainDocumentDetailController
					layServ = $injector.get('objectMainDocumentUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainDocumentUIStandardService';
					config.dataServiceName = 'objectMainDocumentService';
					config.validationServiceName = '';
					break;
				case '2bdfd213a302401c88fbff8bc80df3c5': // objectMainProspectDocumentListController
					layServ = $injector.get('objectMainProspectDocUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainProspectDocUIStandardService';
					config.dataServiceName = 'objectMainProspectDocService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '7c50d259385e4567afad3544e9047df4': // objectMainProspectDocumentDetailController
					layServ = $injector.get('objectMainProspectDocUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainProspectDocUIStandardService';
					config.dataServiceName = 'objectMainProspectDocService';
					config.validationServiceName = '';
					break;
				case '5ce1540a85eb4de0b13ddbd7b7ab09cf': // objectMainProspectActivityListController
					layServ = $injector.get('objectMainProspectActivityUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainProspectActivityUIStandardService';
					config.dataServiceName = 'objectMainProspectActivityService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '3c4e746e02154eca9f1e8f8fc832d702': // objectMainProspectActivityDetailController
					layServ = $injector.get('objectMainProspectActivityUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainProspectActivityUIStandardService';
					config.dataServiceName = 'objectMainProspectActivityService';
					config.validationServiceName = '';
					break;
				case '47c8300404b9436282791d79db6d9cb6': // objectMainProspectChangeListController
					layServ = $injector.get('objectMainProspectChangeUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainProspectChangeUIStandardService';
					config.dataServiceName = 'objectMainProspectChangeService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'de707626032f4bd3bc6e6edeee75dccc': // objectMainProspectChangeDetailController
					layServ = $injector.get('objectMainProspectChangeUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainProspectChangeUIStandardService';
					config.dataServiceName = 'objectMainProspectChangeService';
					config.validationServiceName = '';
					break;
				case '98e77e63a57443f096284f2ee00e8f66': // objectMainProspectListController
					layServ = $injector.get('objectMainProspectUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainProspectUIStandardService';
					config.dataServiceName = 'objectMainProspectService';
					config.validationServiceName = 'objectMainProspectValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '3ed83dc6e18f4565855eff19902418fb': // objectMainProspectDetailController
					layServ = $injector.get('objectMainProspectUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainProspectUIStandardService';
					config.dataServiceName = 'objectMainProspectService';
					config.validationServiceName = 'objectMainProspectValidationService';
					break;
				case 'e175af97563843b9925adcd0b60e8d3b': // objectMainUnitPhotoListController
					layServ = $injector.get('objectMainUnitPhotoUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainUnitPhotoUIStandardService';
					config.dataServiceName = 'objectMainUnitPhotoService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '42e90f3cbc2f41afb9d46268d11a3bbe': // objectMainUnitPhotoDetailController
					layServ = $injector.get('objectMainUnitPhotoUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainUnitPhotoUIStandardService';
					config.dataServiceName = 'objectMainUnitPhotoService';
					config.validationServiceName = '';
					break;
				case '687b0fd5315f47e8a109715375f2596a': // objectMainUnit2ObjUnitListController
					layServ = $injector.get('objectMainUnit2ObjUnitUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainUnit2ObjUnitUIStandardService';
					config.dataServiceName = 'objectMainUnit2ObjUnitService';
					config.validationServiceName = 'objectMainUnit2ObjUnitValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'c05eef6a46bf479391bd129480faf3de': // objectMainUnit2ObjUnitDetailController
					layServ = $injector.get('objectMainUnit2ObjUnitUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainUnit2ObjUnitUIStandardService';
					config.dataServiceName = 'objectMainUnit2ObjUnitService';
					config.validationServiceName = 'objectMainUnit2ObjUnitValidationService';
					break;
				case '2bb446f7ffa94d679d8ea9e7005d6431': // objectMainMeterTypeReadingListController
					layServ = $injector.get('objectMainMeterTypeReadingUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'objectMainMeterTypeReadingUIStandardService';
					config.dataServiceName = 'objectMainMeterTypeReadingService';
					config.validationServiceName = '';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case 'fe7f54b726f442488eec07c925cf152f': // objectMainMeterTypeReadingDetailController
					layServ = $injector.get('objectMainMeterTypeReadingUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'objectMainMeterTypeReadingUIStandardService';
					config.dataServiceName = 'objectMainMeterTypeReadingService';
					config.validationServiceName = '';
					break;
				case guids.unitInstallmentList:
					config = platformLayoutHelperService.getStandardGridConfig(self.getObjectMainUnitInstallmentServiceInfo(), self.getObjectMainUnitInstallmentLayout);
					break;
				case guids.unitInstallmentDetails:
					config = platformLayoutHelperService.getStandardDetailConfig(self.getObjectMainUnitInstallmentServiceInfo(), self.getObjectMainUnitInstallmentLayout);
					break;
				default:
					config = self.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}

			return config;
		};

		this.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		this.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		this.getObjectMainUnitInstallmentServiceInfo = function getObjectMainUnitInstallmentServiceInfo() {
			return{
				standardConfigurationService: 'objectMainUnitInstallmentLayoutService',
				dataServiceName: 'objectMainUnitInstallmentDataService',
				validationServiceName: 'objectMainUnitInstallmentValidationService'
			};
		};

		this.getObjectMainUnitInstallmentLayout = function getObjectMainUnitInstallmentLayout() {
			var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0','object.main.unitInstallment',
				['description', 'installmentfk', 'installmentagreementstatefk', 'commenttext', 'description1', 'description2', 'duedate', 'billcreationdate', 'remark', 'specification', 'installmentpercent']);
			 res.overloads = platformLayoutHelperService.getOverloads(['installmentfk','installmentagreementstatefk'],self);
			res.addAdditionalColumns= true;
			// res.overloads.totaltime = {readonly: true};
			return res;
		};

		this.getOverload = function getOverloads(overload) {
			var ovl = null;

			switch(overload) {
				case 'installmentfk': ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.installment', null, {
					field: 'InstallmentagreementFk',
					filterKey: 'basics-installment-filter',
					customIntegerProperty: 'OBJ_INSTALLMENTAGREEMENT_FK'
				}); break;
				case 'installmentagreementstatefk': ovl = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.objectinstallmentagreementstatus', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusIconService'
				}); break;

			}

			return ovl;
		};
	}
})(angular);