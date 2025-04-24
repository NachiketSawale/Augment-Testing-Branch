(function (angular) {
	'use strict';

	angular.module('platform').directive('platformCodeConverter', converter);

	converter.$inject = ['_'];

	function converter(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {

				ctrl.$formatters.unshift(function formatter(modelValue) {
					return modelValue;
				});

				ctrl.$parsers.push(function parser(viewValue) {
					if (viewValue) {
						if (_.isString(viewValue)) {
							var trans = viewValue.toUpperCase();

							if (trans !== viewValue) {
								ctrl.$setViewValue(trans);
								ctrl.$render();
							}

							return trans;
						}

						return viewValue;
					}

					return '';
				});
			}
		};
	}
})(angular);