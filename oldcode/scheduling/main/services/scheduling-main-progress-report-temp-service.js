/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityRelationshipService
	 * @function
	 *
	 * @description
	 * schedulingMainActivityRelationshipService is the data service for all activityRelationship related functionality.
	 */
	schedulingMainModule.service('schedulingMainProgressReportTempService', SchedulingMainProgressReportTempService);

	SchedulingMainProgressReportTempService.$inject = ['_'];

	function SchedulingMainProgressReportTempService(_) {
		var data = {
			progressReportsNotSaved: []
		};

		this.takeCareOfNewReport = function takeCareOfNewReport(report) {
			data.progressReportsNotSaved.push(report);
		};

		this.handleOutReportsForActivity = function handleOutReportsForActivity(updateData) {
			var activityId = updateData.MainItemId;
			var forActivity = _.filter(data.progressReportsNotSaved, function(candidate) {
				return candidate.ActivityFk === activityId;
			});
			data.progressReportsNotSaved = _.filter(data.progressReportsNotSaved, function(candidate) {
				return candidate.ActivityFk !== activityId;
			});

			if(forActivity && forActivity.length > 0) {
				updateData.ProgressReportsToSave = updateData.ProgressReportsToSave || [];
				_.forEach(forActivity, function(newReport) {
					updateData.ProgressReportsToSave.push(newReport);
				});
			}

			return forActivity;
		};
	}
})(angular);