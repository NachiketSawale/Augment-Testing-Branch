/*
 * $Id: basics-common-rule-editor-condition-link.js 590175 2020-06-09 12:00:43Z balkanci $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonRuleEditorConditionLink', ['$q', '_',
		function ($q, _) {
			return {
				restrict: 'A',
				scope: false,
				link: function ($scope) {
					$scope.operatorSelectorOptions = {
						displayMember: 'DescriptionInfo.Translated',
						valueMember: 'Id',
						items: [],
						watchItems: true
					};

					$scope.$watch('data.Operands[0]', function firstOperandChanged(newValue, oldValue) {
						$q.when($scope.ruleEditorManager.firstOperandChanged($scope.data)).then(function () {
							$scope.$evalAsync(function () {
								$scope.operatorSelectorOptions.items = $scope.ruleEditorManager.getOperators($scope.data);
							});

						});

						if (_.isNil(oldValue)) {
							return;
						}

						if (angular.equals(newValue, oldValue)) {
							return;
						}

						// when Operands[0] changes the operators and operator values can become invalid
						if (!$scope.graphProvider.fieldTypesMatch(newValue, oldValue)) {
							$scope.data.OperatorFk = null;
							// $scope.data.Operands[1] = null;
							$scope.data.Operands = _.map($scope.data.Operands, function (op, index) {
								return index > 0 ? null : op;
							});
						}
						$scope.ruleEditorManager.notifyRuleChanged();
					}, true);

					$scope.$watch('data.OperatorFk', function (newValue, oldValue) {
						if (newValue === oldValue) {
							return;
						}

						if ($scope.data) {
							var opCount = $scope.ruleEditorManager.getTotalOperandCount($scope.data);
							if (opCount < $scope.data.Operands.length) {
								$scope.data.Operands.splice(opCount, $scope.data.Operands.length - opCount);
							}
						}
						// when the operators changes, the operator values can become invalid
						if ($scope.graphProvider && !$scope.graphProvider.fieldTypesMatch(newValue, oldValue)) {
							// $scope.data.Operands[1] = null;
							$scope.data.Operands = _.map($scope.data.Operands, function (op, index) {
								return index > 0 ? null : op;
							});
						}
						$scope.ruleEditorManager.notifyRuleChanged();
					});
				}
			};
		}]);
})(angular);