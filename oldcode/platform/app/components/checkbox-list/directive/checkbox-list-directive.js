(function () {
	'use strict';

	angular.module('platform').directive('platformCheckboxList', [function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'app/components/checkbox-list/template/checkbox-list-template.html',
			scope: {
				items: '=',
				options: '='
			},
			link: function ($scope) {

			}
		};
	}]);
})();