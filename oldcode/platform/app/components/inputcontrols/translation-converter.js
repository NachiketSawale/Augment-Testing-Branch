(function (angular) {
	'use strict';

	angular.module('platform').directive('platformTranslationConverter', converter);

	converter.$inject = ['_'];

	function converter(_) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var inGrid = !_.isUndefined(attrs.grid);

				if (!inGrid) {
					var useScope = _.get(scope.$eval(attrs.options), 'ignoreEntityEval');
					var model = scope.$eval(attrs.config).model;

					ctrl.$parsers.push(function (viewValue) {
						_.set(useScope ? scope : scope.$eval(attrs.entity), model + '.Modified', true);

						return viewValue;
					});
				}
			}
		};
	}
})(angular);