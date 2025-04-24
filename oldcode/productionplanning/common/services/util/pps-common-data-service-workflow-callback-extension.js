/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanning.common:ppsCommonDataServiceMergeExtension
	 * @function
	 * @requires
	 * @description
	 */
	angular.module('productionplanning.common').service('ppsCommonDataserviceWorkflowCallbackExtension', PpsCommonDataserviceWorkflowCallbackExtension);

	PpsCommonDataserviceWorkflowCallbackExtension.$inject= ['_', 'moment', 'ppsCommonDataLoadService', 'basicsWorkflowInstanceService', 'basicsWorkflowTaskPopUpService'];

	function PpsCommonDataserviceWorkflowCallbackExtension(_, moment, ppsCommonDataLoadService, basicsWorkflowInstanceService, basicsWorkflowTaskPopUpService) {
		/**
		 * @ngdoc function
		 * @name addMergeFunctionality
		 * @function
		 * @methodOf productionplanning.common.ppsCommonDataserviceWorkflowCallbackExtension
		 * @description adds methods to update dtaa after a workflow.
		 * @param container {object} contains entire service and its data to be created
		 * @returns
		 */
		var extension = this;

		extension.addWorkflowCallbackExtension = function addWorkflowCallbackExtension(container) {
			container.service.mergeWorkflowData = function (workflowInstance) {
				return mergeWorkflowData(container, workflowInstance);
			};

			container.service.checkForWorkflow = function (statusChangeResults) {
				return checkForWorkflow(container, statusChangeResults);
			};
		};

		function mergeWorkflowData(container, workflowInstance) {
			if (workflowInstance.StatusName === 'finished' && !_.isNil(workflowInstance.Context)) {

				var context = _.isString(workflowInstance.Context)? angular.fromJson(workflowInstance.Context): workflowInstance.Context;
				//if entity is here and module id matches current module
				if (_.has(context, 'Entity') && workflowInstance.ModuleName === container.service.getModule().name){
					if (_.has(context, 'ChildWorkflowInstance')) {
						pollClientActions().then(function(taskList) {
							var taskFromChildWorkflowInstance = _.find(taskList, { WorkflowInstanceId: context.ChildWorkflowInstance.InstanceId });
							if (!_.isNil(taskFromChildWorkflowInstance)){
								basicsWorkflowTaskPopUpService.openAsPopUp(taskFromChildWorkflowInstance);
							} else {
								updateDataByIds(container, [context.Entity.Id]);
							}
						});
					} else {
						updateDataByIds(container, [context.Entity.Id]);
					}
				}
			}
		}

		function checkForWorkflow(container, statusChangeResults) {
			var triggeredWorkflow = _.some(statusChangeResults, { hasConfiguredWorkflows: true});
			if (triggeredWorkflow === true) {
				pollClientActions().then(function(taskList) {
					var hasRunningWorkflow = false;
					if (!_.isEmpty(taskList)) {
						var mostRecentStartDate = moment.max(_.map(taskList, function(task) {
							return moment(task.Started);
						}));
						//very provisionary for now
						hasRunningWorkflow = mostRecentStartDate > moment().add(-1, 'minute');
					}
					if (!hasRunningWorkflow) {
						var changedEntities = _.map(statusChangeResults, 'entity.Id');
						updateDataByIds(container, changedEntities);
					}
				});
			}
		}

		function pollClientActions() {
			return basicsWorkflowInstanceService.getTaskList(basicsWorkflowInstanceService.task.showGroupTask).then(function(taskList) {
				return taskList;
			});
		}

		function updateDataByIds(container, idList) {
			var filterRequest = {
				PKeys : _.map(idList, function(id) {
					return {Id: id};
				})
			};
			ppsCommonDataLoadService.updateData(container, filterRequest);
		}

		return extension;
	}
})();