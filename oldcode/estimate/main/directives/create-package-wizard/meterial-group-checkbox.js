/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('estimate.main').directive('materialGroupCheckbox', [
		function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				template: '<div class="text-center"><input type="checkbox" data-ng-model="Selected"/></div>',
				link: function (scope, element, attrs, ngModelCtrl) {
					scope.Selected = false;
					// model -> view
					ngModelCtrl.$render = function () {
						scope.Selected = ngModelCtrl.$viewValue;

						if (scope.Selected === 'unknown') {
							element.find('input[type=checkbox]').prop('indeterminate', true);
						}
						else {
							element.find('input[type=checkbox]').prop('indeterminate', false);
						}
					};
					// view -> model
					scope.$watch('Selected', function (newValue) {
						if (ngModelCtrl.$viewValue !== newValue) {
							ngModelCtrl.$setViewValue(newValue);
							ngModelCtrl.$commitViewValue();
						}
					});
				}
			};
		}]);
})(angular);
