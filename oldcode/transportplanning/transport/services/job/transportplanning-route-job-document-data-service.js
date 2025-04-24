(function (angular) {
	'use strict';
	var module = 'transportplanning.transport';

	angular.module(module).factory('transportPlanningRouteJobDocumentDataService', TransportPlanningRouteJobDocumentDataService);
	TransportPlanningRouteJobDocumentDataService.$inject = ['transportPlanningJobDocumentDataServiceFactory', 'transportplanningTransportMainService'];

	function TransportPlanningRouteJobDocumentDataService(serviceFactory, dataService) {
		return serviceFactory.createService(dataService, 'JobDefFk');
	}
})(angular);