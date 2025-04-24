(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name cloudCommonCode
	 * @description
	 * This directive transforms the value of the viewModel and dataModel.
	 * Use it as attribute on input elements
	 *
	 * @TODO Add rules (textinput type code)
	 */
	angular.module('cloud.common')
		.directive('cloudCommonCode', function (uppercaseFilter, $parse) {
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function (scope, element, attrs, modelCtrl) {
					var transform = function (inputValue) {
						var transformed = inputValue.toUpperCase();
						if (transformed !== inputValue) {
							modelCtrl.$setViewValue(transformed);
							modelCtrl.$render();
						}
						return transformed;
					};
					var model = $parse(attrs.ngModel);
					modelCtrl.$parsers.push(transform);
					var value = element.val();
					if (value) {
						transform(model(value));
					}
				}
			};
		});
})(angular);
