(function (angular) {
	'use strict';

	angular.module('basics.common').directive('formFieldInputCheckbox', [
		function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: true,
				template: '<div class="lg-11 md-11"><input type="text" class="domain-type-description form-control" data-ng-model="Description" data-ng-disabled="Disabled"/></div>' +
					'<div class="lg-1 md-1 text-center"><input type="checkbox" data-ng-model="Selected"/></div>',
				link: function (scope, element, attrs, ngModelCtrl) {
					ngModelCtrl.$formatters.push(function (value) {
						if (value) {
							scope.Description = value.Description;
							scope.Selected = value.Selected;
							scope.Disabled = value.Disabled;
							return {
								Description: value.Description,
								Selected: value.Selected,
								Disabled: value.Disabled
							};
						}
						return '';
					});

					function setValue(currentValue) {
						ngModelCtrl.$setViewValue(currentValue);
						if (ngModelCtrl.$validate) {
							ngModelCtrl.$validate();
						}
						ngModelCtrl.$commitViewValue();
						scope.$eval('$parent.' + attrs.config).rt$change();
						scope.$evalAsync();
					}

					// view -> model
					scope.$watch('Description', function (newValue) {
						if (newValue && ngModelCtrl.$viewValue.Description !== newValue) {
							const currentValue = {
								Description: newValue,
								Selected: scope.Selected
							};
							setValue(currentValue);
						}
					});

					scope.$watch('Selected', function (newValue) {
						const currentValue = {
							Description: scope.Description,
							Selected: newValue
						};
						setValue(currentValue);
					});

					ngModelCtrl.$viewChangeListeners.push(function () {
						scope.$eval(attrs.ngChange);
					});
				}
			};
		}]);
})(angular);