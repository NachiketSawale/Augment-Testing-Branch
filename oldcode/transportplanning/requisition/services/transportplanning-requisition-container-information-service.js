/* global angular,_ */
(function (angular) {

	'use strict';
	var moduleName = 'transportplanning.requisition';
	var module = angular.module(moduleName);

	module.service('transportplanningRequisitionContainerInformationService', TransportplanningRequisitionContainerInformationService);

	TransportplanningRequisitionContainerInformationService.$inject = [
		'$injector',
		'basicsCommonContainerInformationServiceUtil',
		'ppsCommonContainerInfoProvider',
		'transportplanningRequisitionMainService',
		'transportplanningRequisitionUIStandardService',
		'transportplanningRequisitionValidationService'];

	function TransportplanningRequisitionContainerInformationService(
		$injector,
		containerInformationServiceUtil,
		containerInfoProvider,
		mainService,
		uiService,
		validationService) {
		var dynamicConfigurations = {};
		var self = this;

		this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			let layServ = null, dataServ = null;
			switch (guid) {
				case '318c8b9af84c4cb38086f897aa853d71':
					config = getMatReqContainerInfo(true);
					break;
				case '0d3a47d4ce5c45e3af881d47c95e0ef8':
					config = getMatReqContainerInfo(false);
					break;
				case 'edeab38b0e1142328bbf926879c1adf1':
					config.ContainerType = 'Detail';
					break;
				case 'df5tg7b1928342c4a65cee89c4869tyg':
					config = getTrsGoodsContainerInfo(true);
					config.listConfig.dragDropService = $injector.get('transportplanningRequisitionTrsGoodsClipBoardService');
					config.listConfig.type = 'trsGoods';
					break;
				case 'ef5tg7b1928342c4a65cee89c4869tyg':
					config = getTrsGoodsContainerInfo(false);
					break;
				case '72ba26576b6149a199fe9f6f1862b7c9':
					config = getTrsRequisitionNotificationContainerInfo();
					break;
				case '67f457b1928342c4a65cee89c48693d0':
					config = containerInformationServiceUtil.createCfgForGrid({
						cfgSvc: 'transportplanningRequisitionUIStandardService',
						dataSvc: 'transportplanningRequisitionMainService',
						validationSvc: 'transportplanningRequisitionValidationService'
					});
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, guid);
					break;
				case 'a613f788e4c146ae9b31e273d28ab86f':
					config = containerInformationServiceUtil.createCfgForDetail({
						cfgSvc: 'transportplanningRequisitionUIStandardService',
						dataSvc: 'transportplanningRequisitionMainService',
						validationSvc: 'transportplanningRequisitionValidationService'
					});
					config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
						.getService(mainService, uiService, validationService, '67f457b1928342c4a65cee89c48693d0');
					break;
				case 'e08003d638ef43d88e74ee0d5399a152':// upstream item
					dataServ = $injector.get('ppsUpstreamItemDataService').getService({
						serviceKey: 'transportplanning.requisition.upstreamitembyjob',
						parentService: 'transportplanningRequisitionMainService',
						endRead: 'listByJob',
						mainItemColumn: 'LgmJobFk',
						actions: {delete: false, create: false}
					});
					layServ = $injector.get('ppsUpstreamItemUIStandardService').getService(dataServ);
					config.layout = layServ.getStandardConfigForListView();
					// _.remove(config.layout.columns, (col) => {
					// 	return _.includes(['Belonging'], col.field);
					// });
					config.ContainerType = 'Grid';
					config.standardConfigurationService = layServ;
					config.dataServiceName = dataServ;
					config.validationServiceName = $injector.get('ppsUpstreamItemValidationService').getService(dataServ);
					config.listConfig = {
						initCalled: false,
						columns: [],
						dragDropService: $injector.get('ppsItemUpstreamClipboardService').getService(dataServ),
						type: 'upStream'
					};
					break;
				case '821fc90538fc4272bc14708e852670a7':
					config.ContainerType= 'Grid',
					config.isTree = true;
					config.dataServiceName= $injector.get('transportplanningRequisitionToBeAssignedDataService').getService(true),
					config.standardConfigurationService= $injector.get('transportplanningToBeAssignedUIReadonlyService').getReadOnlyUIService(config.dataServiceName),
					config.validationServiceName= 'transportplanningBundleValidationService',
					config.listConfig= {
						initCalled: false,
						columns: [],
						parentProp: 'TrsProductBundleFk',
						childProp: 'Children',
						dragDropService: $injector.get('transportplanningToBeAssignedClipboardService').getService(config.dataServiceName),
						type: 'ToBeAssigned'
					};
					break;
				case 'bfa2d3cfb15845d4812a9a305f9da51f':
					config.ContainerType= 'Grid',
					config.isTree = false;
					config.dataServiceName= $injector.get('transportplanningRequisitionToBeAssignedDataService').getService(false),
					config.standardConfigurationService= $injector.get('transportplanningToBeAssignedUIReadonlyService').getReadOnlyUIService(config.dataServiceName),
					config.validationServiceName= 'transportplanningBundleValidationService',
					config.listConfig= {
						initCalled: false,
						columns: [],
						dragDropService: $injector.get('transportplanningToBeAssignedClipboardService').getService(config.dataServiceName),
						type: 'ToBeAssigned'
					};
					break;
				case '885863e4717846bda0adb3291c874945':
					config = getTrsReqDrawingDocSourceWindowContainerInfo();
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

		function getTrsReqDrawingDocSourceWindowContainerInfo() {
			return containerInformationServiceUtil.createCfgForGrid({
				dataSvc: 'trsReqDocumentLookupDataService',
				cfgSvc: 'productionplanningCommonDocumentUIReadonlyService',
				validationSvc: 'productionplanningCommonDocumentValidationService',
			}, null);
		}

		function getMatReqContainerInfo(isGrid) {
			return containerInfoProvider.getContainerInfo({
				moduleName: moduleName,
				isGrid: isGrid,
				parentService: mainService,
				dataServiceName: 'transportplanningRequisitionMatRequisitionDataService',
				standardConfigurationService: 'transportplanningRequisitionMatRequisitionUIStandardService',
				validationServiceName: 'transportplanningRequisitionMatRequisitionValidationService'
			});
		}

		function getTrsGoodsContainerInfo(isGrid) {
			return containerInfoProvider.getContainerInfoA({
				isGrid: isGrid,
				moduleName: moduleName,
				parentService: mainService,
				dataServiceFactory: 'transportplanningRequisitionTrsGoodDataServiceFactory',
				UIStandardServiceFactory: 'transportplanningRequisitionTrsGoodsUIStandardServiceFactory',
				validationServiceFactory: 'transportplanningRequisitionTrsGoodValidationFactory'
			});
		}

		function getTrsRequisitionNotificationContainerInfo() {
			return {
				dataServiceName: $injector.get('ppsCommonNotificationDataServiceFactory').getService({
					parentService: $injector.get('transportplanningRequisitionMainService'),
					route: 'transportplanning/requisition/'
				}),
				ContainerType: 'Grid',
				listConfig: {initCalled: false, columns: []},
				standardConfigurationService: 'ppsCommonNotificationUIStandardService'
			};
		}
	}
})(angular);