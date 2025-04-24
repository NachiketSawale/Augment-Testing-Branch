/**
 * Created by uestuenel on 05.07.2017.
 * Add Css-Class in HTML-Markup.
 */
(function (angular) {
	'use strict';

	angular.module('platform').directive('platformAddCssClassDirective', platformAddCssClassDirective);

	function platformAddCssClassDirective() {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element, attrs) {

				var cssInfo = scope.$eval(attrs.platformAddCssClassDirective);
				var parentElement = cssInfo.parentName ? element.parents('.' + cssInfo.parentName) : element.parent();
				parentElement.addClass(cssInfo.newCss);

				scope.$on('$destroy', function () {
					parentElement.removeClass(cssInfo.newCss);
				});
			}
		};
	}
})(angular);
