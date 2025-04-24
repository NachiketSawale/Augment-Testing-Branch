/* global angular */
(function (angular) {
	'use strict';

	function utilityService(_, $http, platformUserInfoService) {
		var service = {};

		var lastUserInputModuleName = 'Last User Input';

		service.configurableFilterFnFactory = function (properties, value) {
			return function (item) {
				for (var p = 0; p < properties.length; p++) {
					if (item[properties[p]] && item[properties[p]].toUpperCase().indexOf(value.toUpperCase()) >= 0) {
						return true;
					}
				}
				return false;
			};

		};

		service.addSimpleListFn = function (ctrl, listProperty, hooks) {
			var result = {};
			result.switchListDetail = async function (id) {
				saveOrDeleteLastUserInput(!ctrl.detail, id);
				ctrl.version++;
				ctrl.list = !ctrl.list;
				ctrl.detail = !ctrl.detail;
				ctrl.detailConfig.selectedIndex = _.findIndex(ctrl[listProperty], {Id: id});
				ctrl.selectedItem = ctrl[listProperty][ctrl.detailConfig.selectedIndex];

				if (ctrl?.selectedItem?.Action?.directive === undefined) {
					await service.loadContext(ctrl.selectedItem);
				}

				if (hooks) {
					if (angular.isFunction(hooks.switchListDetailHook)) {
						hooks.switchListDetailHook();
					}
				}
			};

			result.previousTask = function () {
				ctrl.version++;
				if (ctrl.detailConfig.selectedIndex > 0) {
					ctrl.detailConfig.selectedIndex = ctrl.detailConfig.selectedIndex - 1;
					ctrl.selectedItem = ctrl[listProperty][ctrl.detailConfig.selectedIndex];
				} else {
					ctrl.detailConfig.selectedIndex = ctrl[listProperty].length - 1;
					ctrl.selectedItem = ctrl[listProperty][ctrl.detailConfig.selectedIndex];
				}
				if (hooks) {
					if (angular.isFunction(hooks.previousTaskHook)) {
						hooks.previousTaskHook();
					}
				}

			};
			result.nextTask = function () {
				ctrl.version++;
				if (ctrl.detailConfig.selectedIndex + 1 < ctrl[listProperty].length) {
					ctrl.detailConfig.selectedIndex = ctrl.detailConfig.selectedIndex + 1;
					ctrl.selectedItem = ctrl[listProperty][ctrl.detailConfig.selectedIndex];
				} else {
					ctrl.detailConfig.selectedIndex = 0;
					ctrl.selectedItem = ctrl[listProperty][ctrl.detailConfig.selectedIndex];
				}
				if (hooks) {
					if (angular.isFunction(hooks.switchListDetailHook)) {
						hooks.switchListDetailHook();
					}
				}

			};
			return result;
		};

		/**
		 * Asyncronously loads context for the task if the context isn't already available.
		 * @param {*} item
		 * @returns void
		 */
		service.loadContext = async function loadContext(item) {
			if (item && !item.IsContextLoaded && item.ActionId) {
				var params = {
					params: { actionInstanceId: item.Id }
				};

				var response = await $http.get(
					globals.webApiBaseUrl + 'basics/workflow/actioninstance/loadContextForTask',
					params
				);

				if (response && response.data) {
					updateContext(response, item);
					addItemsFromContext(response, item);
					item.IsContextLoaded = true;
				}
			}
		}

		function parseContext(context) {
			context = context === '' ? {} : JSON.parse(context);
			if(typeof context === 'string') {
				return parseContext(context);
			}
			return context;
		}

		/**
		 * Updates context object of the current selected task in the sidebar.
		 * @param {*} response
		 * @param {*} item
		 */
		function updateContext(response, item) {
			if(response.data.Context) {
				const context = parseContext(response.data.Context);
				const contextKeys = Object.keys(context);
				if(contextKeys && contextKeys.length > 0) {
					contextKeys.forEach((contextKey)=>{
						item.Context[contextKey] = context[contextKey];
					});
				}
			}
		}

		/**
		 * Updates current selected task in the sidebar with additional properties.
		 * @param {*} response
		 * @param {*} item
		 */
		function addItemsFromContext(response, item) {
			var keys = Object.keys(response.data).filter(key => key.toLowerCase() !== 'context');
			if (keys && keys.length > 0) {
				keys.forEach((key) => {
					item[key] = response.data[key];
				});
			}
		}

		//operType: true  -> save, detail show,
		//          false -> delete, list show
		function saveOrDeleteLastUserInput(operType, actionInstanceId) {
			var userId = platformUserInfoService.getCurrentUserInfo().UserId;
			var params = {};
			params.moduleName = lastUserInputModuleName;
			params.filterName = 'last.user.input';
			params.accessLevel = 'User';
			switch (operType) {
				case true:
					params.id = 0;
					var filterDef = {
						actionInstanceId: actionInstanceId,
						userId: userId
					};
					params.filterDef = JSON.stringify(filterDef);
					saveLastUserInput(params);
					break;
				case false:
					deleteLastUserInput(params);
					break;
			}
		}

		function saveLastUserInput(params) {
			$http.post(
				globals.webApiBaseUrl + 'basics/workflow/filter/savefilterdefinition',
				params
			).then(function () {
				},
				function (error) {
					console.log('saveFilterDefinition failed ', error);
				});
		}

		function deleteLastUserInput(params) {
			$http.post(
				globals.webApiBaseUrl + 'basics/workflow/filter/deletefilterdefinition',
				params
			);
		}

		service.getLastUserInput = function () {
			var params = {
				params: {moduleName: lastUserInputModuleName}
			};
			var requestPromise = $http.get(
				globals.webApiBaseUrl + 'basics/workflow/filter/getfilterdefinitions',
				params
			).then(function (response) {
				return response;
			});
			return requestPromise;
		};

		service.addGroupedListFn = function (ctrl, listProperty, hooks) {
			var result = {};
			result.switchListDetail = async function (id) {
				saveOrDeleteLastUserInput(!ctrl.detail, id);

				ctrl.list = ctrl.detail;
				ctrl.detail = !ctrl.detail;
				for (var i = 0; i < ctrl[listProperty].length; i++) {
					ctrl.detailConfig.selectedIndex = _.findIndex(ctrl[listProperty][i].childs, {id: id});
					if (ctrl.detailConfig.selectedIndex >= 0) {
						ctrl.selectedGroup = i;
						break;
					}
				}

				ctrl.selectedItem = ctrl[listProperty][ctrl.selectedGroup].childs[ctrl.detailConfig.selectedIndex];

				if (ctrl?.selectedItem?.Action?.directive === undefined) {
					await service.loadContext(ctrl.selectedItem);
				}

				if (hooks) {
					if (angular.isFunction(hooks.nextTaskHook)) {
						hooks.nextTaskHook();
					}
				}

			};

			result.previousTask = function () {
				if (ctrl.detailConfig.selectedIndex > 0) {
					ctrl.detailConfig.selectedIndex = ctrl.detailConfig.selectedIndex - 1;
					ctrl.selectedItem = ctrl[listProperty][ctrl.selectedGroup].childs[ctrl.detailConfig.selectedIndex];
				} else {
					ctrl.detailConfig.selectedIndex = ctrl[listProperty][ctrl.selectedGroup].childs.length - 1;
					ctrl.selectedItem = ctrl[listProperty][ctrl.selectedGroup].childs[ctrl.detailConfig.selectedIndex];
				}

			};
			result.nextTask = function () {
				if (ctrl.detailConfig.selectedIndex + 1 < ctrl[listProperty][ctrl.selectedGroup].childs.length) {
					ctrl.detailConfig.selectedIndex = ctrl.detailConfig.selectedIndex + 1;
					ctrl.selectedItem = ctrl[listProperty][ctrl.selectedGroup].childs[ctrl.detailConfig.selectedIndex];
				} else {
					ctrl.detailConfig.selectedIndex = 0;
					ctrl.selectedItem = ctrl[listProperty][ctrl.selectedGroup].childs[ctrl.detailConfig.selectedIndex];
				}

			};
			return result;
		};

		service.getFromObjectDeep = function (obj, propPath) {
			var path = propPath.split('.');
			var current = obj;

			for (var i = 0; i < path.length; i++) {

				if (!current) {
					current = {};
				} else if (typeof current !== 'object') {
					return undefined;
				}

				if (!current.hasOwnProperty(path[i])) {

					if (i === path.length - 1) {
						current[path[i]] = null;
					} else {
						current[path[i]] = {};
					}
				}

				current = current[path[i]];
			}

			return current;
		};

		service.setObjectDeep = function (obj, propPath, value, ignoreFirst) {
			var path = propPath.split('.');
			var current = obj;

			for (var i = ignoreFirst ? 1 : 0; i < path.length; i++) {

				if (!current) {
					current = {};
				}

				if (!current.hasOwnProperty(path[i])) {

					if (i === path.length - 1) {
						current[path[i]] = value;
					} else {
						current[path[i]] = {};
					}
				}

				current = current[path[i]];
			}
		};

		service.forEachAction = function forEachAction(rootAction, fn) {
			fn(rootAction);
			if (!angular.isArray(rootAction.transitions)) {
				return;
			}
			for (var i = 0; i < rootAction.transitions.length; i++) {
				forEachAction(rootAction.transitions[i].workflowAction, fn);
			}
		};

		service.forEachElement = function forEachElement(rootAction, fn) {
			fn(rootAction);
			if (!angular.isArray(rootAction.transitions)) {
				return;
			}
			for (var i = 0; i < rootAction.transitions.length; i++) {
				fn(rootAction.transitions[i]);
				forEachElement(rootAction.transitions[i].workflowAction, fn);
			}
		};

		/**
		 * Sets default values in the dropdown for user decision and user decision ex task.
		 * @param {*} task
		 */
		service.setDefaultValuesForUserDecision = function setDefaultValuesForUserDecision(task) {
			if(task.input && task.input[0] && task.input[0].value) {
				const input = angular.fromJson(task.input[0].value);
				if(input && input[0] && input[0].options && input[0].options.items && input[0].options.items[0] && input[0].options.items[0].id) {
					task.Context.Result = input[0].options.items[0].id;
				}
			}
		};

		function getEntityIdListForActionInstances(actionInstanceIds) {
			return $http.post(
				globals.webApiBaseUrl + 'basics/workflow/actionInstance/getEntityIds',
				actionInstanceIds
			).then(response => {
				return response.data;
			});
		}

		/**
		 *
		 * @param {*} actionInstanceIds
		 * @returns
		 */
		service.setEntityIdListForActionInstances = async function setEntityIdListForActionInstances(tasks) {
			const items = tasks.filter(item => item.isEntityListLoaded === undefined || !item.isEntityListLoaded)?.map((item)=>item.id);
			if(items === undefined || (items && items.length === 0)) {
				return;
			}
			const actionInstanceEntityIdMap = await getEntityIdListForActionInstances(items);
			if(actionInstanceEntityIdMap) {
				tasks.filter(task => items.find(item => item === task.id)).forEach(task => {
					task['EntityIdList'] = actionInstanceEntityIdMap[task.id] !== undefined ? actionInstanceEntityIdMap[task.id] : [];
					task.isEntityListLoaded = true;
				});
			}
		};

		return service;
	}

	angular.module('basics.workflow').factory('basicsWorkflowUtilityService', ['_', '$http', 'platformUserInfoService', utilityService]);
})(angular);
