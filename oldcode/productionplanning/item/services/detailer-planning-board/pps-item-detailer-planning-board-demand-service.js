(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	var serviceName = 'ppsItemDetailerPlanningBoardDemandService';

	angular.module(moduleName).factory(serviceName, DemandService);

	DemandService.$inject = ['platformDataServiceFactory', 'productionplanningItemDataService', 'ppsItemDetailerPlanningBoardSupplierService', 'platformDataServiceProcessDatesBySchemeExtension', 'platformGridAPI'];

	function DemandService(platformDataServiceFactory, itemDataService, ppsItemDetailerPlanningBoardSupplierService, platformDataServiceProcessDatesBySchemeExtension, platformGridAPI) {
		var container = null;
		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{
				typeName: 'EngTaskDto',
				moduleSubModule: 'ProductionPlanning.Engineering'
			}
		);

		var serviceOption = {
			flatNodeItem: {
				module: moduleName,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.engineering.entityEngTask',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/task/',
					endRead: 'getEngTasksForPlanningBoard',
					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.Ids = _.compact(_.map(itemDataService.getList(), 'EngTaskId'));
					}
				},
				dataProcessor: [dateProcessor],
				actions: {
					delete: {},
					create: {}
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					node: {
						itemName: 'EngTask',
						moduleName: 'cloud.desktop.moduleDisplayNameEngineering',
						useIdentification: true,
						parentService: itemDataService,
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