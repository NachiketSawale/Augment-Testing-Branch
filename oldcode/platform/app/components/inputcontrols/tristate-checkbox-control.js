/*
 Usage: <tristatechk ng-model="model" class="form-control" readonly="readonly"></tristatechk>
 attributes:
 ng-model: 			the angular data model
 readonly: 			sets the control to editable or readonly
 */

(function (angular) {
	'use strict';

	angular.module('platform')
		.directive('tristatechk', ['$timeout', function ($timeout) {
			return {
				restrict: 'EA',
				replace: true,
				scope: {
					ngModel: '=',
					readonly: '@',
					onChange: '&'
				},
				template: '<input type="checkbox" ng-show="visible || true" />',
				require: '^ngModel',
				link: function (scope, element, attrs, ctrl) {
					function apply(state) {
						switch (state) {
							case false:
								element.attr('unchecked', true);
								element.attr('checked', null);
								element.prop('indeterminate', false);
								break;
							case true:
								element.attr('unchecked', null);
								element.attr('checked', true);
								element.prop('indeterminate', false);
								break;
							case 'unknown':
								element.attr('unchecked', null);
								element.attr('checked', null);
								element.prop('indeterminate', true);
								break;
						}
					}

					var states = [false, true, 'unknown'];
					element.bind('change', function () {
						element.unbind('click');

						ctrl.$parsers = [];

						var state = ctrl.$viewValue;
						state = states[(states.indexOf(state) + 1) % 3];
						apply(state);
						ctrl.$setViewValue(state);

						if (scope.onChange) {
							scope.onChange({value: state});
						}
					});
					$timeout(function () {
						// var state = scope.ngModel;
						// state = states[(states.indexOf(state)+1) %3];
						// apply( state );
						ctrl.$setViewValue(scope.ngModel);
						ctrl.$render();
					}, 0);
				}
			};
		}]);

})(angular);