(function () {
	/* global angular */
	'use strict';

	function actionInstanceContextController($scope, platformModuleStateService) {
		var state = platformModuleStateService.state('basics.workflowAdministration');
		$scope.itemsWatch = $scope.$watch(
			function () {
				return state.selectedActionInstance;
			},
			function (newVal) {
				if (newVal) {
					if (angular.isString(newVal.Context) && !_.isEmpty(newVal.Context)) {
						try {
							newVal.Context = angular.fromJson(newVal.Context);
							$scope.context = JSON.stringify(newVal.Context, null, 2);
						} catch (e) {
							newVal.Context = '{}';
						}
					}
				} else {
					$scope.context = '';
				}
			}
		);

		$scope.context = '';

	}

	actionInstanceContextController.$inject = ['$scope', 'platformModuleStateService'];

	angular.module('basics.workflowAdministration')
		.controller('basicsWorkflowActionInstanceContextController', actionInstanceContextController);

})();
