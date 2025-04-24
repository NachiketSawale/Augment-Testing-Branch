/**
 * Created by anl on 2/2/2017.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).factory('productionplanningActivityContainerInformationService', ActivityContainerInformationService);

	ActivityContainerInformationService.$inject = ['$injector', 'productionplanningActivityClipBoardService',
		'ppsCommonContainerInfoProvider'];

	function ActivityContainerInformationService($injector, clipBoardService,
												 containerInfoProvider) {

		var service = {};
		var dynamicConfigurations = {};

		service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
			var config = {};
			var layServ = null;
			switch (guid) {

				case '0fabc9f2d6a946b1bd5517bb7229e10a': //ActivityListController
					layServ = $injector.get('productionplanningActivityActivityUIStandardService');
					config.layout = layServ.getStandardConfigForListView();
					config.ContainerType = 'Grid';
					config.standardConfigurationService = 'productionplanningActivityActivityUIStandardService';
					config.dataServiceName = 'productionplanningActivityActivityDataService';
					config.validationServiceName = 'productionpalnningActivityActivityValidationService';
					config.listConfig = {
						initCalled: false,
						columns: [],
						dragDropService: clipBoardService,
						type: 'mntActivity',
						pinningContext: true //set to refresh tools when pinningContext changed
					};
					break;
				case '3f4268ef496c4878ac95b92e9cce4220': //ActivityDetailController
					layServ = $injector.get('productionplanningActivityActivityUIStandardService');
					config = layServ.getStandardConfigForDetailView();
					config.ContainerType = 'Detail';
					config.standardConfigurationService = 'productionplanningActivityActivityUIStandardService';
					config.dataServiceName = 'productionplanningActivityActivityDataService';
					config.validationServiceName = 'productionpalnningActivityActivityValidationService';
					break;
				/*	case '1eb2dcf5d64c4932a8dccb6428ef5520': //ReportDetailController
				 layServ = $injector.get('productionplanningReportReportUIStandardService');
				 config = layServ.getStandardConfigForDetailView();
				 config.ContainerType = 'Detail';
				 config.standardConfigurationService = 'productionplanningReportReportUIStandardService';
				 config.dataServiceName = 'productionplanningActivityReportDataService';
				 config.validationServiceName = 'productionpalnningActivityReportValidationService';
				 break;*/
				case '2219ffe26d694ed9ad9f02bdb5c3f1e0':
					config = getMatReqContainerInfo(true);
					break;
				case 'ff8a5a1e201242ab8c837cf1a50e9932':
					config = getTrsGoodsContainerInfo(true);
					break;
				case 'ef8a5a1e201242ab8c837cf1a50e9932':
					config = getTrsGoodsContainerInfo(false);
					break;
				default:
					config = service.hasDynamic(guid) ? dynamicConfigurations[guid] : {};
					break;
			}

			return config;
		};

		service.hasDynamic = function hasDynamic(guid) {
			return !_.isNull(dynamicConfigurations[guid]) && !_.isUndefined(dynamicConfigurations[guid]);
		};

		service.takeDynamic = function takeDynamic(guid, config) {
			dynamicConfigurations[guid] = config;
		};


		function getMatReqContainerInfo(isGrid) {
			return containerInfoProvider.getContainerInfo({
				moduleName: moduleName,
				parentService: $injector.get('productionplanningActivityTrsRequisitionDataService'),
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
				parentService: 'productionplanningActivityTrsRequisitionDataService',
				dataServiceFactory: 'transportplanningRequisitionTrsGoodDataServiceFactory',
				UIStandardServiceFactory: 'transportplanningRequisitionTrsGoodsUIStandardServiceFactory',
				validationServiceFactory: 'transportplanningRequisitionTrsGoodValidationFactory'
			});
		}

		return service;
	}
})(angular);