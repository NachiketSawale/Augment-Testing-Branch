(function (angular) {
	'use strict';
	/* global angular */
	var module = 'transportplanning.requisition';

	angular.module(module).controller('trsRequisitionJobAddressBlobController', TrsRequisitionJobAddressBlobController);
	TrsRequisitionJobAddressBlobController.$inject = ['$scope', 'transportplanningRequisitionMainService',  'transportPlanningJobAddressBlobControllerFactory'];

	function TrsRequisitionJobAddressBlobController($scope, mainService, controllerFactory) {
		controllerFactory.initController($scope, mainService, 'LgmJobFk');
	}

})(angular);