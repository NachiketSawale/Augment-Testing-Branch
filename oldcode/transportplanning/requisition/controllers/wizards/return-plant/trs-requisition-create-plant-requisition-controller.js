/**
 * Created by anl on 12/29/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).controller('transportplanningRequisitionCreatePlantRequisitionController', CreatePlantRequisitionController);

	CreatePlantRequisitionController.$inject = [
		'$scope',
		'transportplanningRequisitionCreatePlantRequisitionService'];

	function CreatePlantRequisitionController(
		$scope,
		createRequisitionService) {

		createRequisitionService.initialize($scope);
	}
})(angular);