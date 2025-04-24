/**
 * Created by anl on 4/17/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';
	angular.module(moduleName).controller('productionplanningAccountingRuleCheckController', AccountingRuleCheckController);

	AccountingRuleCheckController.$inject = ['$scope',
		'productionPlanningAccountingRuleCheckService',
		'productionplanningAccountingRuleDataService',
		'platformRuntimeDataService'];


	function AccountingRuleCheckController($scope,
										   accountingRuleCheckService,
										   ruleDataService,
										   platformRuntimeDataService) {


		$scope.onCancel = function () {
			$scope.$dismiss('cancel');
		};

		$scope.isOKDisabled = function () {
			return $scope.isBusy || !accountingRuleCheckService.changeMatchPattern($scope);
		};

		$scope.onOk = function () {
			//Update Match-Pattern if changed
			var selectedRule = ruleDataService.getSelected();
			selectedRule.MatchPattern = $scope.formOptions.entity.MatchPattern;
			ruleDataService.markItemAsModified(selectedRule);
			$scope.onCancel();
		};

		$scope.onTest = function () {
			var entity = $scope.formOptions.entity;
			var value = entity.TestField;
			var model = 'TestField';
			accountingRuleCheckService.validateTestField(entity, value).then(function (result) {
				platformRuntimeDataService.applyValidationResult(result, entity, model);
			});
		};

		$scope.testBtn = function () {
			return $scope.isBusy || !$scope.formOptions.entity.TestField;
		};

		$scope.getContainerUUID = function () {
			return $scope.gridId;
		};

		accountingRuleCheckService.initDialog($scope);

		$scope.$on('$destroy', function () {
			$scope.onCancel();
		});
	}
})(angular);