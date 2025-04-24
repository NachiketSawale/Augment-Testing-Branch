/**
 * Created by wui on 1/24/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.material';

	angular.module(moduleName).directive('basicsMaterialAlternativeSource', [
		function () {
			return {
				restrict: 'A',
				scope: {
					list: '='
				},
				templateUrl: globals.appBaseUrl + 'basics.material/templates/lookup/material-alternative-source.html'
			};
		}
	]);

})(angular);