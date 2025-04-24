/*
 * $Id: basics-common-rule-editor-condition-group-link.js 500168 2018-06-22 20:40:12Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').directive('basicsCommonRuleEditorConditionGroupLink', [
		function () {
			return {
				restrict: 'A',
				scope: false,
				link: function ($scope) {
					$scope.$watch('data.OperatorFk', function (newValue, oldValue) {
						if (newValue === oldValue) {
							return;
						}

						$scope.ruleEditorManager.notifyRuleChanged();
					});
				}
			};
		}]);
})(angular);