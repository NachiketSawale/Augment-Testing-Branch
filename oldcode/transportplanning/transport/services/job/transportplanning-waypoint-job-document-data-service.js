(function (angular) {
	'use strict';
	var module = 'transportplanning.transport';

	angular.module(module).factory('transportPlanningWaypointJobDocumentDataService', TransportPlanningWaypointJobDocumentDataService);
	TransportPlanningWaypointJobDocumentDataService.$inject = ['transportPlanningJobDocumentDataServiceFactory', 'transportplanningTransportWaypointDataService'];

	function TransportPlanningWaypointJobDocumentDataService(serviceFactory, dataService) {
		return serviceFactory.createService(dataService, 'LgmJobFk');
	}
})(angular);
