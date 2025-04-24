(function () {
	'use strict';
	var module = 'basics.workflow';

	function basicsWorkflowMasterDataService($http, globals, platformModuleStateService, basicsWorkflowClientActionService, basicsWorkflowTypeService, platformUserInfoService, $q, _) {
		var service = {};
		var state = platformModuleStateService.state('basics.workflow');

		var workflowKindRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/kind/list'
		};
		var workflowTypeRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/type/list'
		};
		var workflowActionRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/actions/list'
		};
		var workflowEntityRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/entity/list'
		};
		var workflowDataEntityRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/data/entity/list'
		};
		var workflowCreateEntityRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/entity/create/list'
		};
		var workflowPriorityRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/priority/list'
		};
		var workflowPriorityDefaultRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/priority/default'
		};
		var clerkToUserRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/clerk/clerkByUser',
			params: {UserId: null}
		};
		var moduleRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'cloud/common/module/lookup',
			headers: {
				errorDialog: false
			}
		};
		var wizardRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/config/wizard/list',
			headers: {
				errorDialog: false
			}
		};
		var entityStatusRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/entity/status/list'
		};

		var globalFilesRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/script/globals/files'
		};

		service.getModule = function () {
			return $http(moduleRequest).then(function (response) {
				state.module = response.data;
				return state.module;
			});
		};

		service.getWizard = function (moduleName) {
			wizardRequest.params = {moduleId: moduleName};
			return $http(wizardRequest).then(function (response) {
				return response.data;
			});
		};

		service.getAllWizards = function (moduleNameArray) {
			var promiseArray = [];
			state.wizards = [];
			_.forEach(moduleNameArray, function (m) {
				promiseArray.push(service.getWizard(m));
			});

			return $q.all(promiseArray).then(function (rArray) {
				_.forEach(rArray, function (response) {
					state.wizards = state.wizards.concat(response);
				});
				return state.wizards;
			});

		};

		service.getKind = function () {
			return $http(workflowKindRequest).then(function (response) {
				state.workflowKinds = response.data;
				return state.workflowKinds;
			});
		};

		service.getType = function () {
			return basicsWorkflowTypeService.getTranslated(basicsWorkflowTypeService.asArray).then(function (response) {
				state.workflowTypes = response;
				return response;
			});
		};

		service.getActions = function () {
			return $http(workflowActionRequest).then(function (response) {
				response.data.push.apply(response.data, basicsWorkflowClientActionService.getAllActions());
				state.actions = response.data;
				return response;
			});
		};

		service.getActionType = function () {
			return $http(workflowTypeRequest);
		};

		service.getPriority = function (externalState) {
			return $http(workflowPriorityRequest).then(function (response) {
				if (externalState) {
					externalState.priority = response.data;
				} else {
					state.priority = response.data;
				}
				return response.data;
			});
		};

		service.getDefaultPriority = function () {
			return $http(workflowPriorityDefaultRequest).then(function (response) {
				state.defaultPriority = response.data;
				return state.defaultPriority;
			});
		};

		service.getFacadesCombined = function () {
			return $q.all([service.getEntities(), service.getDataEntities()]).then(function (response) {
				return _.concat(response[0], response[1]);
			});
		};

		service.getEntities = function () {
			if (!_.isEmpty(state.workflowEntities)) {
				return $q.when(state.workflowEntities);
			}
			return $http(workflowEntityRequest).then(function (response) {
				state.workflowEntities = _.filter(response.data, function (entityFacade) {
					return entityFacade.EntityName !== null && entityFacade.Id !== null;
				});
				return state.workflowEntities;
			});
		};

		service.getDataEntities = function () {
			if (!_.isEmpty(state.workflowDataEntities)) {
				return $q.when(state.workflowDataEntities);
			}
			return $http(workflowDataEntityRequest).then(function (response) {
				state.workflowDataEntities = _.filter(response.data, function (entityDataFacade) {
					return entityDataFacade.Name !== null && entityDataFacade.Uuid !== null;
				});
				return state.workflowDataEntities;
			});
		};

		service.getEntityStatus = function () {
			return $http(entityStatusRequest).then(function (response) {
				state.entityStatus = [];
				_.forEach(response.data, function (typeList) {
					_.forEach(typeList, function (item) {
						state.entityStatus.push(
							{
								statusName: item.StatusName,
								description: item.ObjectTableName + ' - ' + item.StatusName + ' - ' + item.StatusTableName
							}
						);
					});
				});
				state.entityStatus = _.sortBy(state.entityStatus, 'description');
				return state.entityStatus;
			});
		};

		service.getCreateEntities = function () {
			return $http(workflowCreateEntityRequest).then(function (response) {
				state.workflowCreateEntities = response.data;
				return state.workflowCreateEntities;
			});
		};

		service.getCurrentClerk = function () {
			if(_.isNil(state.currentClerk)) {
				clerkToUserRequest.params.UserId = platformUserInfoService.getCurrentUserInfo().UserId;
				return $http(clerkToUserRequest).then(function (response) {
					state.currentClerk = response.data;
					return state.currentClerk;
				});
			}
			
			return $q.when(state.currentClerk);
		};

		service.getGlobalScriptFiles = function getGlobalScriptFiles() {
			return $http(globalFilesRequest).then(function (response) {
				state.globalScriptFiles = response.data;
				return state.globalScriptFiles;
			});
		};

		return service;
	}

	angular.module(module).factory('basicsWorkflowMasterDataService',
		['$http', 'globals', 'platformModuleStateService', 'basicsWorkflowClientActionService', 'basicsWorkflowTypeService',
			'platformUserInfoService', '$q', '_', basicsWorkflowMasterDataService]);

})();

