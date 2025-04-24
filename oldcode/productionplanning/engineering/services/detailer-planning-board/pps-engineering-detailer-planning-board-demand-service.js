(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var serviceName = 'ppsEngDetailerPlanningBoardDemandService';

	angular.module(moduleName).factory(serviceName, DemandService);

	DemandService.$inject = ['platformDataServiceFactory', 'productionplanningEngineeringMainService', 'platformDataServiceProcessDatesBySchemeExtension', 'platformGridAPI'];

	function DemandService(platformDataServiceFactory, engMainService, platformDataServiceProcessDatesBySchemeExtension, platformGridAPI) {
		var container = null;

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{
				typeName: 'EngTaskDto',
				moduleSubModule: 'ProductionPlanning.Engineering'
			}
		);

		var serviceOption = {
			flatRootItem: {
				module: moduleName + '.DetailerPlanningBoardDemand',
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.engineering.entityEngTask',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/task/',
					endRead: 'getEngTasksForPlanningBoard',
					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.Ids = _.map(engMainService.getList(), 'Id');
					}
				},
				dataProcessor: [dateProcessor],
				actions: {
					delete: {},
					create: {}
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'EngTask',
						moduleName: 'cloud.desktop.moduleDisplayNameEngineering',
						useIdentification: true,
						rootForModule: moduleName + '.detailerDemand' //no real root! 
					}
				},
				useItemFilter: true
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.service.filterDemands = (demand) => {
			let demandGrid = platformGridAPI.grids.element('id', container.data.gridUuId);
			let demandGridItems = demandGrid.dataView.getItems();
			demandGrid.dataView.setItems(_.filter(demandGridItems, (item) => {
				return item.Id !== demand.Id;
			}));
		};

		container.service.setUuid = (uuid) => {
			container.data.gridUuId = uuid;
		};

		container.data.gridUuId = '';

		return container.service;
	}
})();