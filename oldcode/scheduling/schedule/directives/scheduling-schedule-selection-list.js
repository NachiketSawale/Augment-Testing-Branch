(function () {
	'use strict';

	let moduleName = 'scheduling.schedule';
	/**
	 * @ngdoc directive
	 * @name schedulingScheduleSelectionList
	 * @description
	 */
	angular.module(moduleName).directive('schedulingScheduleSelectionList',
		function () {
			return {
				restrict: 'A',
				templateUrl: window.location.pathname + '/scheduling.schedule/templates/scheduling-schedule-selection-list-dialog.html',
			};
		});
})(angular);
