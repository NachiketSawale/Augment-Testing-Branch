/**
 * Created by zov on 29/01/2019.
 */
(function () {
	'use strict';
	/*global angular, _*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).service('transportplanningTransportContainerInformationService', [
		'$injector', 'basicsCommonContainerInformationServiceUtil',
		function ($injector, containerInformationServiceUtil) {
			const mainService = $injector.get('transportplanningTransportMainService');
			const uiService = $injector.get('transportplanningTransportUIStandardService');
			const validationService = $injector.get('transportplanningTransportValidationService');

			this.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var config = {};

				switch (guid) {
					case 'b7773a4867a34c5ebe4d2ee1cb53b613': //transportPlanningResRequisitionFilterController
						config = getResRequisitionSourceWindowConfig();
						break;
					case '66663a4867a34c5ebe4d2ee1cb53666':
						config = getTrsGoodsFilterContainerConfig(guid);
						break;
					case '2293102b42284cb5bd1b538fdf2ae90a':
						config.dataServiceName = $injector.get('ppsCommonNotificationDataServiceFactory').getService({
							parentService: $injector.get('transportplanningTransportMainService')
						});
						config.ContainerType = 'Grid';
						config.listConfig = {initCalled: false, columns: []};
						config.standardConfigurationService = 'ppsCommonNotificationUIStandardService';
						break;
					case '1293102b4ee84cb5bd1b538fdf2ae90a': // transport list controller
						config = containerInformationServiceUtil.createCfgForGrid({
							cfgSvc: 'transportplanningTransportUIStandardService',
							dataSvc: 'transportplanningTransportMainService',
							validationSvc: 'transportplanningTransportValidationService'
						});
						config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
							.getService(mainService, uiService, validationService, guid);
						break;
					case 'a967cd748f8f4f93a4651e791a4984cf': // transport detail controller
						config = containerInformationServiceUtil.createCfgForDetail({
							cfgSvc: 'transportplanningTransportUIStandardService',
							dataSvc: 'transportplanningTransportMainService',
							validationSvc: 'transportplanningTransportValidationService'
						});
						config.standardConfigurationService = $injector.get('basicsCommonCharacteristicColDynamicConfigServiceFactory')
							.getService(mainService, uiService, validationService, '1293102b4ee84cb5bd1b538fdf2ae90a');
						break;
				}

				return config;
			};

			function getTrsGoodsFilterContainerConfig(uuid) {
				var config = {
					ContainerType: 'Grid',
					listConfig : {
						initCalled: false,
						columns: [],
						dragDropService: $injector.get('transportplanningTransportClipBoardService'),
						type: 'sourceTrsGoods'
					}
				};
				config.dataServiceName = $injector.get('trsRequisitionTrsGoodsFilterDataService');
				var uiService = $injector.get('transportplanningRequisitionTrsGoodsUIStandardServiceFactory').getService(config.dataServiceName);
				config.layout = uiService.getStandardConfigForListView();
				config.ContainerType = 'Grid';
				config.standardConfigurationService = uiService;
				return config;
			}

			function getResRequisitionSourceWindowConfig() {
				var filterDSName = 'trsTransportResRequisitionFilterDataService';
				var resRequisitionDS = $injector.get(filterDSName);
				var validationSrv = $injector.get('productionplanningResourceRequisitionValidationServiceBase').getRequisitionValidationService(resRequisitionDS);
				var templateInfo = {
					dto: 'ResRequisitionDto',
					http: 'transportplanning/transport/route',
					endRead: 'filterResRequisition',
					usePostForRead: true,
					filterFk: ['requestedDate', 'resourceTypeFk', 'siteFk'],
					presenter: function (container) {
						return {
							list: {
								incorporateDataRead: function (readData, data) {
									var result = _.map(readData, function (d) {
										var r = d.ResRequisition;
										r.TrsRouteFk = d.TrsRouteFk;
										return r;
									});
									return container.data.handleReadSucceeded(result, data);
								}
							}
						};
					},
					sortOptions: {initialSortColumn: {field: 'Id'}, isAsc: true},
					isInitialSorted: true,
					sourceDataService: filterDSName
				};

				var filterDataSrv = $injector.get('trsTransportSourceWindowDataServiceFactory').createDataService(moduleName, templateInfo);

				// make enable to save feature
				//filterDataSrv.parentService = angular.noop;

				var config = {
					ContainerType: 'Grid',
					listConfig: {initCalled: false, columns: []}
				};
				config.standardConfigurationService = 'transportplanningTransportResRequisitionUIStandardService';
				config.dataServiceName = filterDataSrv;
				config.validationServiceName = validationSrv;

				return config;
			}
		}]);
})();