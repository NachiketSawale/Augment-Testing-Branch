(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'resource.reservation';
	var reservationModule = angular.module(moduleName);
	var serviceName = 'resourceReservationPlanningBoardReservationService';

	reservationModule.factory(serviceName, resourceReservationPlanningBoardReservationService);

	resourceReservationPlanningBoardReservationService.$inject = ['$http','$injector','_','resourceReservationPlanningBoardServiceFactory', 'resourceReservationPlanningBoardResourceService','resourceReservationDataService','platformModalService', 'resourceReservationReadonlyProcessorService'];

	function resourceReservationPlanningBoardReservationService($http,$injector,_,resourceReservationPlanningBoardServiceFactory, resourceReservationPlanningBoardResourceService,resourceReservationDataService,platformModalService, resourceReservationReadonlyProcessorService) {

		var container = resourceReservationPlanningBoardServiceFactory.createReservationService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = resourceReservationPlanningBoardResourceService.getIdList();
			},
			moduleName: moduleName,
			serviceName: serviceName,
			itemName: 'Reservations',
			parentService: resourceReservationDataService
		});

		container.data.onReadSucceeded = function inReadResourcesSucceeded(result, data) {
			container.data.doNotUnloadOwnOnSelectionChange = true;
			container.data.doNotLoadOnSelectionChange = true;

			container.data.handleReadSucceeded(result, data);
		};

		container.service.setEntityReadOnlyAfterStatusChange = function setEntityReadOnlyAfterStatusChange (entity){
			resourceReservationReadonlyProcessorService.processItem(entity);
		};
		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		return container.service;
	}
})(angular);

