(function (angular) {
	'use strict';

	function angularCompile($compile) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, element, attrs) {
				// assign it into the current DOM
				element.html(scope.$eval(attrs.platformAngularCompile));

				// compile the new DOM and link it to the current scope.
				$compile(element.contents())(scope);
			}
		};
	}

	angular.module('platform').directive('platformAngularCompile', ['$compile', angularCompile]);
})(window.angular);