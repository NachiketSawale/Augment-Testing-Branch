(function (angular) {
	'use strict';

	var moduleName = 'resource.enterprise';
	var resEnterpriseModule = angular.module(moduleName);
	var serviceName = 'resourceEnterprisePlanningBoardRequisitionService';
	resEnterpriseModule.factory(serviceName, resourceEnterprisePlanningBoardRequisitionService);
	resourceEnterprisePlanningBoardRequisitionService.$inject = ['resourceRequisitionPlanningBoardServiceFactory', 'resourceEnterprisePlanningBoardResourceService',
		'resourceEnterpriseDispatcherDataService', 'platformPlanningBoardDataService'];

	function resourceEnterprisePlanningBoardRequisitionService(resourceRequisitionPlanningBoardServiceFactory, resourceEnterprisePlanningBoardResourceService,
		resourceEnterpriseDispatcherDataService, platformPlanningBoardDataService) {

		let ignoreIsFullyCovered = null;
		let ignoreIsNotFullyCovered = null;

		var container = resourceRequisitionPlanningBoardServiceFactory.createRequisitionService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.IgnoreIsFullyCovered = ignoreIsFullyCovered !== null ? ignoreIsFullyCovered : platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsFullyCovered();
				readData.IgnoreIsNotFullyCovered = ignoreIsNotFullyCovered !== null ? ignoreIsNotFullyCovered : platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsNotFullyCovered();
				readData.ResourceIdList = resourceEnterprisePlanningBoardResourceService.getIdList();
				readData.ModuleName = moduleName;
				var selected = resourceEnterpriseDispatcherDataService.getSelected();
				readData.DispatcherGroupFk = selected ? selected.Id : null;
				readData.ExpectsDispatcherGroupFilter = true;
			},

			moduleName: moduleName,
			serviceName: serviceName
		});

		container.service.updateIsFullyCoveredSettings = function () {
			ignoreIsFullyCovered = platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsFullyCovered();
			ignoreIsNotFullyCovered = platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsNotFullyCovered();
			container.service.load();
		};


		return container.service;
	}
})(angular);
