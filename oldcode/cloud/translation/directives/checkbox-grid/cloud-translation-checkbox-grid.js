(function () {
	'use strict';

	angular.module('platform').directive('cloudTranslationCheckboxGrid', [function () {
		return {
			restrict: 'A',
			templateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-checkbox-grid-template.html',
			scope: {
				items: '=',
				options: '=',
				name: '='
			},
			link: function ($scope) {

			}
		};
	}]);
})();