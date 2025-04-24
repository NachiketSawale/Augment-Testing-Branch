(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module('procurement.package').controller('procurementPackageChangeDateController',
		['$scope', '$translate', 'procurementPackageDataService', 'moment',
			/* jshint -W074 */
			function ($scope, $translate, dataService, moment) {

				var translatePrefix = 'procurement.package.';
				$scope.options = $scope.$parent.modalOptions;
				var activity = $scope.options.validateActivity;
				var selectedItem = dataService.getSelected();
				if(_.isNil(selectedItem) && !_.isNil($scope.options.headerEntity)){
					selectedItem = $scope.options.headerEntity;
				}
				var hasActivityPlannedStart = activity.PlannedStart;
				var hasActivityPlannedFinish = activity.PlannedFinish;
				var hasActivityActualStart = activity.ActualStart;
				var hasActivityActualFinish = activity.ActualFinish;

				var dateInfo = {
					packagePlanStartDate: selectedItem.PlannedStart ? selectedItem.PlannedStart.format('YYYY-MM-DD') : 'No Value',
					packagePlanEndDate: selectedItem.PlannedEnd ? selectedItem.PlannedEnd.format('YYYY-MM-DD') : 'No Value',
					packageActStartDate: selectedItem.ActualStart ? selectedItem.ActualStart.format('YYYY-MM-DD') : 'No Value',
					packageActEndDate: selectedItem.ActualEnd ? selectedItem.ActualEnd.format('YYYY-MM-DD') : 'No Value',

					ActivityPlanStartDate: hasActivityPlannedStart ? moment.utc(activity.PlannedStart).format('YYYY-MM-DD') : 'No Value',
					ActivityPlanEndDate: hasActivityPlannedFinish ? moment.utc(activity.PlannedFinish).format('YYYY-MM-DD') : 'No Value',
					ActivityActStartDate: hasActivityActualStart ? moment.utc(activity.ActualStart).format('YYYY-MM-DD') : 'No Value',
					ActivityActEndDate: hasActivityActualFinish ? moment.utc(activity.ActualFinish).format('YYYY-MM-DD') : 'No Value'
				};

				var titleInfo = [];
				if (dateInfo.packagePlanStartDate !== dateInfo.ActivityPlanStartDate) {
					titleInfo = titleInfo.concat([
						'Planned Start Date in Package  is ' + dateInfo.packagePlanStartDate,
						'Planned Start Date in Activity is ' + dateInfo.ActivityPlanStartDate
					]);
				}
				if (dateInfo.packagePlanEndDate !== dateInfo.ActivityPlanEndDate) {
					titleInfo = titleInfo.concat([
						'Planned End   Date in Package  is ' + dateInfo.packagePlanEndDate,
						'Planned End   Date in Activity is ' + dateInfo.ActivityPlanEndDate
					]);
				}
				if (dateInfo.packageActStartDate !== dateInfo.ActivityActStartDate) {
					titleInfo = titleInfo.concat([
						'Actual  Start Date in Package  is ' + dateInfo.packageActStartDate,
						'Actual  Start Date in Activity is ' + dateInfo.ActivityActStartDate
					]);
				}
				if (dateInfo.packageActEndDate !== dateInfo.ActivityActEndDate) {
					titleInfo = titleInfo.concat([
						'Actual  End   Date in Package  is ' + dateInfo.packageActEndDate,
						'Actual  End   Date in Activity is ' + dateInfo.ActivityActEndDate
					]);
				}
				$scope.modalOptions = {
					header: {
						title: $translate.instant(translatePrefix + 'UpdateDateFormActivity')
					},
					body: {
						title: titleInfo,
						tip: 'Do you want to update the dates to the values from the activity?'
					},
					footer: {
						Accept: $translate.instant(translatePrefix + 'changeDateAccept'),
						Reject: $translate.instant(translatePrefix + 'changeDateReject')
					},
					onAccept: function () {
						$scope.$close(true);
					},
					onReject: function () {
						$scope.$close(false);
					}
				};

			}]);

})(angular);