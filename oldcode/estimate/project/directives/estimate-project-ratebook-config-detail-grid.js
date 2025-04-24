/**
 * Created by bel on 2018/8/1.
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.project';

	/**
     * @ngdoc directive
     * @name projectMainRatebookConfigDetailGrid
     * @requires
     * @description display a gridview to configure ratebook
     */

	angular.module(moduleName).directive('estimateProjectRatebookConfigDetailGrid', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'estimate.project/templates/estimate-project-ratebook-grid.html',
				controller: 'estimateProjectRateBookListController'
			};
		}
	]);

})(angular);

