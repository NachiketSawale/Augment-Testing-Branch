(function (angular) {
	'use strict';
	/*if code-convert change,this file should be change*/
	angular.module('basics.procurementstructure').directive('eventCodeConverter', converter);

	//converter.$inject = ['_'];

	function converter() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {

				ctrl.$formatters.unshift(function (modelValue) {
					return modelValue;
				});

				ctrl.$parsers.push(function (viewValue) {
					var trans = parseInt(viewValue || 0, 10);
					ctrl.$setViewValue(trans);
					ctrl.$render();
					return trans;
				});
			}
		};
	}
})(angular);
