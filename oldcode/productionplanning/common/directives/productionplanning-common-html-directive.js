/**
 * Created by lav on 4/9/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc function
	 * @name productionplanningCommonHtmlDirective
	 * @function
	 * @methodOf
	 * @description Support to render HTML
	 * @param {}
	 * @param {}
	 * @returns {}
	 */
	angular.module(moduleName).directive('productionplanningCommonHtmlDirective',
		['$compile',
			function ($compile) {
				return {
					restrict: 'A',
					require: '^ngModel',
					scope: true,
					link: function (scope, element, attrs, ngModelCtrl) {

						scope.$watch('entity', function (newValue, oldValue) {
							var options = scope.$eval('$parent.' + attrs.options) || {};
							var template = options.formatter(null, null, null, null, scope.entity);
							var templateEle = angular.element(template);
							element.empty();
							$compile(templateEle.appendTo(element))(scope);
						});
					}
				};
			}]);

})(angular);