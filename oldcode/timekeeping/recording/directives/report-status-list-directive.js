/**
 * Created by sudarshan on 26.03.2025.
 */
(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name reportStatusListDirective
	 * @description
	 */
	angular.module('timekeeping.recording').directive('reportStatusListDirective', function () {

		return {
			restrict: 'A',
			scope: true,
			templateUrl: window.location.pathname + '/timekeeping.recording/templates/reportstatuslist.html'
		};
	});
})(angular);
