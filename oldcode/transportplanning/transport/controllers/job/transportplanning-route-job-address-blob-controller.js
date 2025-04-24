(function (angular) {
	'use strict';
	var module = 'transportplanning.transport';

	angular.module(module).controller('transportPlanningRouteJobAddressBlobController', TransportPlanningRouteJobAddressBlobController);
	TransportPlanningRouteJobAddressBlobController.$inject = ['$scope', 'transportplanningTransportMainService',  'transportPlanningJobAddressBlobControllerFactory'];

	function TransportPlanningRouteJobAddressBlobController($scope, mainService, controllerFactory) {
		controllerFactory.initController($scope, mainService, 'JobDefFk');
	}

})(angular);