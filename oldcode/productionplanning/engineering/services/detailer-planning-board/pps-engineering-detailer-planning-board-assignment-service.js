(function () {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var serviceName = 'ppsEngDetailerPlanningBoardAssignmentService';

	angular.module(moduleName).factory(serviceName, AssignmentService);

	AssignmentService.$inject = ['platformDataServiceFactory', 'ppsEngDetailerPlanningBoardSupplierService',
		'ppsEngDetailerPlanningBoardClipboardService',  'productionplanningEngineeringMainService',
		'ServiceDataProcessDatesExtension'];

	function AssignmentService(platformDataServiceFactory, supplierService,
							   clipboardService, engMainService,
							   ProcessDatesExtension) {
		var container = null;

		var serviceOption = {
			flatLeafItem: {
				module: moduleName,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.engineering.entityItemClerk',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/engineering/engtask2clerk/',
					endRead: 'getClerksForPlanningBoard',
					endDelete: 'multidelete',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.Ids = _.map(supplierService.getList(), 'Id');
						readData.From = container.data.filter.From;
						readData.To = container.data.filter.To;
					}
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							var data = clipboardService.getClipboard().data;
							if (!_.isNil(data)) {
								creationData.Id = data[0].Id;
							}
						}
					}
				},
				entitySelection: { supportsMultiSelection: true },
				entityRole: {
					leaf: {
						itemName: 'EngTask2Clerk',
						moduleName: 'cloud.desktop.moduleClerk',
						useIdentification: true,
						parentService: engMainService,
						parentFilter: 'taskId'
					}
				},
				dataProcessor: [new ProcessDatesExtension(['EngTaskPlannedStart', 'EngTaskPlannedFinish'])],
				useItemFilter: true
			}
		};

		container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.service.getContainerData = () => {
			return container.data;
		}

		return container.service;
	}
})();