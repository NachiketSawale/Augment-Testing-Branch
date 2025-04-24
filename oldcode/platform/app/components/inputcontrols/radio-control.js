(function (angular) {
	'use strict';

	angular.module('platform')
		.directive('radioctrl', function () {
			return {
				restrict: 'AE',
				scope: {
					ngModel: '=',
					onChange: '&'
				},
				template: '<input type="radio" name="radioGroup" ng-model="ngModel" ng-change="optionChanged()">',
				link: function (scope, elem, attrs) {
					var radio = elem.find('input')[0];

					scope.optionChanged = function () {
						scope.onChange({newVal: radio.checked});
					};
				}
			};
		});

})(angular);