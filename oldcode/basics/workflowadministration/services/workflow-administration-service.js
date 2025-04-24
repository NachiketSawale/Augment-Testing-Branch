/* global angular */

(function () {
	'use strict';
	var moduleName = 'basics.workflowAdministration';

	function workflowAdministration(globals, $http, $q, _, moment, platformModuleStateService, basicsWorkflowInstanceStatusArray, platformDataProcessExtensionHistoryCreator) {
		var service = {};

		var state = platformModuleStateService.state('basics.workflowAdministration');

		var clientActionRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/instance/action/client/list',
			headers: {
				errorDialog: false
			}
		};
		var clientOverdueActionRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/instance/action/client/overduelist',
			headers: {
				errorDialog: false
			}
		};

		service.getList = function () {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/list'
				}
			).then(function (response) {

				state.mainEntities = response.data;

				_.each(state.mainEntities,
					function (item) {
						item.Context = angular.fromJson(item.Context);
						var index = angular.isNumber(item.Status) ? item.Status : 0;
						item.StatusName = basicsWorkflowInstanceStatusArray.getByIndex(index);
						item.Started = moment(item.Started);
						item.Endtime = moment(item.Endtime);
						platformDataProcessExtensionHistoryCreator.processItem(item);
					});

				return $q(function (resolve) {
					resolve(response.data);
				});
			});

		};

		service.getFilteredList = function (filterRequest) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/byfilter',
					data: filterRequest
				}
			).then(function (response) {
				state.mainEntities = response.data.dtos;

				_.each(state.mainEntities,
					function (item) {
						processItem(item, false);
					});
				return response.data;
			});
		};

		service.getFilteredListTree = function (filterRequest) {
			$http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/getTree',
					data: filterRequest
				}
			).then(function (response) {
				state.mainEntitiesTrees = response.data.dtos;

				_.each(state.mainEntitiesTrees,
					function (item) {
						processItem(item, true);
					});
			});
		};

		function processItem(item, isTree) {
			if (item.Context) {
				item.Context = angular.fromJson(item.Context);
			}
			var index = angular.isNumber(item.Status) ? item.Status : 0;
			item.StatusName = basicsWorkflowInstanceStatusArray.getByIndex(index);
			item.Started = moment(item.Started);
			item.Endtime = moment(item.Endtime);
			platformDataProcessExtensionHistoryCreator.processItem(item);
			if (isTree && item.Children.length > 0) {
				item.Children.forEach(child => {
					processItem(child);
				});
			}
		}

		service.getHistory = function (workflowInstanceId) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/history',
					params: {workflowInstanceId: workflowInstanceId}
				}
			).then(function (response) {
				_.forEach(response.data, function (item) {
					item.Started = moment(item.Started);
					item.Endtime = moment(item.Endtime);
				});
				return response;
			});
		};

		service.goToAdministrationEndpoint = function (item) {
			var request = {
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/instance/byid',
				params: {id: item.id}
			};

			return $http(request)
				.then(function (result) {
					result.data.Context = angular.fromJson(result.data.Context);
					if (state.mainEntities.length !== 0) {
						result.data = _.find(state.mainEntities, {Id: result.data.Id});
					} else {
						state.mainEntities = [result.data];
					}
					state.selectedMainEntity = result.data;
				});
		};

		service.escalateWorkflow = function (id) {
			return $http(
				{
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/escalate',
					params: {instanceId: id}
				}
			).then(breakResponseFn);
		};

		// service.killWorkflow = function (id) {
		// 	return $http(
		// 		{
		// 			method: 'GET',
		// 			url: globals.webApiBaseUrl + 'basics/workflow/instance/kill',
		// 			params: {instanceId: id}
		// 		}
		// 	).then(breakResponseFn);
		// };

		//ALM 109128 - Killing one or selected workflow Instances.
		service.killWorkflowOrInBulk = function (insatnceIdList) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/killinbulk',
					data: insatnceIdList
				}
			).then(breakResponseFn);
		};

		service.clientActionInstancList = function clientActionInstancList() {
			return $http(clientActionRequest).then(function (response) {
				return response.data;
			});
		};

		service.clientOverdueActionInstancList = function clientOverdueActionInstancList() {
			return $http(clientOverdueActionRequest).then(function (response) {
				return response.data;
			});
		};

		function sortInMainEntity(item) {
			var index = _.findIndex(state.mainEntities, {Id: item.Id});
			state.mainEntities[index] = item;
			if (state.selectedMainEntity.Id === item.Id) {
				state.selectedMainEntity = item;
			}
			return item;
		}

		function updateBreakResponseFn(instance) {
			instance.Context = angular.fromJson(instance.Context);
			var index = angular.isNumber(instance.Status) ? instance.Status : 0;
			instance.StatusName = basicsWorkflowInstanceStatusArray.getByIndex(index);
			sortInMainEntity(instance);
		}

		function breakResponseFn(response) {
			var instance = response.data;
			if (angular.isArray(instance)) {
				_.forEach(instance, function (instance) {
					updateBreakResponseFn(instance);
				});
			} else if (angular.isObject(instance)) {
				updateBreakResponseFn(instance);
			}
		}

		service.getSelected = function () {
			let selectedActionInstance = state.selectedActionInstance;
			return selectedActionInstance;
		};

		service.getApproversForInstance = function (instanceId) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/approver/getEntityApproversForInstance',
				params: { instanceId: instanceId }
			}).then(response=>{
				response.data.forEach(item=>{
					item.EvaluatedOn = item.EvaluatedOn === null ? null : moment(item.EvaluatedOn);
					item.DueDate = item.DueDate === null ? null : moment(item.DueDate);
				});
				return response;
			});
		};

		return service;
	}

	angular.module(moduleName).factory('basicsWorkflowAdministrationInstanceService', ['globals', '$http', '$q', '_', 'moment',
		'platformModuleStateService', 'basicsWorkflowInstanceStatusArray', 'platformDataProcessExtensionHistoryCreator', workflowAdministration]);

})();