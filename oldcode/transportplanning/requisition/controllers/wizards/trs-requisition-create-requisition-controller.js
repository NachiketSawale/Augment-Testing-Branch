(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionCreateRequisitionController', CreateRequisitionController);

	CreateRequisitionController.$inject = [
		'$scope',
		'transportplanningRequisitionCreateRequisitionService'];

	function CreateRequisitionController(
		$scope,
		createRequisitionService) {

		createRequisitionService.initialize($scope);
	}
})(angular);