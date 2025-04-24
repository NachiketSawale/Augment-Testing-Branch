(function (angular) {
	/* global angular */
	'use strict';
	angular.module('platform').directive('platformClickEvent', [function () {

		return {
			restrict: 'A',
			scope: false,
			link: function link(scope, element) {

				scope.addClick = function () {
					var inputElem = element[0];
					inputElem.click();
				};

			}
		};

	}]);

})(angular);







