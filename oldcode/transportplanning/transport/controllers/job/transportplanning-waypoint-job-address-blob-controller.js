(function (angular) {
	'use strict';
	var module = 'transportplanning.transport';

	angular.module(module).controller('transportPlanningWaypointJobAddressBlobController', TransportPlanningWaypointJobAddressBlobController);
	TransportPlanningWaypointJobAddressBlobController.$inject = ['$scope', 'transportplanningTransportWaypointDataService',  'transportPlanningJobAddressBlobControllerFactory'];

	function TransportPlanningWaypointJobAddressBlobController($scope, mainService, controllerFactory) {
		controllerFactory.initController($scope, mainService, 'LgmJobFk');
	}

})(angular);