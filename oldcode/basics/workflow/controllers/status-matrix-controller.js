(function () {
	'use strict';

	function statusMatrixCtrl(_, $scope, basicsWorkflowTemplateService, platformModuleStateService) {

		var state = platformModuleStateService.state('basics.workflow');

		function responseFn(result) {
			$scope.data = result;
			$scope.byGroup = _.groupBy(result, 'TableName');
			$scope.myArray = Object.keys($scope.byGroup).map(function (key) {
				return {TableName: key, StatusList: $scope.byGroup[key]};
			});
		}

		if (state.selectedMainEntity) {
			if (state.selectedMainEntity.Id) {
				basicsWorkflowTemplateService.getStatusMatrix(state.selectedMainEntity.Id).then(responseFn);
			}
		}

		function loadStatusMatrixData(newVal, oldVal) {
			if (newVal && (newVal !== oldVal) && newVal.Version > 0) {
				basicsWorkflowTemplateService.getStatusMatrix(newVal.Id).then(responseFn);
			}
		}

		$scope.$watch(
			function () {
				return state.selectedMainEntity;
			}, loadStatusMatrixData
		);
	}

	statusMatrixCtrl.$inject = ['_', '$scope', 'basicsWorkflowTemplateService', 'platformModuleStateService'];
	angular.module('basics.workflow').controller('basicsWorkflowStatusMatrixController', statusMatrixCtrl);

})();
