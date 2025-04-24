(function () {
	'use strict';

	var controllingStructureModule = angular.module('controlling.structure');

	controllingStructureModule.factory('controllingStructureActualDataService', ['globals', 'platformDataServiceFactory', 'projectMainForCOStructureService', 'controllingStructureDashboardSubscriberService', 'ServiceDataProcessDatesExtension',
		function (globals, platformDataServiceFactory, projectMainForCOStructureService, controllingStructureDashboardSubscriberService, ServiceDataProcessDatesExtension) {

			// controlling structure group service
			var serviceContainer = platformDataServiceFactory.createNewComplete({
				flatLeafItem: {
					module: controllingStructureModule,
					serviceName: 'controllingStructureActualDataService',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/actuals/subtotal/',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							let selected = controllingStructureDashboardSubscriberService.getSelected();
							let project = projectMainForCOStructureService.getSelected();
							readData.ControllingUnitId = selected.ControllingUnitId;
							readData.ControllingCostCodeId = selected.ControllingCostCodeId;
							readData.ProjectId = project ? project.Id : null;
							readData.IsCreate = selected.IsCreate;
							return readData;
						}
					},
					presenter: {list: {}},
					entityRole: {
						leaf: {itemName: 'ControllingUnitTotals', parentService: controllingStructureDashboardSubscriberService}
					},
					actions: { delete: false, create: false, bulk: false },
					dataProcessor: [new ServiceDataProcessDatesExtension(['CompanyYearFkStartDate', 'CompanyYearFkEndDate', 'CompanyPeriodFkStartDate', 'CompanyPeriodFkEndDate'])]
				}
			});

			serviceContainer.data.usesCache = false;

			serviceContainer.service.canLoad = function () {
				return !!controllingStructureDashboardSubscriberService.getSelected();
			};

			return serviceContainer.service;
		}]);
})();
