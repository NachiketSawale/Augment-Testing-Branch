(function (angular) {
	'use strict';
	var module = 'transportplanning.transport';

	angular.module(module).controller('transportPlanningRouteJobDocumentListController', TransportPlanningRouteJobDocumentListController);
	TransportPlanningRouteJobDocumentListController.$inject = ['$scope', 'transportPlanningJobDocumentListControllerFactory', 'transportPlanningRouteJobDocumentDataService'];

	function TransportPlanningRouteJobDocumentListController($scope, controllerFactory, documentDataService) {
		controllerFactory.initController($scope, documentDataService);
	}
})(angular);