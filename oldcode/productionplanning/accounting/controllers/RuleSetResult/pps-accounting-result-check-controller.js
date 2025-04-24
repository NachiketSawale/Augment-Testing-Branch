/**
 * Created by anl on 5/9/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingResultCheckController', ResultCheckController);

	ResultCheckController.$inject = ['$scope', 'productionPlanningAccountingResultCheckService',
		'productionplanningAccountingResultDataService'];

	function ResultCheckController($scope,
								   accountingResultCheckService,
								   resultDataService) {

		$scope.onCancel = function () {
			$scope.$dismiss('cancel');
		};
		$scope.onOk = function () {
			var changed = accountingResultCheckService.changedFormula($scope);
			if (changed) {
				var selectedResult = resultDataService.getSelected();
				selectedResult.QuantityFormula = $scope.formOptions.entity.Formula;
				resultDataService.markItemAsModified(selectedResult);
			}

			$scope.onCancel();
		};

		$scope.onExecute = function () {
			var entity = $scope.formOptions.entity;
			var formula = entity.Formula;
			var value = entity.Value;
			$scope.formOptions.entity.Output = accountingResultCheckService.executeFormula(formula, value);
		};

		$scope.executeBtn = function () {
			return !($scope.formOptions.entity.Value && $scope.formOptions.entity.Formula);
		};

		$scope.getContainerUUID = function () {
			return $scope.gridId;
		};

		accountingResultCheckService.initDialog($scope);

		$scope.$on('$destroy', function () {
			$scope.onCancel();
		});
	}

})(angular);