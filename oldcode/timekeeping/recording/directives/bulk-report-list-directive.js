/**
 * Created by sudarshan on 29.03.2025.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name reportStatusListDirective
	 * @description
	 */
	angular.module('timekeeping.recording').directive('bulkReportListDirective', function () {

		return {
			restrict: 'A',
			scope: true,
			templateUrl: window.location.pathname + '/timekeeping.recording/templates/bulkreportlist.html',
		};
	});
})(angular);
