(function (angular) {
// eslint-disable-next-line no-redeclare
/* globals angular */
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc directive
	 * @name constructionsystemMainColumnConfigDetailGrid
	 * @requires
	 * @description display a gridview to configure dynamic columns
	 */

	angular.module(moduleName).directive('constructionsystemMainColumnConfigDetailGrid', ['$templateCache',
		function ($templateCache) {
			return {
				restrict: 'A',
				// templateUrl: globals.appBaseUrl + 'estimate.main/templates/column-config/estimate-main-column-config-details.html'
				template : $templateCache.get('constructionsystem-main-column-config-details.html')
			};
		}
	]);

})(angular);
