(function () {
	/* global angular */
	'use strict';
	function workflowInstanceContextController($scope, platformModuleStateService) {
		var state = platformModuleStateService.state('basics.workflowAdministration');
		$scope.itemsWatch = $scope.$watch(
			function () {
				return state.selectedMainEntity ? state.selectedMainEntity.Context : null;
			},
			function (newVal) {
				$scope.context = JSON.stringify(newVal, null, 2);
			}
		);

		$scope.context = '';

	}

	workflowInstanceContextController.$inject = ['$scope', 'platformModuleStateService'];

	angular.module('basics.workflowAdministration')
		.controller('basicsWorkflowInstanceContextController', workflowInstanceContextController);


})();

