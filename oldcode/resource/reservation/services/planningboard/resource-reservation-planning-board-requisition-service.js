(function (angular) {
	'use strict';

	var moduleName = 'resource.reservation';
	var reservationModule = angular.module(moduleName);
	var serviceName = 'resourceReservationPlanningBoardRequisitionService';
	reservationModule.factory(serviceName, resourceReservationPlanningBoardRequisitionService);
	resourceReservationPlanningBoardRequisitionService.$inject = ['resourceRequisitionPlanningBoardServiceFactory', 'resourceReservationPlanningBoardResourceService','platformPlanningBoardDataService', 'resourceReservationDataService'];

	function resourceReservationPlanningBoardRequisitionService(resourceRequisitionPlanningBoardServiceFactory, resourceReservationPlanningBoardResourceService,platformPlanningBoardDataService, resourceReservationDataService) {

		var ignoreIsFullyCovered = null;
		var ignoreIsNotFullyCovered = null;

		var container = resourceRequisitionPlanningBoardServiceFactory.createRequisitionService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.IgnoreIsFullyCovered = ignoreIsFullyCovered !== null ? ignoreIsFullyCovered : platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsFullyCovered();
				readData.IgnoreIsNotFullyCovered = ignoreIsNotFullyCovered !== null ? ignoreIsNotFullyCovered : platformPlanningBoardDataService.getPlanningBoardDataServiceByDemandServiceName(serviceName).ignoreIsNotFullyCovered();
				readData.ResourceIdList = resourceReservationPlanningBoardResourceService.getIdList();
				readData.ModuleName = moduleName;
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
