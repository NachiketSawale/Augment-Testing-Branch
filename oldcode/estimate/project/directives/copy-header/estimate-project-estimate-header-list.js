/**
 * Created by joshi on 06.10.2019.
 */
(function () {
	'use strict';

	let moduleName = 'estimate.project';
	/**
	 * @ngdoc directive
	 * @name estimateProjectEstimateHeaderList
	 * @description
	 */
	angular.module(moduleName).directive('estimateProjectEstimateHeaderList',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/estimate.project/templates/estimate-project-estimate-header-list-dialog.html',
			};
		});
})(angular);
