/**
 * Created by wui on 10/14/2016.
 */

(function (angular) {
	'use strict';
	var moduleName = 'mtwo.controltowerconfiguration';
	angular.module(moduleName).directive('mtwoControlTowerItemCheckbox', [
		function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				template: '<div class="text-center"><input type="checkbox" data-ng-model="isChecked"/></div>',
				link: function (scope, element, attrs, ngModelCtrl) {
					scope.IsLive = false;

					// model ->  view
					ngModelCtrl.$render = function () {
						scope.IsLive = ngModelCtrl.$viewValue;

						if (scope.IsLive === 'unknown') {
							element.find('input[type=checkbox]').prop('indeterminate', true);
						}
						else {
							element.find('input[type=checkbox]').prop('indeterminate', false);
						}
					};

					// view -> model
					scope.$watch('IsLive', function (newValue) {
						if (ngModelCtrl.$viewValue !== newValue) {
							ngModelCtrl.$setViewValue(newValue);
							ngModelCtrl.$commitViewValue();
						}
					});
				}
			};
		}]);
})(angular);
