(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.project';
	var resProjectModule = angular.module(moduleName);
	var serviceName = 'resourceProjectPlanningBoardReservationService';
	resProjectModule.factory(serviceName, resourceReservationPlanningBoardReservationService);
	resourceReservationPlanningBoardReservationService.$inject = ['$http','resourceReservationPlanningBoardServiceFactory', 'resourceProjectPlanningBoardResourceService','resourceProjectDataService','platformModalService'];

	function resourceReservationPlanningBoardReservationService($http,resourceReservationPlanningBoardServiceFactory, resourceProjectPlanningBoardResourceService,resourceProjectDataService,platformModalService) {

		var container = resourceReservationPlanningBoardServiceFactory.createReservationNodeService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = resourceProjectPlanningBoardResourceService.getIdList();
			},
			moduleName: moduleName,
			serviceName: serviceName,
			itemName: 'Reservation',
			parentService: resourceProjectDataService
		});

		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		return container.service;

	}

})(angular);

