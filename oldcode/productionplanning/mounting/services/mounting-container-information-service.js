/**
 * Created by anl on 7/20/2017.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).factory('productionplanningMountingContainerInformationService', MountingContainerInformationService);

	MountingContainerInformationService.$inject = ['$injector', 'ppsCommonLoggingHelper',
		'ppsCommonContainerInfoProvider', 'ppsCommonClipboardService'];

	function MountingContainerInformationService($injector, ppsCommonLoggingHelper,
												 containerInfoProvider, ppsCommonClipboardService) {

		var service = {};
		var dynamicConfigurations = {};
		$injector.get('ppsCommonBizPartnerOwnerService').setModule(moduleName);

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {
				case '42859c49547445f3862a4ec10588db45': //RequisitionListController
					layServ = $injector.get('productionplanningMoungtingRequisitionUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningMoungtingRequisitionUIStandardService';
					config.dataServiceName = 'productionplanningMountingRequisitionDataService';
					config.validationServiceName = 'productionpalnningMountingRequisitionValidationService';
					config.listConfig = {initCalled: false, columns: [], type: 'productionplanning.mounting', dragDropService: ppsCommonClipboardService};
					extendValidation4Logging(config); // extend validation for logging
					break;
				case '0ecc8ce2c72c4e99a17d38b3bb7e5ff4': //RequisitionDetailController
					layServ = $injector.get('productionplanningMoungtingRequisitionUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningMoungtingRequisitionUIStandardService';
					config.dataServiceName = 'productionplanningMountingRequisitionDataService';
					config.validationServiceName = 'productionpalnningMountingRequisitionValidationService';
					extendValidation4Logging(config); // extend validation for logging
					break;
				case '5259b8bfb2c645c88a56acc693decd8c': //MntRequisitionListInProjectController
					layServ = $injector.get('productionplanningMoungtingRequisitionUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningMoungtingRequisitionUIStandardService';
					config.dataServiceName = 'productionplanningMountingRequisitionForProjectDataService';
					config.validationServiceName = 'productionpalnningMountingRequisitionForProjectValidationService';
					config.listConfig = {initCalled: false, columns: []};
					break;
				case '06a28e3323cc476ca62c4b2966aec398': //MntRequisitionDetailInProjectController
					layServ = $injector.get('productionplanningMoungtingRequisitionUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningMoungtingRequisitionUIStandardService';
					config.dataServiceName = 'productionplanningMountingRequisitionForProjectDataService';
					config.validationServiceName = 'productionpalnningMountingRequisitionForProjectValidationService';
					break;
				case '64adfcf420784ac29a06c0cbac339611': //productionplanningMountingReq2BizPartnerListController
					config = getBizPartnerContainerConfig(true);
					break;
				case '64121517908e403e980ff5f6d641e03f': //productionplanningMountingReq2BizPartnerDetailController
					config = getBizPartnerContainerConfig();
					break;
				case '3ffa784706a24bd99918b3d72ed52687': //productionplanningMountingReq2ContactListController
					config = getContactContainerConfig(true);
					break;
				case 'b6b09aa862f44939a28afd2f2de2b69f': //productionplanningMountingReq2ContactDetailController
					config = getContactContainerConfig();
					break;
				case '47974d7fd12f445391d94645e230a6d8':
					config = getMatReqContainerInfo(true);
					break;
				case '998248965ced4c4b85e65c89de6f6318':
					config = getMatReqContainerInfo(false);
					break;
				case '007aa530d9f64420b13aa02b9e6f0dcc':
					config = getTrsGoodsContainerInfo(true);
					break;
				case '107aa530d9f64420b13aa02b9e6f0dcc':
					config = getTrsGoodsContainerInfo(false);
					break;
				case '1ca707d7fcb143139571e46c10be6a9a':
					config = {};
					config.dataServiceName = 'productionplanningMountingTrsRequisitionDataService';
					break;
				case '4c4c4544003532108034b8c04f485032':
					config = {};
					config.dataServiceName = 'productionplanningMountingTrsRequisitionAllDataService';
					break;
				default:
					config = service.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}

			return config;
		};

		function extendValidation4Logging(config) {
			ppsCommonLoggingHelper.extendValidationIfNeeded(
				$injector.get(config.dataServiceName),
				$injector.get(config.validationServiceName),
				{
					typeName: 'RequisitionDto',
					moduleSubModule: 'ProductionPlanning.Mounting'
				}
			);
		}

		service.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		service.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};

		function getMatReqContainerInfo(isGrid) {
			return containerInfoProvider.getContainerInfo({
				moduleName: moduleName,
				parentService: $injector.get('productionplanningMountingTrsRequisitionDataService'),
				isGrid: isGrid,
				dataServiceName: 'transportplanningRequisitionMatRequisitionDataService',
				standardConfigurationService: 'transportplanningRequisitionMatRequisitionUIStandardService',
				validationServiceName: 'transportplanningRequisitionMatRequisitionValidationService'
			});
		}

		function getTrsGoodsContainerInfo(isGrid) {
			return containerInfoProvider.getContainerInfoA({
				isGrid: isGrid,
				moduleName: moduleName,
				parentService: 'productionplanningMountingTrsRequisitionDataService',
				dataServiceFactory: 'transportplanningRequisitionTrsGoodDataServiceFactory',
				UIStandardServiceFactory: 'transportplanningRequisitionTrsGoodsUIStandardServiceFactory',
				validationServiceFactory: 'transportplanningRequisitionTrsGoodValidationFactory'
			});
		}

		function getBizPartnerContainerConfig(isGrid){
			var bizPartnerService = GetBizPartnerDataService();
			var bizPartnerVilidationService = $injector.get('ppsCommonBizPartnerValidationServiceFactory').getService(bizPartnerService);

			var config = {};
			if(isGrid === true){
				config.layout = $injector.get('ppsCommonBizPartnerUIStandardService').getStandardConfigForListView();
				config.ContainerType = 'Grid';
				config.listConfig = { initCalled: false, columns: [] };
			}else {
				config.layout = $injector.get('ppsCommonBizPartnerUIStandardService').getStandardConfigForDetailView();
				config.ContainerType = 'Detail';
			}
			config.standardConfigurationService = 'ppsCommonBizPartnerUIStandardService';
			config.dataServiceName = bizPartnerService;
			config.validationServiceName = bizPartnerVilidationService;
			return config;
		}

		function getContactContainerConfig(isGrid){
			var contactDataService = GetContactDataService();
			var contactVilidationService = $injector.get('ppsCommonBizPartnerContactValidationServiceFactory').getService(contactDataService);

			var config = {};
			if(isGrid === true){
				config.layout = getContactListLayout(contactDataService);
				config.ContainerType = 'Grid';
				config.listConfig = { initCalled: false, columns: [] };
			}else {
				config.layout = getContactDetailLayout(contactDataService);
				config.ContainerType = 'Detail';
			}
			config.standardConfigurationService = 'ppsCommonBizPartnerContactUIStandardService';
			config.dataServiceName = contactDataService;
			config.validationServiceName = contactVilidationService;
			return config;
		}

		function GetBizPartnerDataService(){
			var parentServ = $injector.get('productionplanningMountingRequisitionDataService');
			return $injector.get('ppsCommonBizPartnerServiceFactory').getService({
				serviceKey: 'productionplanning.mounting.bizpartner',
				parentService: parentServ,
				projectFk: 'ProjectFk',
				ppsHeaderFk: 'PpsHeaderFk',
				mntReqFk: 'Id'
			});
		}

		function GetContactDataService(){
			return $injector.get('ppsCommonBizPartnerContactServiceFactory').getService({
				serviceKey: 'productionplanning.mounting.bizpartnercontact',
				parentService: GetBizPartnerDataService()
			});
		}

		function setContactOptions(opts, contactDataService){
			opts.showDetailButton = true;
			opts.detailOptions = $injector.get('businessPartnerContactDetailOptions');
			opts.detailOptions.onOk = function(result) {
				const selectItem = contactDataService.getSelected();
				contactDataService.loadSubItemList(result).then(() =>
					contactDataService.deselect().then(() =>
						contactDataService.setSelected(selectItem))
				);
			};
			opts.showAddButton = true;
			opts.createOptions = _.clone($injector.get('businessPartnerContactCreateOptions'));
			opts.createOptions.creationData = function () {
				var selectedItem = contactDataService.getSelected();
				if (selectedItem) {
					return {mainItemId: selectedItem.BusinessPartnerFk};
				}
			};
		}

		function getContactListLayout(contactDataService){
			var listLayout = $injector.get('ppsCommonBizPartnerContactUIStandardService').getStandardConfigForListView();
			listLayout.columns = replaceTelephoneNumberCol(listLayout.columns);
			var lookupOpts = _.find(listLayout.columns, {id: 'contactfk'}).editorOptions.lookupOptions;
			setContactOptions(lookupOpts, contactDataService);
			return listLayout;
		}

		function getContactDetailLayout(contactDataService){
			var detailLayout = $injector.get('ppsCommonBizPartnerContactUIStandardService').getStandardConfigForDetailView();
			var opts = _.find(detailLayout.rows, {rid: 'contactfk'}).options;
			setContactOptions(opts, contactDataService);
			return detailLayout;
		}

		function replaceTelephoneNumberCol(columns) {
			// make telephone number column editable
			const cols = columns.filter(col => col.id !== 'telephonenumberstring' && col.id !== 'telephonenumberfk');
			cols.push(getTelephoneNumberColumnConfig());
			return cols;

			function getTelephoneNumberColumnConfig() {
				return {
					'id': 'telephonenumberfk',
					'field': 'TelephoneNumber',
					'name': 'Telephone',
					'name$tr$': 'cloud.common.TelephoneDialogTelephone',
					'sortable': true,
					'grouping': {
						'title': '*Telephone Number',
						'getter': 'TelephoneNumberFk',
						'aggregators': [],
						'aggregateCollapsed': true
					},
					'editor': 'lookup',
					'editorOptions': {
						'lookupDirective': 'basics-common-telephone-dialog',
						'lookupOptions': {
							'foreignKey': 'TelephoneNumberFk',
							'titleField': 'cloud.common.TelephoneDialogPhoneNumber',
							// 'showClearButton': true
						},
						// 'showClearButton': true
					},
					'formatter': $injector.get('basicsCommonComplexFormatter'),
					'formatterOptions': {
						'displayMember': 'Telephone',
						'domainType': 'phone'
					},
					'toolTip': 'Telephone',
					'toolTip$tr$': 'cloud.common.TelephoneDialogTelephone'
				};
			}
		}

		return service;
	}
})(angular);