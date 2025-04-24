/**
 * Created by wui on 10/14/2016.
 */

(function (angular) {
	'use strict';

	angular.module('basics.material').directive('basicsMaterialCheckbox', [
		function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				template: '<div class="text-center"><input type="checkbox" data-ng-model="isChecked"/></div>',
				link: function (scope, element, attrs, ngModelCtrl) {
					scope.isChecked = false;

					// model -> view
					ngModelCtrl.$render = function () {
						scope.isChecked = ngModelCtrl.$viewValue;

						if (scope.isChecked === 'unknown') {
							element.find('input[type=checkbox]').prop('indeterminate', true);
						}
						else {
							element.find('input[type=checkbox]').prop('indeterminate', false);
						}
					};

					// view -> model
					scope.$watch('isChecked', function (newValue) {
						if (ngModelCtrl.$viewValue !== newValue) {
							ngModelCtrl.$setViewValue(newValue);
							ngModelCtrl.$commitViewValue();
						}
					});
				}
			};
		}]);
})(angular);