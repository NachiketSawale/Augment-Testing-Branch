(function (angular) {
	'use strict';
	var module = 'productionplanning.mounting';

	angular.module(module).controller('productionPlanningMountingReqJobAddressBlobController', ProductionPlanningMountingReqJobAddressBlobController);
	ProductionPlanningMountingReqJobAddressBlobController.$inject = ['$scope', 'productionplanningMountingRequisitionDataService',  'productionPlanningJobAddressBlobControllerFactory'];

	function ProductionPlanningMountingReqJobAddressBlobController($scope, mainService, controllerFactory) {
		controllerFactory.initController($scope, mainService, 'LgmJobFk');
	}

})(angular);