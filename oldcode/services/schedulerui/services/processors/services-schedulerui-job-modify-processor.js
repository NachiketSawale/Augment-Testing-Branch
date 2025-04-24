/**
 * Created by aljami on 25.03.2022.
 */
(function (angular) {
	'use strict';
	angular.module('services.schedulerui').service('servicesSchedulerUIJobModifyProcessor', ServicesSchedulerUIJobModifyProcessor);
	ServicesSchedulerUIJobModifyProcessor.$inject = ['moment', '_', 'platformRuntimeDataService', 'platformGridAPI', '$injector', 'servicesSchedulerUIJobLogDialogService'];

	function ServicesSchedulerUIJobModifyProcessor(moment, _, platformRuntimeDataService, platformGridAPI, $injector, servicesSchedulerUIJobLogDialogService) {
		var service = this;
		this.provideActionSpecification = function provideActionSpecification(actionList) {
			actionList.push({
				toolTip: 'Show log file - ',
				icon: 'control-icons ico-filetype-log',
				callbackFn: function (entity) {
					servicesSchedulerUIJobLogDialogService.showLogDialog(entity.Id);
				},
				readonly: false
			});
		};

		service.processItem = function processItem(job) {
			let mainService = $injector.get('servicesSchedulerUIJobDataService');
			let task = null;
			if (job.TaskType) {
				task = mainService.getTask(job.TaskType);
			}

			// always readonly
			platformRuntimeDataService.readonly(job, [
				{
					field: 'JobState',
					readonly: true
				},
				{
					field: 'ExecutionStartTime',
					readonly: true
				},
				{
					field: 'ExecutionEndTime',
					readonly: true
				},
				{
					field: 'ExecutionMachine',
					readonly: true
				}
			]);

			if (job.Version === 0) { // for new entity

			} else { // for old entity
				// always readonly
				platformRuntimeDataService.readonly(job, [
					{
						field: 'TaskType',
						readonly: true
					},
					{
						field: 'MachineName',
						readonly: true
					}
				]);

				if (job.JobState === 5) {
					// for repetitive jobs
					platformRuntimeDataService.readonly(job, [
						{
							field: 'RunInUserContext',
							readonly: (task) ? !task.AllowChangeContext : true
						}
					]);

					if(task && !task.UiChangeable){
						platformRuntimeDataService.readonly(job, [
							{
								field: 'Name',
								readonly: true
							},
							{
								field: 'Description',
								readonly: true
							},
							{
								field: 'StartTime',
								readonly: true
							},
							{
								field: 'RepeatUnit',
								readonly: true
							},
							{
								field: 'RepeatCount',
								readonly: true
							},
							{
								field: 'LoggingLevel',
								readonly: true
							},
							{
								field: 'Priority',
								readonly: true
							},
							{
								field: 'RunInUserContext',
								readonly: true
							}
						]);
					}
				} else {
					// for jobs that are not repetitive
					platformRuntimeDataService.readonly(job, [
						{
							field: 'Name',
							readonly: true
						},
						{
							field: 'Description',
							readonly: true
						},
						{
							field: 'StartTime',
							readonly: true
						},
						{
							field: 'RepeatUnit',
							readonly: true
						},
						{
							field: 'RepeatCount',
							readonly: true
						},
						{
							field: 'KeepDuration',
							readonly: true
						},
						{
							field: 'KeepCount',
							readonly: true
						},
						{
							field: 'LoggingLevel',
							readonly: true
						},
						{
							field: 'Priority',
							readonly: true
						},
						{
							field: 'RunInUserContext',
							readonly: true
						}
					]);
				}
			}

			if (job.Version === 0) {
				if (_.isUndefined(job.Parameter)) {
					job.Parameter = [];
				}

				platformGridAPI.items.data('ec4d55d3ebd94dcf941e536de78aff3c', job.Parameter);
			}

			if((task && !task.UiChangeable) || (job.JobState !== 0 && job.JobState !== 5)){
				_.each(job.Parameter, function (parameter) {
					parameter.ReadOnly = true;
				});
			}

			if (!job.RepeatUnit) {
				job.RepeatUnit = 0;
			}
			if (job.StartTime) {
				job.StartTime = moment(job.StartTime);
			}
			if (job.ExecutionStartTime) {
				job.ExecutionStartTime = moment(job.ExecutionStartTime);
			}
			if (job.ExecutionEndTime) {
				job.ExecutionEndTime = moment(job.ExecutionEndTime);
			}

			job.Log = {
				actionList: []
			};
			service.provideActionSpecification(job.Log.actionList);

		};
	}
})(angular);
