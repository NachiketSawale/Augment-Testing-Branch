/**
 * Created by aljami on 18.03.2022.
 */
(function () {

	'use strict';
	const moduleName = 'services.schedulerui';

	/**
	 * @ngdoc controller
	 * @name servicesSchedulerUIJobListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of job entities
	 **/
	angular.module(moduleName).controller('servicesSchedulerUIJobListController', servicesSchedulerUIJobListController);

	servicesSchedulerUIJobListController.$inject = ['$scope', '$rootScope', '_', '$translate', 'platformContainerControllerService', 'platformGridAPI', 'servicesSchedulerUIJobDataService', 'servicesSchedulerUIValidationProcessor'];

	function servicesSchedulerUIJobListController($scope, $rootScope, _, $translate, platformContainerControllerService, platformGridAPI, servicesSchedulerUIJobDataService, servicesSchedulerUIValidationProcessor) {

		$scope.gridId = '77f863ec4d5748d2a534addd53ecfc50';
		platformContainerControllerService.initController($scope, moduleName, $scope.gridId);

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 't1',
					caption: 'services.schedulerui.stopJob',
					type: 'item',
					cssClass: 'tlb-icons ico-stop',
					fn: function () {
						servicesSchedulerUIJobDataService.stopJob();
					},
					disabled: function () {
						const selected = servicesSchedulerUIJobDataService.getSelected();
						return !selected || selected.Version === 0 || (selected.JobState !== 2 && selected.JobState !== 5);
					}
				},
				{
					id: 'copyFromJob',
					caption: 'services.schedulerui.copyFromJob',
					type: 'item',
					cssClass: 'tlb-icons ico-copy',
					fn: function () {
						if(servicesSchedulerUIJobDataService.getSelectedEntities().length === 1){
							let job = servicesSchedulerUIJobDataService.getSelectedEntities()[0];
							if(job.Version === 0){
								return;
							}
							servicesSchedulerUIJobDataService.createItem().then(function (newJob){
								newJob.AllowChangeContext = job.AllowChangeContext;
								newJob.RunInUserContext = job.RunInUserContext;
								newJob.KeepDuration = job.KeepDuration;
								newJob.KeepCount = job.KeepCount;
								newJob.Name = job.Name + ' (Copy)';
								newJob.Parameter = _.cloneDeep(job.Parameter);
								newJob.ParameterList = job.ParameterList;
								newJob.LoggingLevel = job.LoggingLevel;
								newJob.Priority = job.Priority;
								newJob.TaskType = job.TaskType;
								newJob.MachineName = job.MachineName;
								if(!_.isEmpty(newJob.Description)){
									newJob.Description = job.Description + ' (Copy)';
								}

								platformGridAPI.items.data('ec4d55d3ebd94dcf941e536de78aff3c', newJob.Parameter);

								servicesSchedulerUIValidationProcessor.validate(newJob);
							});
						}
					},
					disabled: function () {
						if(servicesSchedulerUIJobDataService.getSelectedEntities().length !== 1){
							return true;
						}

						if(servicesSchedulerUIJobDataService.getSelectedEntities()[0].Version === 0){
							return true;
						}

						let task = servicesSchedulerUIJobDataService.getTask(servicesSchedulerUIJobDataService.getSelectedEntities()[0].TaskType);
						if(task){
							let uiCreatable = false;
							let uiChangeable = false;

							if(!_.isUndefined(task.UiCreate)){
								uiCreatable = task.UiCreate;
							}

							if(!_.isUndefined(task.UiChangeable)){
								uiChangeable = task.UiChangeable;
							}

							return !uiCreatable || !uiChangeable;
						}
						return true;
					}
				},
				{
					id: 'deleteRecord',
					caption: 'cloud.common.toolbarDelete',
					type: 'item',
					cssClass: 'tlb-icons ico-rec-delete',
					fn: function () {
						const selectedEntities = servicesSchedulerUIJobDataService.getSelectedEntities();
						servicesSchedulerUIJobDataService.deleteJobs(selectedEntities);
					},
					disabled: function () {
						const selectedEntities = servicesSchedulerUIJobDataService.getSelectedEntities();
						return selectedEntities.length === 0;
					}
				}
			]
		});

		function onSelectedRowsChanged() {
			platformGridAPI.items.data('ec4d55d3ebd94dcf941e536de78aff3c', []);
			var selected = platformGridAPI.rows.selection({
				gridId: $scope.gridId
			});

			if (selected && selected.TaskType) {
				let oldParameter = selected.Parameter;
				const taskDef = servicesSchedulerUIJobDataService.getTask(selected.TaskType);
				const paramDef = servicesSchedulerUIJobDataService.getTaskParam(selected.TaskType);
				selected.Parameter = _.cloneDeep(paramDef);
				let task = _.cloneDeep(taskDef);
				if ((task && !task.UiChangeable) || (selected.JobState !== 0 && selected.JobState !== 5)) {
					_.each(selected.Parameter, function (parameter) {
						parameter.ReadOnly = true;
					});
				}

				if (selected.Version > 0) {
					if (oldParameter && oldParameter.Length) {
						_.each(selected.Parameter, function (parameter) {
							var result = _.find(oldParameter, function (param) {
								return param.Name === parameter.Name;
							});
							if (result) {
								parameter.Value = result.Value;
							}
						});
					} else if (selected.ParameterList) {
						var parameterList = JSON.parse(selected.ParameterList);
						_.each(selected.Parameter, function (parameter) {
							var result = _.find(parameterList, function (param) {
								return param.Name === parameter.Name;
							});
							if (result) {
								parameter.Value = result.Value;
							}
						});
					}
				}
				platformGridAPI.items.data('ec4d55d3ebd94dcf941e536de78aff3c', selected.Parameter);
			} else {
				platformGridAPI.items.data('ec4d55d3ebd94dcf941e536de78aff3c', []);
			}

			updateTools();
		}

		$scope.$watch(function () {
			if (servicesSchedulerUIJobDataService.getSelected()) {
				return servicesSchedulerUIJobDataService.getSelected().TaskType;
			}
		}, function (newValue, oldValue) {
			if (newValue && typeof oldValue !== 'undefined') {
				$rootScope.$emit('selectedTaskTypeChanged', newValue);
			}
		});

		function updateTools() {
			$scope.tools.update();
		}

		$rootScope.$on('selectedTaskTypeChanged', onSelectedRowsChanged);

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
		});
	}
})();