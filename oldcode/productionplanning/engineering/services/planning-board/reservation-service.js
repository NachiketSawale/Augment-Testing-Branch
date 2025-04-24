(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var masterModule = angular.module(moduleName);
	var serviceName = 'productionplanningEngineeringReservationService';
	masterModule.factory(serviceName, reservationService);
	reservationService.$inject = ['resourceReservationPlanningBoardServiceFactory',
		'productionplanningEngineeringResourceService',
		'productionplanningEngineeringMainService'];

	function reservationService(resourceReservationPlanningBoardServiceFactory,
								resourceService,
								parentService) {

		var container = resourceReservationPlanningBoardServiceFactory.createReservationService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = resourceService.getIdList();
				readData.ModuleName = moduleName; // not really necessary - unevaluated here - just to be kept in mind
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName,
			itemName: 'PbResReservation',
			parentService: parentService
		});

		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		return container.service;

	}

})(angular);