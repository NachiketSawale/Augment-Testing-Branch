(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var masterModule = angular.module(moduleName);
	var serviceName = 'productionplanningEngineeringRequisitionService';
	masterModule.factory(serviceName, requisitionService);
	requisitionService.$inject = ['resourceRequisitionPlanningBoardServiceFactory', 'productionplanningEngineeringResourceService'];

	function requisitionService(resourceRequisitionPlanningBoardServiceFactory, resourceService) {

		var container = resourceRequisitionPlanningBoardServiceFactory.createRequisitionService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = resourceService.getIdList();
				readData.ModuleName = moduleName;
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName
		});

		return container.service;

	}

})(angular);