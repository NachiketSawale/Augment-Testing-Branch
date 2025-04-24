(function (angular) {
	'use strict';
	var module = 'transportplanning.transport';

	angular.module(module).controller('transportPlanningWaypointJobDocumentListController', TransportPlanningWaypointJobDocumentListController);
	TransportPlanningWaypointJobDocumentListController.$inject = ['$scope', 'transportPlanningJobDocumentListControllerFactory', 'transportPlanningWaypointJobDocumentDataService'];

	function TransportPlanningWaypointJobDocumentListController($scope, controllerFactory, documentDataService) {
		controllerFactory.initController($scope, documentDataService);
	}
})(angular);