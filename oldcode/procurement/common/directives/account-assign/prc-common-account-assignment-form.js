(function (angular) {
	'use strict';
		
	var moduleName = 'procurement.common';
	angular.module(moduleName).directive('prcCommonAccountAssignmentForm', [
		function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				scope: true,
				template: '<div class="lg-5 md-5"><input type="text" class="domain-type-description form-control" data-ng-model="AccountAssignment02"/></div>' +
                    '<div class="lg-7 md-7  composite-last-item"><input type="text" class="domain-type-description form-control" data-ng-model="AccountAssignment03"/></div>',
				link: function (scope, element, attrs, ngModelCtrl) {
					ngModelCtrl.$formatters.push(function (value) {
						if (value) {
							scope.AccountAssignment02 = value.AccountAssignment02;
							scope.AccountAssignment03 = value.AccountAssignment03;
							return {
								AccountAssignment02: value.AccountAssignment02,
								AccountAssignment03: value.AccountAssignment03
							};
						}
						return '';
					});

					// view -> model
					scope.$watch('AccountAssignment02', function (newValue) {
						if (newValue && ngModelCtrl.$viewValue.AccountAssignment02 !== newValue) {
							ngModelCtrl.$setViewValue({
								AccountAssignment02: newValue,
								AccountAssignment03: scope.AccountAssignment03
							});
							ngModelCtrl.$commitViewValue();
						}
					});

					scope.$watch('AccountAssignment03', function (newValue) {
						ngModelCtrl.$setViewValue({
							AccountAssignment02: scope.AccountAssignment02,
							AccountAssignment03: newValue
						});
						ngModelCtrl.$commitViewValue();
					});

				}
			};
		}]);
})(angular);