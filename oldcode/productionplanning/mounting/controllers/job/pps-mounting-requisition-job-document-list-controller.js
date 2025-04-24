(function (angular) {
	'use strict';
	var module = 'productionplanning.mounting';

	angular.module(module).controller('productionPlanningMountingReqJobDocumentListController', ProductionPlanningMountingReqJobDocumentListController);
	ProductionPlanningMountingReqJobDocumentListController.$inject = ['$scope', 'productionPlanningJobDocumentListControllerFactory',
		'productionPlanningMountingReqJobDocumentDataService', 'productionpalnningMountingRequisitionValidationService'];

	function ProductionPlanningMountingReqJobDocumentListController($scope, controllerFactory,
	                                                                documentDataService, validationService) {
		controllerFactory.initController($scope, documentDataService, validationService);
	}
})(angular);