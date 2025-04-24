/**
 * Created by welss on 09.03.2015
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingMainModifySummaryactivityProcessor
	 * @function
	 *
	 * @description
	 * The schedulingMainActivityImageProcessor adds path to images for activities depending on there type.
	 */

	angular.module('scheduling.main').factory('schedulingMainModifyActivityProcessor', [
		'platformRuntimeDataService', 'schedulingMainActivityTypes', 'schedulingMainConstantValues',

		function (platformRuntimeDataService, schedulingMainActivityTypes, schedulingMainConstantValues) {
			var service = {};

			function isSchedulingAutomatically(activity) {
				return activity.SchedulingMethodFk === 2;
			}

			function isConstraintDateReadOnly(activity) {
				var res = !activity.ConstraintTypeFk;

				switch (activity.ConstraintTypeFk) {
					case schedulingMainConstantValues.constraintTypes.AsLateAsPossible:
						res = true;
						break;
					case schedulingMainConstantValues.constraintTypes.AsSoonAsPossible:
						res = true;
						break;
					case schedulingMainConstantValues.constraintTypes.NoConstraint:
						res = true;
						break;
				}
				return res;
			}

			function getSummaryHammockFields(isHammock, activity) {
				return [
					{field: 'ActivityTemplateFk', readonly: true},
					{field: 'ActivityStateFk', readonly: true},
					{field: 'PlannedStart', readonly: true},
					{field: 'PlannedFinish', readonly: true},
					{field: 'PlannedDuration', readonly: true},
					{field: 'ActualStart', readonly: true},
					{field: 'ExecutionStarted', readonly: true},
					{field: 'ActualFinish', readonly: true},
					{field: 'ExecutionFinished', readonly: true},
					{field: 'ActualDuration', readonly: true},
					{field: 'ConstraintTypeFk', readonly: true},
					{field: 'ConstraintDate', readonly: true},
					{field: 'LocationFk', readonly: isHammock},
					{field: 'ActivityPresentationFk', readonly: true},
					{field: 'Quantity', readonly: true},
					{field: 'PeriodQuantityPerformance', readonly: true},
					{field: 'DueDateQuantityPerformance', readonly: true},
					{field: 'RemainingActivityQuantity', readonly: true},
					{field: 'PercentageCompletion', readonly: true},
					{field: 'PercentageRemaining', readonly: true},
					{field: 'DueDateWorkPerformance', readonly: true},
					{field: 'PeriodWorkPerformance', readonly: true},
					{field: 'RemainingActivityWork', readonly: true},
					{field: 'Work', readonly: true},
					{field: 'PackageCode', readonly: true},
					{field: 'PackageDesc', readonly: true},
					{field: 'ScheduleSubFk', readonly: true},
					{field: 'ActivitySubFk', readonly: true},
					{field: 'Predecessor', readonly: true},
					{field: 'Successor', readonly: true},
					{field: 'ActivityMasterFk', readonly: isHammock || !(activity.Schedule && activity.Schedule.ScheduleMasterFk) || !activity.Schedule}
				];
			}

			function setPerformanceValues(activity) {
				let performanceFields = [
					{
						field: 'PeriodQuantityPerformance',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'DueDateQuantityPerformance',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'RemainingActivityQuantity',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'PeriodWorkPerformance',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'DueDateWorkPerformance',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'PercentageCompletion',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'PercentageRemaining',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'RemainingActivityWork',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'ExecutionStarted',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'ExecutionFinished',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'ActualStart',
						readonly: !activity.ScheduleTypeIsExecution
					},
					{
						field: 'ActualFinish',
						readonly: !activity.ScheduleTypeIsExecution
					}];
				platformRuntimeDataService.readonly(activity, performanceFields);
			}

			service.processItem = function processItem(activity) { // jshint ignore:line

				if (activity) {
					var fields;
					switch (activity.ActivityTypeFk) {
						case schedulingMainActivityTypes.Activity:
							fields = [
								{field: 'ActivityStateFk', readonly: true},
								{
									field: 'PlannedStart',
									readonly: activity.HasCalculatedStart && isSchedulingAutomatically(activity)
								},
								{
									field: 'PlannedFinish',
									readonly: activity.HasCalculatedEnd && isSchedulingAutomatically(activity) || (activity.IsDurationEstimationDriven && activity.IsAssignedToEstimate)
								},
								{
									field: 'PlannedDuration',
									readonly: activity.IsDurationEstimationDriven && activity.IsAssignedToEstimate
								},
								{field: 'ExecutionFinished', readonly: activity.Version === 0},
								{field: 'ExecutionStarted', readonly: activity.Version === 0},
								{field: 'ActualStart', readonly: activity.Version === 0},
								{field: 'ActualFinish', readonly: activity.Version === 0},
								{field: 'ConstraintDate', readonly: isConstraintDateReadOnly(activity)},
								{field: 'PackageCode', readonly: true},
								{field: 'PackageDesc', readonly: true},
								{field: 'ScheduleSubFk', readonly: true},
								{field: 'ActivitySubFk', readonly: true},
								{field: 'ActivityMasterFk', readonly: true}
							];
							if (activity && activity.ScheduleMasterFk && activity.ScheduleMasterFk > 0) {
								fields.push({field: 'IsDurationEstimationDriven', readonly: true});
							}
							platformRuntimeDataService.readonly(activity, fields);
							break;
						case schedulingMainActivityTypes.SummaryActivity:
							fields = getSummaryHammockFields(false, activity);
							platformRuntimeDataService.readonly(activity, fields);
							break;
						case schedulingMainActivityTypes.Milestone:
							fields = [
								{
									field: 'PlannedStart',
									readonly: activity.HasCalculatedStart && isSchedulingAutomatically(activity)
								},
								{
									field: 'PlannedFinish',
									readonly: activity.HasCalculatedEnd && isSchedulingAutomatically(activity) || (activity.IsDurationEstimationDriven && activity.IsAssignedToEstimate)
								},
								{
									field: 'PlannedDuration',
									readonly: activity.IsDurationEstimationDriven && activity.IsAssignedToEstimate
								},
								{field: 'ConstraintDate', readonly: isConstraintDateReadOnly(activity)},
								{field: 'activitytemplatefk', readonly: true},
								{field: 'ActivityStateFk', readonly: true},
								{field: 'ActivityPresentationFk', readonly: true},
								{field: 'ExecutionFinished', readonly: activity.Version === 0},
								{field: 'ExecutionStarted', readonly: activity.Version === 0},
								{field: 'ActualStart', readonly: activity.Version === 0},
								{field: 'ActualFinish', readonly: activity.Version === 0},
								{field: 'ScheduleSubFk', readonly: true},
								{field: 'ActivitySubFk', readonly: true},
								{field: 'ActivityMasterFk', readonly: true}
							];
							platformRuntimeDataService.readonly(activity, fields);
							break;
						case schedulingMainActivityTypes.SubSchedule:
							fields = [
								{
									field: 'ActivityStateFk',
									readonly: true
								},
								{field: 'ActualStart', readonly: true},
								{field: 'ExecutionStarted', readonly: true},
								{field: 'ActualFinish', readonly: true},
								{field: 'ExecutionFinished', readonly: true},
								{field: 'ActualDuration', readonly: true},
								{field: 'ActivityMasterFk', readonly: true},
								{
									field: 'PlannedStart',
									readonly: activity.HasCalculatedStart && isSchedulingAutomatically(activity)
								},
								{
									field: 'PlannedFinish',
									readonly: activity.HasCalculatedEnd && isSchedulingAutomatically(activity) || (activity.IsDurationEstimationDriven  && activity.IsAssignedToEstimate)
								},
								{
									field: 'PlannedDuration',
									readonly: activity.IsDurationEstimationDriven && activity.IsAssignedToEstimate
								},
								{
									field: 'IsDurationEstimationDriven',
									readonly: true
								}
							];

							if (activity.ActivitySubFk) {
								fields.push({field: 'PlannedFinish', readonly: true});
								fields.push({field: 'PlannedDuration', readonly: !activity.Schedule || activity.Schedule && activity.Schedule.ScheduleMasterFk || activity.ActivitySubFk});
							}
							platformRuntimeDataService.readonly(activity, fields);

							break;
						case schedulingMainActivityTypes.Hammock:
							fields = getSummaryHammockFields(true, activity);
							platformRuntimeDataService.readonly(activity, fields);
							break;
						default:
							fields = [
								{
									field: 'ActivityStateFk',
									readonly: true
								}
							];
							platformRuntimeDataService.readonly(activity, fields);
							break;
					}
					if (activity.ActivityTypeFk !== schedulingMainActivityTypes.Hammock &&
						activity.ActivityTypeFk !== schedulingMainActivityTypes.SummaryActivity) {
						switch (activity.ProgressReportMethodFk) {
							case 1: // No report method
								setPerformanceValues(activity);
								break;
							case 2: // By Activity Quantity
								platformRuntimeDataService.readonly(activity, [
									{
										field: 'PeriodWorkPerformance',
										readonly: true
									},
									{
										field: 'DueDateWorkPerformance',
										readonly: true
									},
									{
										field: 'PeriodQuantityPerformance',
										readonly: false || !activity.ScheduleTypeIsExecution
									},
									{
										field: 'DueDateQuantityPerformance',
										readonly: false || !activity.ScheduleTypeIsExecution
									},
									{
										field: 'RemainingActivityQuantity',
										readonly: false || !activity.ScheduleTypeIsExecution
									},
									{
										field: 'PercentageCompletion',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'PercentageRemaining',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'RemainingActivityWork',
										readonly: true
									},
									{
										field: 'ExecutionStarted',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ExecutionFinished',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ActualStart',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ActualFinish',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'Quantity',
										// readonly: activity.HasReports || activity.ActualStart || activity.ExecutionStarted}
										readonly: false }
								]);
								break;
							case 3: // By Activity Work
								var performancefields = [
									{
										field: 'PeriodQuantityPerformance',
										readonly: true
									},
									{
										field: 'DueDateQuantityPerformance',
										readonly: true
									},
									{
										field: 'RemainingActivityQuantity',
										readonly: true
									},
									{
										field: 'ExecutionStarted',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ExecutionFinished',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ActualStart',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ActualFinish',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'PeriodWorkPerformance',
										readonly: false || !activity.ScheduleTypeIsExecution
									},
									{
										field: 'DueDateWorkPerformance',
										readonly: false || !activity.ScheduleTypeIsExecution
									},
									{
										field: 'PercentageCompletion',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'PercentageRemaining',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'RemainingActivityWork',
										readonly: false || !activity.ScheduleTypeIsExecution
									}];
								platformRuntimeDataService.readonly(activity, performancefields);
								break;
							case 4: // By Line Item Quantity
							case 5: // By Line Item Work
								var performancefields2 = [
									{
										field: 'PeriodQuantityPerformance',
										readonly: true
									},
									{
										field: 'DueDateQuantityPerformance',
										readonly: true
									},
									{
										field: 'RemainingActivityQuantity',
										readonly: true
									},
									{
										field: 'PeriodWorkPerformance',
										readonly: true
									},
									{
										field: 'DueDateWorkPerformance',
										readonly: true
									},
									{
										field: 'PercentageCompletion',
										readonly: true
									},
									{
										field: 'PercentageRemaining',
										readonly: true
									},
									{
										field: 'RemainingActivityWork',
										readonly: true
									},
									{
										field: 'ExecutionStarted',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ExecutionFinished',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ActualStart',
										readonly: !activity.ScheduleTypeIsExecution
									},
									{
										field: 'ActualFinish',
										readonly: !activity.ScheduleTypeIsExecution
									}];
								platformRuntimeDataService.readonly(activity, performancefields2);
								break;
							case 6: // As Scheduled
								setPerformanceValues(activity);
								break;
							case schedulingMainConstantValues.progressReportMethod.ByModelObjects:
								let performancefields3 = [
									{
										field: 'PeriodQuantityPerformance',
										readonly: true
									},
									{
										field: 'DueDateQuantityPerformance',
										readonly: true
									},
									{
										field: 'RemainingActivityQuantity',
										readonly: true
									},
									{
										field: 'ExecutionStarted',
										readonly: true
									},
									{
										field: 'ExecutionFinished',
										readonly: true
									},
									{
										field: 'ActualStart',
										readonly: true
									},
									{
										field: 'ActualFinish',
										readonly: true
									},
									{
										field: 'PeriodWorkPerformance',
										readonly: true
									},
									{
										field: 'DueDateWorkPerformance',
										readonly: true
									},
									{
										field: 'PercentageCompletion',
										readonly: true
									},
									{
										field: 'PercentageRemaining',
										readonly: true
									},
									{
										field: 'RemainingActivityWork',
										readonly: true
									}];
								platformRuntimeDataService.readonly(activity, performancefields3);
								break;
							default:
								setPerformanceValues(activity);
								break;
						}
					}
				}
			};

			// platformRuntimeDataService.applyValidationResult();

			return service;

		}]);
})(angular);
