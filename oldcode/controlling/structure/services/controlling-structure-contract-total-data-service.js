(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	controllingStructureModule.factory('controllingStructureContractTotalDataService', ['globals', 'platformDataServiceFactory', 'projectMainForCOStructureService', 'controllingStructureDashboardSubscriberService', 'ServiceDataProcessDatesExtension',
		function (globals, platformDataServiceFactory, projectMainForCOStructureService, controllingStructureDashboardSubscriberService, ServiceDataProcessDatesExtension) {

			// controlling structure group service
			var serviceContainer = platformDataServiceFactory.createNewComplete({
				flatLeafItem: {
					module: controllingStructureModule,
					serviceName: 'controllingStructureContractTotalDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/contract/controllingtotal/',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = controllingStructureDashboardSubscriberService.getSelected();
							let project = projectMainForCOStructureService.getSelected();
							readData.ControllingUnitId = selected.ControllingUnitId;
							readData.ControllingCostCodeId = selected.ControllingCostCodeId;
							readData.ProjectId = project ? project.Id : null;
							return readData;
						}
					},
					presenter: {list: {}},
					entityRole: {
						leaf: {itemName: 'ControllingUnitTotals', parentService: controllingStructureDashboardSubscriberService}
					},
					actions: { delete: false, create: false, bulk: false },
					dataProcessor: [new ServiceDataProcessDatesExtension(['DateOrdered', 'DateReported', 'DateCanceled', 'DateDelivery', 'DateCallofffrom', 'DateCalloffto', 'DateQuotation', 'ConfirmationDate', 'DatePenalty','DateEffective', 'ExecutionStart', 'ExecutionEnd','ValidFrom','ValidTo'])]
				}
			});

			serviceContainer.data.usesCache = false;

			serviceContainer.service.canLoad = function () {
				return !!controllingStructureDashboardSubscriberService.getSelected();
			};

			return serviceContainer.service;
		}]);
})();
