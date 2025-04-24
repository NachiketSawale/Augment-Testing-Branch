(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).directive('constructionSystemMasterTestInputParameterViewDirective', [function () {

		return {
			restrict: 'A',

			scope: {
				ngModel: '='
			},
			templateUrl: globals.appBaseUrl + 'constructionsystem.master/partials/test-input-partial.html',
			link: function () {
			}
		};

	}]);

})(angular);
