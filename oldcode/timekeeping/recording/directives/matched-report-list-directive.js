/**
 * Created by sudarshan on 29.03.2025.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name matchedReportListDirective
	 * @description
	 */
	angular.module('timekeeping.recording').directive('matchedReportListDirective', function () {

		return {
			restrict: 'A',
			scope: true,
			templateUrl: window.location.pathname + '/timekeeping.recording/templates/matchedreportlist.html',
		};
	});
})(angular);
