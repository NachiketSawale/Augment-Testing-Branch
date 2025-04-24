(function (angular) {
	/* global Platform */
	'use strict';
	var moduleName = 'basics.workflow';
	var instanceStatus = {
		running: 1,
		finished: 2,
		escalate: 3,
		waiting: 4,
		failed: 5,
		killed: 6,
		validationError: 7,
		getStatusById: function (id) {
			for (var key in instanceStatus) {
				if (angular.isNumber(instanceStatus[key]) && instanceStatus[key] === id) {
					return key;
				}
			}
		}
	};

	function workflowInstanceService(globals, $http, _, $interval, $injector, basicsWorkflowClientActionService, basicsWorkflowInstanceStatus,
		platformModuleStateService, basicsWorkflowDtoService, $window, platformUserInfoService, $q, $rootScope, basicsWorkflowModuleUtilService,
		$state, cloudDesktopSidebarService, basicsWorkflowActionInstanceStatusService, BasicsCommonDateProcessor, platformContextService, basicsWorkflowUtilityService) {

		var service = {};
		var state = platformModuleStateService.state(moduleName);

		var taskListKey = globals.appBaseUrl + 'taskList';
		var sealKey = globals.appBaseUrl + 'taskSeal';
		var showGroupKey = globals.appBaseUrl + 'showGroupKey';
		var selectedTaskKey = globals.appBaseUrl + 'selectedTask';

		service.selectionChanged = new Platform.Messenger();
		service.updateDataExtensionEvent = new Platform.Messenger();
		service.updateViewEvent = new Platform.Messenger();

		service.task = {
			internalList: [],
			internalTaskIdList: [],
			internalListSeal: {},
			internalShowGroupTask: false,
			internalSelectedTask: {},
			get list() {
				var list = [];
				var userId = platformUserInfoService.getCurrentUserInfo().UserId;
				try {
					list = this.internalList[taskListKey + userId];
				} catch (ex) {
					console.log('failed internalList access with userid:' + userId);
				}
				if (!list) {
					list = [];
				}
				return list;
			},
			set list(list) {
				this.internalList[taskListKey + platformUserInfoService.getCurrentUserInfo().UserId] = list;
			},
			get taskIdList() {
				var list = [];
				var userId = platformUserInfoService.getCurrentUserInfo().UserId;
				try {
					list = this.internalTaskIdList[taskListKey + userId];
				} catch (ex) {
					console.log('failed internalTaskIdList access with userid:' + userId);
				}
				if (!list) {
					list = [];
				}
				return list;
			},
			set taskIdList(list) {
				this.internalTaskIdList[taskListKey + platformUserInfoService.getCurrentUserInfo().UserId] = list;

			},
			get listSeal() {
				return this.internalListSeal[sealKey + platformUserInfoService.getCurrentUserInfo().UserId];
			},
			set listSeal(value) {
				if (value) {
					this.internalListSeal[sealKey + platformUserInfoService.getCurrentUserInfo().UserId] = value.toString();
				} else {
					this.internalListSeal[sealKey + platformUserInfoService.getCurrentUserInfo().UserId] = Math.random().toString();
				}
			},
			get count() {
				return this.list.length;
			},
			get showGroupTask() {
				var result = true;
				try {
					result = this.internalShowGroupTask[showGroupKey + platformUserInfoService.getCurrentUserInfo().UserId];
				} catch (ex) {
					result = true;
				}

				return result;
			},
			set showGroupTask(showGroupTask) {
				this.internalShowGroupTask[showGroupKey + platformUserInfoService.getCurrentUserInfo().UserId] = showGroupTask;
			},
			get selectedTask() {
				var item;
				try {
					item = service.prepareTask(this.internalSelectedTask[selectedTaskKey + platformUserInfoService.getCurrentUserInfo().UserId]);
				} catch (ex) {
					item = null;
				}
				return item;
			},
			set selectedTask(item) {
				this.internalSelectedTask[selectedTaskKey + platformUserInfoService.getCurrentUserInfo().UserId] = item;
			}
		};

		// Added service call for task Module.
		service.taskListForModule = [];

		var groupTaskListRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/runningworkflowaction/all/list',
			headers: {
				errorDialog: false
			}
		};

		var getTaskByIdRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/runningworkflowaction/item',
			headers: {
				errorDialog: false
			}
		};

		var saveTaskRequest = {
			method: 'POST',
			url: globals.webApiBaseUrl + 'basics/workflow/runningworkflowaction/save',
			headers: {
				errorDialog: false
			}
		};

		var changeUserRequest = {
			method: 'POST',
			url: globals.webApiBaseUrl + 'basics/workflow/runningworkflowaction/changeuser',
			headers: {
				errorDialog: false
			}
		};
		var changeProgressedByUserRequest = {
			method: 'POST',
			url: globals.webApiBaseUrl + 'basics/workflow/runningworkflowaction/changeprogressedbyuser',
			headers: {
				errorDialog: false
			}
		};
		var continueTaskRequest = {
			method: 'POST',
			url: globals.webApiBaseUrl + 'basics/workflow/instance/continue',
			headers: {
				errorDialog: false
			}
		};

		var escalateTaskRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/instance/escalatebyaction',
			headers: {
				errorDialog: false
			}
		};

		var taskCountRequest = {
			method: 'GET',
			url: globals.webApiBaseUrl + 'basics/workflow/runningworkflowaction/count',
			headers: {
				errorDialog: false
			}
		};

		var stopTaskRequest = {
			method: 'POST',
			url: globals.webApiBaseUrl + 'basics/workflow/instance/stop',
			headers: {
				errorDialog: false
			}
		};
		var workflowCallbackListener = [];

		function Group(key, name, children, visible) {
			var group = this;
			group.key = key;
			group.name = name;
			group.childs = children;
			group.visible = visible;
			group.icoClass = function () {
				return group.visible ? 'ico-up' : 'ico-down';
			};
			group.count = children.length;
		}

		function getFromContextJs(context, placeholder) {
			var path = placeholder.replace('{{', '').replace('}}', '');
			/* jshint -W054 */
			var fn = new Function('Context', 'return ' + path + ';');
			/* jshint -W054 */
			var fnFallback = new Function('Context', 'return Context.' + path + ';');
			var result;
			try {
				result = fn(context);
			} catch (e) {
				try {
					result = fnFallback(context);
					if (result === undefined) {
						result = placeholder;
					}
				} catch (e) {
					result = placeholder;
				}
			}
			return result;
		}

		function replaceFactory(prop, context, displaySpecialChars = false) {
			return function replaceContextParam(obj) {
				// eslint-disable-next-line no-useless-escape
				var regEx = new RegExp('\{\{(.*?)\}\}', 'g');
				if (_.isString(obj[prop])) {
					_.forEach([...obj[prop].matchAll(regEx)], function (match) {
						try {
							var value = getFromContextJs(context, match[0]);
							if (_.isObject(value)) {
								value = JSON.stringify(value);
							}
							if (_.isString(value)) {
								value = value.replace(/[\n\r\t]+/gm, '');
							}
							if (value !== '' && isJson(value)) {
								obj[prop] = obj[prop].replace('"' + match[0] + '"', value);
							} else if (_.isString(value) && displaySpecialChars) {
								value = value.replace(/\\/gm, '\\\\').replaceAll('\"', '\\"');
							}
							obj[prop] = obj[prop].replace(match[0], value);
						} catch (err) {
							console.error(err);
						}
					});
				}
			};
		}

		function saveFromJson(obj) {
			if (angular.isString(obj) && obj.length > 0) {
				try {
					var objAsJson = angular.fromJson(obj);
					return _.isObject(objAsJson) ? objAsJson : saveFromJson(objAsJson);
				} catch (err) {
					return '';
				}
			}
			return '';
		}

		service.prepareTask = function prepareTask(item) {
			if (angular.isString(item.Context)) {
				item.Context = saveFromJson(item.Context);
			} else if (item.Context === undefined || item.Context === null) {
				item.Context = {};
			}

			if (angular.isString(item.Input)) {
				item.Input = saveFromJson(item.Input);
			}
			var processor = new BasicsCommonDateProcessor(['Endtime', 'Started']);
			processor.processItem(item);
			replaceFactory('comment', item.Context)(item);

			if (item.actionId === '00000000000000000000000000000000') {
				_.each(item.Input, replaceFactory('value', item.Context, true));
			} else {
				_.each(item.Input, replaceFactory('value', item.Context));
			}

			if (angular.isString(item.Output)) {
				item.Output = saveFromJson(item.Output);
			}
			var transitions = saveFromJson(item.Transitions);
			var decisionValues = [];
			if (!item.options) {
				_.each(transitions, function (t) {
					if (t.parameter !== undefined && _.find(decisionValues, { id: t.parameter }) === undefined) {
						decisionValues.push(
							{
								id: t.parameter,
								parameter: t.description ? t.description : t.parameter
							}
						);
					}

				});
				item.options = decisionValues;
			}

			item.Input = angular.fromJson(item.Input);

			var configObj = _.find(item.Input, { key: 'Config' });
			var titleObj;
			var subTitleObj;
			if (configObj) {
				configObj = angular.fromJson(configObj.value);
				titleObj = _.find(configObj, { description: 'Title' });
				if (titleObj) {
					try {
						item.Title = titleObj.options.displayText;
					} catch (ex) {
						item.Title = item.Description;
					}
				}

				subTitleObj = _.find(configObj, { description: 'Subtitle' });
				if (subTitleObj) {
					try {
						item.SubTitle = subTitleObj.options.displayText;
					} catch (ex) {
						item.SubTitle = item.Comment;
					}
				}

			} else {

				titleObj = _.find(item.Input, { key: 'Title' });
				if (titleObj) {
					item.Title = titleObj.value;
				}
				subTitleObj = _.find(item.Input, { key: 'Subtitle' });
				if (subTitleObj) {
					item.SubTitle = subTitleObj.value;
				}
			}
			//item.Result = undefined;
			item.Action = basicsWorkflowClientActionService.getAction(item.ActionId);
			item.StatusName = basicsWorkflowActionInstanceStatusService.getStatusById(item.Status);

			/**
			 * Load default values if available
			 */
			if(item && item.Action && item.Action.setDefaultValues && angular.isFunction(item.Action.setDefaultValues)) {
				item.Action.setDefaultValues(item);
			}

			return basicsWorkflowDtoService.extendObject(item);
		};

		function isJson(str) {
			str = typeof str !== 'string' ? JSON.stringify(str) : str;
			try {
				str = JSON.parse(str);
			} catch (e) {
				return false;
			}
			if (typeof str === 'object' && str !== null) {
				return true;
			}
			return false;
		}

		function filterData(data, listConfig) {
			if (listConfig && listConfig.filter) {
				if (listConfig.filter.value) {
					listConfig.isFiltered = true;
					data = _.filter(data, listConfig.filter.fn);
				}
				listConfig.filter.count = data.length;
			}

			if (listConfig && listConfig.mainEntityFilter) {
				if (listConfig.mainEntityFilter.isFilter) {
					data = _.filter(data, listConfig.mainEntityFilter.fn);
				}
			}

			if (listConfig && listConfig.companyFilter) {
				if (listConfig.companyFilter.isFilter) {
					data = _.filter(data, listConfig.companyFilter.fn);
				}
			}

			return data;
		}

		function sortData(data, listConfig) {
			if (listConfig && listConfig.sort && listConfig.sort.value) {
				listConfig.isSorted = true;
				data = _.sortBy(data, listConfig.sort.property);
				if (listConfig.sort.desc) {
					data = data.reverse();
				}
			}
			return data;
		}

		function groupData(data, listConfig) {
			if (listConfig && listConfig.grouping && listConfig.grouping.value) {
				listConfig.isGrouped = true;
				data = _.groupBy(data, listConfig.grouping.value);
				var tempResult = [];
				var groups = _.keys(data);
				for (var i = 0; i < groups.length; i++) {
					var header = _.get(data[groups[i]][0], listConfig.grouping.headerValue, '');
					tempResult.push(new Group(groups[i], header, data[groups[i]], checkGroupVisibility(listConfig, groups[i])));
				}
				data = tempResult;
			}
			return data;
		}

		function checkGroupVisibility(listConfig, key) {
			var isGroupVisible = true;
			// eslint-disable-next-line no-prototype-builtins
			if (listConfig.groupStatus && listConfig.groupStatus.hasOwnProperty(key)) {
				isGroupVisible = listConfig.groupStatus[key];
			}

			return isGroupVisible;
		}

		function selectData(data, listConfig) {
			var select = data;
			if (data.length > 0) {
				var filterFn = function (item) {
					return item.status !== 4 && item.status !== 3;
				};
				// eslint-disable-next-line no-prototype-builtins
				if (data[0].hasOwnProperty('childs')) {
					_.forEach(data, function (group) {
						group.childs = _.filter(group.childs, filterFn);
						group.count = group.childs.length;
					});
				} else {
					select = _.filter(data, filterFn);
				}

			}
			_.set(listConfig, 'select.count', select.length);
			return select;
		}

		function prepareData(data, listConfig) {
			var i;
			var p;
			if (!listConfig) {
				listConfig = {};
			}

			listConfig.isFiltered = listConfig.isSorted = listConfig.isGrouped = false;

			if (!data) {
				return [];
			}

			_.each(data, service.prepareTask);

			if (listConfig.preProcessors) {
				for (i = 0; i < data.length; i++) {
					for (p = 0; p < listConfig.preProcessors.length; p++) {
						data[i] = listConfig.preProcessors[p](data[i]);
					}
				}
			}

			return data;
		}

		function getTaskList() {
			var request = groupTaskListRequest;

			return $http(request).then(function (response) {
				service.taskCount = response.data.length;
				service.task.listSeal = Math.random();
				var state = platformModuleStateService.state('basics.workflowTask');
				state.mainEntities = response.data;
				return response.data;
			},
				function () {
					state.taskCount = 0;
					service.task.listSeal = Math.random();
				});
		}

		async function triggerInstantTasks(taskList) {
			var instantTasks = _.filter(taskList, function (item) {
				var workflowAction = _.find(basicsWorkflowClientActionService.getAllActions(), { Id: item.ActionId });
				if (_.isNil(workflowAction)) {
					return false;
				} else {
					return !_.isNil(workflowAction.IsInstant) ? workflowAction.IsInstant : false;
				}
			});
			// execute task and always continue workflow, no matter the result!
			for(const task of instantTasks) {
				//Asyncronously loads context for popup task.
				if (task && !task.IsContextLoaded) {
					task.Context = {};
					await basicsWorkflowUtilityService.loadContext(task);
				}
				service.prepareTask(task);
				// result is synchronous
				var taskResult = basicsWorkflowClientActionService.executeTask(task);
				task.Result = _.has(taskResult, 'result') ? taskResult.result : null;
				task.Context = _.has(taskResult, 'context') ? taskResult.context : null;
				service.continueWorkflow(task);
				// do not remove, because other getList request might recognize the task as new again!
				task.Status = 4;
			}
		}

		state.taskCount = 0;
		service.task.listSeal = 0;

		service.refreshTaskCount = function refreshTaskCount() {
			if (platformContextService.isSecureClientRolePresent) {
				return $http(taskCountRequest).then(function (response) {
					state.taskCount = response.data.RunningWorkflowActions;
					$rootScope.$emit('sidebar:notificationsAutoRefreshEvent', response.data.UnseenNotificationsCount);
					$rootScope.$emit('workflow:taskCountChanged', response.data.RunningWorkflowActions);
					return state.taskCount;
				});
			}
			return $q.resolve();
		};

		service.changeSelectedTask = function (newVal, oldVal) {
			if (newVal !== oldVal) {
				var state = platformModuleStateService.state('basics.workflowTask');
				state.selectedMainEntity = newVal;
				service.task.selectedTask = newVal;
			}
		};
		service.getTaskList = function (showGroupTask, isInit = false) {
			return getTaskList(showGroupTask).then( async function (response) {
				var selectedTask = service.getSelected();
				var taskList = response;
				var newTaskList = [];
				_.each(taskList, function (newTask) {
					var sameTask = _.find(service.task.list, { Id: newTask.Id });
					if (!sameTask) {
						newTaskList.push(newTask);
					}
				});
				_.each(service.task.list, function (oldTask) {
					if (oldTask && oldTask.Id) {
						var deletedTask = _.find(taskList, { Id: oldTask.Id });
						if (!deletedTask) {
							// remove task which are no longer in the server response
							_.remove(service.task.list, function (task) {
								return oldTask.Id === task.Id;
							});
						}
					}
				});

				// trigger instant tasks
				await triggerInstantTasks(newTaskList);

				var oldTaskList = [];
				_.each(service.task.list, function (item) {
					if (item.Status === 2) {
						oldTaskList.push(item.Id);
					}
				});
				for (var i = isInit ? 0 : 1; i < newTaskList.length; i++) {
					if (newTaskList[i].Status === 2) {
						oldTaskList.push(newTaskList[i].Id);
					}
				}
				service.task.taskIdList = oldTaskList;

				newTaskList = _.concat([], newTaskList, service.task.list);

				service.task.list = newTaskList;
				var state = platformModuleStateService.state('basics.workflowTask');
				state.mainEntities = service.task.list;
				if (selectedTask){
					service.changeSelectedTask(selectedTask);
				}
				return service.task.list;
			});
		};

		service.getTaskListByFilter = function (filterRequest) {
			if (!_.isArray(filterRequest.furtherFilters)) {
				filterRequest.furtherFilters = [];
			}
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/workflow/runningworkflowaction/all/list/byfilter',
				data: filterRequest
			}).then(function (response) {
				service.taskListForModule = response.data.dtos;
				// service.task.list = response.data.dtos;
				var state = platformModuleStateService.state('basics.workflowTask');
				state.mainEntities = service.taskListForModule;
				if (_.isFunction(service.updateCallbackFn)) {
					service.updateCallbackFn();
				}
				return response.data;
			});
		};

		service.getTaskById = function getTaskById(id) {
			var request = angular.copy(getTaskByIdRequest);
			request.params = { id: id };

			return $http(request).then(function (response) {
				return service.prepareTask(response.data);
			});
		};

		service.updateListConfig = function (listConfig, list) {
			var result = [];
			if (list) {
				var tempList = list.concat([]);
				result = selectData(groupData(sortData(filterData(prepareData(tempList, listConfig), listConfig), listConfig), listConfig), listConfig);
			}
			return result;
		};

		service.saveSelectedTask = function () {
			var taskState = platformModuleStateService.state('basics.workflowTask');
			var promiseList = [];
			_.each(taskState.dirtyItems, function (item) {
				promiseList.push(service.saveTask(item));
			});
			return $q.all(promiseList).then(function () {
				taskState.dirtyItems = [];
			});
		};

		service.saveTask = function (task) {
			var temp = {};
			temp.Id = task.Id;
			temp.UserDefined1 = task.UserDefined1;
			temp.UserDefined2 = task.UserDefined2;
			temp.UserDefined3 = task.UserDefined3;
			temp.UserDefined4 = task.UserDefined4;
			temp.UserDefined5 = task.UserDefined5;
			temp.Context = angular.toJson(task.Context);

			saveTaskRequest.data = temp;
			return $http(saveTaskRequest).then(function () {
				return temp;
			});
		};

		service.changeUser = function (taskId, userId) {
			changeUserRequest.data = {
				Id: taskId,
				UserId: userId
			};
			return $http(changeUserRequest);
		};

		service.changeProgressedByUser = function (taskId, userId) {
			changeProgressedByUserRequest.data = {
				Id: taskId,
				UserId: userId
			};
			return $http(changeProgressedByUserRequest);
		};

		function addModuleNameToJsonContext(jsonContext) {
			var context = !jsonContext ? {} : JSON.parse(jsonContext);
			context.currentModuleName = basicsWorkflowModuleUtilService.getCurrentModule($state.current);
			return JSON.stringify(context);
		}


		service.startWorkflow = function (id, entityIdOrIdent, jsonContext, suppressPopup) {
			jsonContext = addModuleNameToJsonContext(jsonContext);
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/start',
					data: {
						TemplateId: id,
						EntityId: _.isObject(entityIdOrIdent) ? null : entityIdOrIdent,
						JsonContext: jsonContext,
						Identification: _.isObject(entityIdOrIdent) ? entityIdOrIdent : null
					}
				}
			).then(function (response) {
				return workflowCallback(response, suppressPopup);
			});
		};

		service.startWorkflowByEvent = function (uuid, entityIdOrIdent, jsonContext, suppressPopup) {
			jsonContext = addModuleNameToJsonContext(jsonContext);
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/startbyevent',
					data: {
						UUID: uuid,
						EntityId: _.isObject(entityIdOrIdent) ? null : entityIdOrIdent,
						Context: jsonContext,
						Identification: _.isObject(entityIdOrIdent) ? entityIdOrIdent : null
					}
				}
			).then(function (response) {
				return workflowCallback(response, suppressPopup);
			});
		};

		service.startWorkflowBulk = function (id, entityIdsOrIdents, jsonContext) {

			jsonContext = addModuleNameToJsonContext(jsonContext);
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/startbulk',
					data: {
						TemplateId: id,
						EntityIds: _.isObject(entityIdsOrIdents) && _.isObject(entityIdsOrIdents[0]) ? [] : entityIdsOrIdents,
						JsonContext: jsonContext,
						Identification:_.isObject(entityIdsOrIdents) && _.isObject(entityIdsOrIdents[0]) ? entityIdsOrIdents : []
					}
				}
			).then(function (response) {
				return response;
				}
			);
		};

		service.startWorkflowDifferentContext = function (id, entityId, jsonContextList, suppressPopup) {
			_.forEach(jsonContextList, function (jsonContext) {
				jsonContext = addModuleNameToJsonContext(jsonContext);
			});

			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/startWorkflowDifferentContext',
					data: {TemplateId: id, EntityId: entityId, JsonContextList: jsonContextList}
				}
			).then(function (response) {
				return workflowCallback(response, suppressPopup);
			});
		};

		function workflowCallback(response) {
			var wfInstance = _.isArray(response.data.Result) ? response.data.Result[0] : response.data;
			if (wfInstance) {
				wfInstance.StatusName = instanceStatus.getStatusById(wfInstance.Status);

				var context;
				switch (wfInstance.Status) {
					case basicsWorkflowInstanceStatus.failed:
					case basicsWorkflowInstanceStatus.escalate:
						context = angular.fromJson(wfInstance.Context);
						if (context.Exception) {
							wfInstance.errorMessage = context.Exception.Message;
						}
						break;
					case basicsWorkflowInstanceStatus.validationError:
						context = angular.fromJson(wfInstance.Context);
						if (context.ValidationException) {
							wfInstance.errorMessage = context.ValidationException.Message;
						}
						break;
					case basicsWorkflowInstanceStatus.finished:
					case basicsWorkflowInstanceStatus.waiting:
						_.forEach(workflowCallbackListener, function (item) {
							item(wfInstance);
						});
						break;
				}
			}
			return wfInstance;
		}

		service.continueWorkflow = function (task, callback) {
			var data = {};
			angular.copy(task, data);

			if (!angular.isString(data.Context)) {
				data.Context = angular.toJson(data.Context);
			}
			if (!angular.isString(data.Output)) {
				data.Output = angular.toJson(data.Output);
			}
			if (!angular.isString(data.Input)) {
				data.Input = angular.toJson(data.Input);
			}

			// TODO HZH if in net core data.Clerk is string, dto will transfer failed, return an error.
			var clerk = data.Clerk;
			if (angular.isString(clerk)) {
				data.Clerk = {
					Code: clerk,
					Description: clerk
				};
			}

			continueTaskRequest.data = data;

			return $http(continueTaskRequest).then(callback ? callback : workflowCallback);
		};

		service.stopWorkflow = function (instanceId) {
			stopTaskRequest.params = { instanceId: instanceId };
			return $http(stopTaskRequest).then(workflowCallback);
		};

		service.escalateTask = function (id) {
			escalateTaskRequest.params = { ActionId: id };
			return $http(escalateTaskRequest).then(function (result) {
				_.forEach(workflowCallbackListener, function (callback) {
					callback(result.data);
				});
				service.refreshTaskModuleList();
			});
		};

		service.escalateTaskInBulk = function escalateTaskInBulk(taskList) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/workflow/instance/escalatebyactioninbulk',
				data: taskList
			}).then(function (wfInstance) {
				_.forEach(workflowCallbackListener, function (callback) {
					callback(wfInstance);
				});
				return $injector.get('basicsWorkflowUIService').removeItemAndRefreshList('basics.workflowTask');
			});
		};

		service.continueWorkflowByActionInBulk = function continueWorkflowByActionInBulk(taskList) {
			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/workflow/instance/continueworkflowbyactioninbulk',
				data: taskList
			}).then(function (wfInstance) {
				_.forEach(workflowCallbackListener, function (callback) {
					callback(wfInstance);
				});
				return $injector.get('basicsWorkflowUIService').removeItemAndRefreshList('basics.workflowTask');
			});
		};

		service.getParamFromInput = function (task, param) {
			var inputParam = _.find(task.Input, { key: param });
			if (inputParam) {
				return inputParam.value;
			}
			return undefined;
		};

		service.getInfosForEntityEndpoint = function (worflowInstanceId) {
			var request = {
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/endpointinfo/callingentity',
				params: { workflowInstanceId: worflowInstanceId }
			};

			return $http(request);
		};

		service.getEntityInfo = function (id, moduleName) {
			var request = {
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/instance/entityinfo',
				params: { id: id, moduleName: moduleName }
			};

			return $http(request);
		};

		service.registerWorkflowCallback = function (fn) {
			workflowCallbackListener.push(fn);
		};
		service.unregisterWorkflowCallback = function (fn) {
			_.remove(workflowCallbackListener, function (item) {
				return item === fn;
			});
		};

		service.getUserPreferedListConfig = function getUserPreferedListConfig() {
			var getToDoListSetting = {
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/workflow/todotaskbar/gettodolistconfig',
				headers: { errorDialog: false }
			};
			return $http(getToDoListSetting).then(function (response) {
				return response.data;
			});
		};

		service.todoSettings = {};

		service.saveUserPreferedListConfig = function saveSelectedTodoListSetting(todoSettings) {
			service.todoSettings = todoSettings;
			service.updateViewEvent.fire(todoSettings);
			var saveToDoListSetting = {
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/workflow/todotaskbar/savetodolistconfig',
				data: todoSettings,
				headers: { errorDialog: false }
			};
			return $http(saveToDoListSetting).then(function (response) {
				return response.data;
			});
		};

		service.getSelected = function () {
			var state = platformModuleStateService.state(basicsWorkflowModuleUtilService.getCurrentModule($state.current));
			return state.selectedMainEntity;
		};

		service.registerSelectionChanged = function (callback) {
			service.selectionChanged.register(callback);
		};

		service.unregisterSelectionChanged = function (callback) {
			service.selectionChanged.unregister(callback);
		};

		service.registerUpdateDataExtensionEvent = function (callback) {
			service.updateDataExtensionEvent.register(callback);
		};

		service.unregisterUpdateDataExtensionEvent = function (callback) {
			service.updateDataExtensionEvent.unregister(callback);
		};

		service.registerUpdateViewEvent = function (callback) {
			service.updateViewEvent.register(callback);
		};

		service.unregisterUpdateViewEvent = function (callback) {
			service.updateViewEvent.unregister(callback);
		};

		service.refreshTaskModuleList = function refreshTaskModuleList() {
			var filter = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(filter);
			service.getTaskListByFilter(filter);
		};

		/**
		 * @ngdoc function
		 * @name reassignTaskOwner
		 * @methodOf basicsWorkflowInstanceService
		 * @description Reassign task to another clerk
		 * @returns { Boolean }
		 */
		service.reassignTaskOwner = function reassignTaskOwner(actionInstanceId, clerkId, closeDialog) {
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/reassigntaskowner',
					params: { actionInstanceId: actionInstanceId, clerkId: clerkId }
				}
			).then((result) => {
				if (result.data) {
					if (angular.isFunction(closeDialog)) {
						closeDialog(false);
					}
				}
			});
		};

		/**
		 * @ngdoc function
		 * @name assignTaskOwner
		 * @methodOf basicsWorkflowInstanceService
		 * @description used to assign task to a clerk
		 * @returns { Boolean }
		 */
		service.createNewTaskForClerk = function createNewTaskForClerk(selectedItem, clerkId, closeDialog) {

			let callingInstanceId = selectedItem.workflowInstanceId;
			return $http(
				{
					method: 'POST',
					url: globals.webApiBaseUrl + 'basics/workflow/instance/createnewtaskforclerk',
					params: {
						clerkId: clerkId,
						callingInstanceId: callingInstanceId,
						returnToSender: selectedItem.returnToSender
					}
				}
			).then((result) => {
				if (result.data) {
					if (angular.isFunction(closeDialog)) {
						closeDialog(false);
					}
				}
			});
		};

		return service;
	}

	angular.module(moduleName)
		.factory('basicsWorkflowInstanceService', ['globals', '$http', '_', '$interval', '$injector', 'basicsWorkflowClientActionService',
			'basicsWorkflowInstanceStatus', 'platformModuleStateService', 'basicsWorkflowDtoService',
			'$window', 'platformUserInfoService', '$q', '$rootScope', 'basicsWorkflowModuleUtilService', '$state', 'cloudDesktopSidebarService', 'basicsWorkflowActionInstanceStatusService', 'BasicsCommonDateProcessor', 'platformContextService',
			'basicsWorkflowUtilityService', workflowInstanceService])
		.constant('basicsWorkflowInstanceStatus', instanceStatus)
		.factory('basicsWorkflowInstanceStatusArray', ['platformTranslateService', function (platformTranslateService) {
			var service = {};
			var statusList = [
				'basics.workflowAdministration.instance.status.none',
				'basics.workflowAdministration.instance.status.running',
				'basics.workflowAdministration.instance.status.finished',
				'basics.workflowAdministration.instance.status.escalate',
				'basics.workflowAdministration.instance.status.waiting',
				'basics.workflowAdministration.instance.status.failed',
				'basics.workflowAdministration.instance.status.killed',
				'basics.workflowAdministration.instance.status.validationError'
			];
			var statusListTranslated = null;

			service.getByIndex = function (index) {
				return platformTranslateService.instant(statusList[index], null, true);
			};
			service.getList = function () {
				if (statusListTranslated === null) {
					for (var i = 0; i < statusList.length; i++) {
						statusListTranslated.push(platformTranslateService.instant(statusList[i], null, true));
					}
				}
				return statusListTranslated;
			};
			return service;
		}]).factory('basicsWorkflowActionInstanceStatusService', ['platformTranslateService', '_', function (platformTranslateService, _) {

			var service = {
				'basics.workflow.action.status.started': 1,
				'basics.workflow.action.status.running': 2,
				'basics.workflow.action.status.failed': 3,
				'basics.workflow.action.status.finished': 4,
				'basics.workflow.action.status.validationError': 5,
				getStatusById: function (id) {
					for (var key in service) {
						// eslint-disable-next-line no-prototype-builtins
						if (service.hasOwnProperty(key) && angular.isNumber(service[key]) && service[key] === id) {
							return _.get(platformTranslateService.instant(key), key);
						}
					}
				}
			};

			return service;
		}]);
})(angular);
