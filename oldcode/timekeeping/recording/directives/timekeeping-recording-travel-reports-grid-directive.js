(function () {

	/*global angular*/
	'use strict';

	/**
	 * @ngdoc directive
	 * @name timekeepingRecordingTravelReportsGridDirective
	 * @requires
	 * @description
	 */
	angular.module('timekeeping.recording').directive('timekeepingRecordingTravelReportsGridDirective', function () {

		return {
			restrict: 'A',

			scope: {
				ngModel: '='
			},
			templateUrl: window.location.pathname + '/timekeeping.recording/templates/timekeeping-recording-travel-reports.html',
			link: function (/*scope, ele, attrs*/) {
			}
		};

	});

})();
