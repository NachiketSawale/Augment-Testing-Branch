(function (angular) {

	'use strict';

	var moduleName = 'basics.lookupdata';

	/**
	 * @description: Handle lookup validation in platform form control.
	 */
	angular.module(moduleName).directive('basicsLookupdataLookupValidation', [

		function () {
			return {
				restrict: 'A',
				require: 'ngModel',
				link: function (scope, element, attrs, ngModel) {
					if (!scope.$parent.config) { // not in form control.
						return;
					}

					element.addClass('ng-dirty');

					scope.$watch('$parent.config.rt$hasError()', function (error) {
						if (error) {
							ngModel.$setValidity('lookup', false);
							element.attr('title', scope.$parent.config.rt$errorText());
						}
						else {
							ngModel.$setValidity('lookup', true);
							element.removeAttr('title');
						}
					});
				}
			};
		}

	]);

})(angular);