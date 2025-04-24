(function (angular) {
	'use strict';

	var moduleName = 'resource.project';
	var resProjectModule = angular.module(moduleName);
	var serviceName = 'resourceProjectPlanningBoardRequisitionService';
	resProjectModule.factory(serviceName, resourceProjectPlanningBoardRequisitionService);
	resourceProjectPlanningBoardRequisitionService.$inject = ['_', 'moment', 'resourceRequisitionPlanningBoardServiceFactory', 'resourceProjectDataService', 'platformPlanningBoardDataService'];

	function resourceProjectPlanningBoardRequisitionService(_, moment, resourceRequisitionPlanningBoardServiceFactory, resourceProjectDataService, platformPlanningBoardDataService) {

		let ignoreIsFullyCovered = null;
		let ignoreIsNotFullyCovered = null;
		var container = resourceRequisitionPlanningBoardServiceFactory.createRequisitionService({
			initReadData: function initReadData(readData) {
				readData.From = getFromDate(container.data.filter);
				readData.To = getToDate(container.data.filter);
				readData.IgnoreIsFullyCovered = ignoreIsFullyCovered !== null ? ignoreIsFullyCovered : platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsFullyCovered();
				readData.IgnoreIsNotFullyCovered = ignoreIsNotFullyCovered !== null ? ignoreIsNotFullyCovered : platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsNotFullyCovered();
				readData.ModuleName = moduleName;
				readData.ExpectsProjectFilter = true;
				var sel = resourceProjectDataService.getSelected();
				if(sel)
				{
					readData.ProjectFk = sel.Id;
				}
			},
			moduleName: moduleName,
			serviceName: serviceName,
			parentService: resourceProjectDataService
		});

		function getFromDate(filter)
		{
			if(filter.From)
			{
				return filter.From;
			}

			if(filter.To)
			{
				return filter.To.subtract(1080, 'day');
			}

			return moment.utc().subtract(1080, 'day');
		}

		function getToDate(filter)
		{
			if(filter.To)
			{
				return filter.To;
			}

			return moment.utc().add(1080, 'day');
		}

		container.data.setFilter = function setFilterDemand(filter)  {
			if(!_.isString(filter) && _.isObject(filter)) {
				container.data.filter = filter;
			}
		};

		container.service.setFilter = function setFilterDemand(filter)  {
			if(!_.isString(filter) && _.isObject(filter)) {
				container.data.filter = filter;
			}
		};

		container.service.updateIsFullyCoveredSettings = function () {
			ignoreIsFullyCovered = platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsFullyCovered();
			ignoreIsNotFullyCovered = platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsNotFullyCovered();
			container.service.load();
		};

		return container.service;
	}
})(angular);
