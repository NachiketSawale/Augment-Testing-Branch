/**
 * Created by aljami on 25.03.2022.
 */
(function (angular) {
	'use strict';
	angular.module('services.schedulerui').service('servicesSchedulerUIChildJobModifyProcessor', ServicesSchedulerUIChildJobModifyProcessor);
	ServicesSchedulerUIChildJobModifyProcessor.$inject = ['moment', '_', 'platformRuntimeDataService', 'platformGridAPI', '$injector', 'servicesSchedulerUIJobLogDialogService'];

	function ServicesSchedulerUIChildJobModifyProcessor(moment, _, platformRuntimeDataService, platformGridAPI, $injector, servicesSchedulerUIJobLogDialogService) {
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
				},
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
					field: 'LoggingLevel',
					readonly: true
				},
				{
					field: 'RunInUserContext',
					readonly: true
				},
				{
					field: 'TaskType',
					readonly: true
				}
			]);


			if (job.StartTime) {
				job.StartTime = moment(job.StartTime);
			}
			if (job.ExecutionStartTime) {
				job.ExecutionStartTime = moment(job.ExecutionStartTime);
			}
			if (job.ExecutionEndTime) {
				job.ExecutionEndTime = moment(job.ExecutionEndTime);
			}

			if (_.isUndefined(job.Parameter)) {
				job.Parameter = [];
			}

			_.each(job.Parameter, function (parameter) {
				parameter.ReadOnly = true;
			});

			// rei@24.7.22 showing log for child jobs as well
			job.Log = {
				actionList: []
			};
			service.provideActionSpecification(job.Log.actionList);

		};
	}
})(angular);
