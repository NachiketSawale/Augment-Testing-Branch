(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.enterprise';
	var resEnterpriseModule = angular.module(moduleName);
	var serviceName = 'resourceEnterprisePlanningBoardReservationService';
	resEnterpriseModule.factory(serviceName, resourceReservationPlanningBoardReservationService);
	resourceReservationPlanningBoardReservationService.$inject = ['$http','resourceReservationPlanningBoardServiceFactory', 'resourceEnterprisePlanningBoardResourceService','resourceEnterpriseDispatcherDataService','platformModalService'];

	function resourceReservationPlanningBoardReservationService($http,resourceReservationPlanningBoardServiceFactory, resourceEnterprisePlanningBoardResourceService,resourceEnterpriseDispatcherDataService,platformModalService ) {

		var container = resourceReservationPlanningBoardServiceFactory.createReservationNodeService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = resourceEnterprisePlanningBoardResourceService.getIdList();
			},
			moduleName: moduleName,
			serviceName: serviceName,
			itemName: 'Reservation',
			parentService: resourceEnterpriseDispatcherDataService
		});

		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		return container.service;
	}
})(angular);

