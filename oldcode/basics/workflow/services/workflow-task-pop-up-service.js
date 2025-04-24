(function (angular) {
	'use strict';

	var intervalShort = 2000;

	function basicsWorkflowTaskPopUpService($interval, $window, _, basicsWorkflowInstanceService, basicsWorkflowClientActionService, basicsWorkflowModuleUtilService, platformUserInfoService, basicsCommonChangeStatusService, basicsWorkflowUtilityService, $rootScope) {
		var service = {};
		var interval = null;
		var popUpActive = false;
		var running = false;
		let currentOpenedTask;

		var nsListKey = 'fdec1d3fd4f4252be4d74e68589aa1f1';
		var currentOpenedTaskIdListKey = '12dcbbea81484c8c89c943cdc572efb5';

		function getFromLocalStorage(key) {
			var list;
			try {
				list = JSON.parse(localStorage.getItem(key));
			} catch (ex) {
				// handle parse error
				list = [];
			}
			// handle empty result
			if (!_.isArray(list)) {
				list = [];
			}
			return list;
		}

		function addToList(item, key) {
			var list = getFromLocalStorage(key);
			if (!_.includes(list, item)) {
				// keep only 1000 entries
				list = list.slice(-1000);
				list.push(item);
				localStorage.setItem(key, JSON.stringify(list));
			}
		}

		function isInList(item, key) {
			return _.includes(getFromLocalStorage(key), item);
		}

		function addToNotShowList(id) {
			addToList(id, getUserStorageKeyForNotShowList());
		}

		function addToCurrentOpenedTaskIdList(id) {
			addToList(id, getUserStorageKeyForCurrentOpenedTaskIdList());
		}

		function removeFromTaskList(id) {
			_.remove(basicsWorkflowInstanceService.task.list, function (item) {
				return item.Id === id;
			});
			basicsWorkflowInstanceService.task.listSeal = null;
		}

		function removeFromNotShowList(id) {
			var storageKey = getUserStorageKeyForNotShowList();
			var list = getFromLocalStorage(storageKey);
			_.remove(list, function (item) {
				return item === id;
			});
			localStorage.setItem(storageKey, JSON.stringify(list));
		}

		function removeFromCurrentOpenedTaskIdList(id) {
			var storageKey = getUserStorageKeyForCurrentOpenedTaskIdList();
			var list = getFromLocalStorage(storageKey);
			_.remove(list, function (item) {
				return item === id;
			});
			localStorage.setItem(storageKey, JSON.stringify(list));
		}

		function getUserStorageKeyForNotShowList() {
			return nsListKey + platformUserInfoService.getCurrentUserInfo().UserId;
		}

		function getUserStorageKeyForCurrentOpenedTaskIdList() {
			return currentOpenedTaskIdListKey + platformUserInfoService.getCurrentUserInfo().UserId;
		}

		function isInNotShowList(id) {
			return isInList(id, getUserStorageKeyForNotShowList());
		}

		function isInCurrentOpenedTaskIdList(id) {
			return isInList(id, getUserStorageKeyForCurrentOpenedTaskIdList());
		}

		function isDeleted(id) {
			return !_.find(basicsWorkflowInstanceService.task.list, {Id: id});
		}

		service.removeFromNotShowList = removeFromNotShowList;

		service.openAsPopUp = async function openAsPopUp(task, closeFn) {
			service.stop();

			//Asyncronously loads context for popup task.
			if (task && !task.IsContextLoaded) {
				task.Context = {};
				await basicsWorkflowUtilityService.loadContext(task);
			}

			basicsWorkflowInstanceService.prepareTask(task);
			popUpActive = true;
			currentOpenedTask = task;
			addToCurrentOpenedTaskIdList(task.Id);

			basicsWorkflowClientActionService.executeTask(task, closeFn)
				.then(function (diagResult) {
					closePopUp(diagResult, task);
				}, function () {
					service.start();
				});

		};

		function closePopUp(diagResult, task) {
			removeFromTaskList(task.Id);
			popUpActive = false;
			if (diagResult && !diagResult.cancel) {
				removeFromNotShowList(task.Id);
				if (diagResult.actionEvent) {
					switch (diagResult.actionEvent) {
						case basicsWorkflowClientActionService.actionEvent.stop :
							basicsWorkflowInstanceService.stopWorkflow(task.WorkflowInstanceId).then(function () {
								if (angular.isFunction(basicsWorkflowModuleUtilService.refreshSelected)) {
									basicsWorkflowModuleUtilService.refreshSelected();
								}
							});
							break;
					}
				} else {
					if (diagResult.data) {
						var context = diagResult.data.context;
						task.Result = diagResult.data.result;
						if (diagResult.data.task && diagResult.data.task.Action && diagResult.data.task.Action.Description) {
							var actionButtonName = _.replace(diagResult.data.task.Action.Description, /\s/g, '');
							actionButtonName += 'ButtonResult';
							if (!context) {
								context = {};
							}
							if (!_.isString(context)) {
								context[actionButtonName] = task.Result;
							}
						}
						task.Context = context;
					}
					basicsWorkflowInstanceService.continueWorkflow(task).then(function () {
						if (angular.isFunction(basicsWorkflowModuleUtilService.refreshSelected)) {
							basicsWorkflowModuleUtilService.refreshSelected();
						}
					});
				}
			} else {
				addToNotShowList(task.Id);
				service.start();
			}
			currentOpenedTask = null;
			removeFromCurrentOpenedTaskIdList(task.Id);
		}

		$rootScope.$on('modelDialog.escPress', function (result) {
			closePopUp(result, currentOpenedTask);
		});

		function setTaskListInStorage() {
			var taskListInStorage = getFromLocalStorage(getUserStorageKeyForNotShowList());
			_.forEach(basicsWorkflowInstanceService.task.taskIdList, function (item) {
				if (!_.includes(taskListInStorage, item)) {
					addToNotShowList(item);
				}
			});
		}

		service.makePopUp = function makePopUp(taskList) {
			if (_.isArray(taskList) && !_.isEmpty(taskList)) {
				setTaskListInStorage();
				var tasksWithPopUp = _.filter(taskList, function (item) {

					if (item && !item.IsPopup) {
						return false;
					}

					//Show only popups that aren't dismissed already
					return !isInNotShowList(item.Id) && item.Status === 2;
				});

				_.forEach(tasksWithPopUp, function (popUp) {
					popUp.pendingToOpen = true;
				});

				if (!popUpActive) {
					var popUp = _.find(tasksWithPopUp, function (task) {
						return !isInCurrentOpenedTaskIdList(task.Id);
					});

					if (popUp && !(isInNotShowList(popUp.Id) || isDeleted(popUp.Id))) {
						var closeFnFactory = function (id) {
							return function () {
								return isDeleted(id) || (isInNotShowList(id) && currentOpenedTask.Id !== id);
							};
						};
						service.openAsPopUp(popUp, closeFnFactory(popUp.Id));
					}
				} else {
					_.forEach(taskList, function (item) {
						if (item.pendingToOpen) {
							removeFromNotShowList(item.Id);
						}
					});
				}
			}
		};

		function popUpInterval() {
			basicsWorkflowInstanceService.getTaskList(basicsWorkflowInstanceService.task.showGroupTask)
				.then(service.makePopUp);
		}

		function popUpIntervalShort() {
			service.makePopUp(basicsWorkflowInstanceService.task.list);
		}

		function statusChangeInterval(scope, hasConfiguredWorkflows) {
			if (!popUpActive && hasConfiguredWorkflows) {
				interval = $interval(function () {
					popUpInterval({}, hasConfiguredWorkflows);
				}, intervalShort, 6);
			}
		}

		service.init = function () {
			basicsWorkflowInstanceService.getTaskList(basicsWorkflowInstanceService.task.showGroupTask, true);
			basicsWorkflowInstanceService.registerWorkflowCallback(popUpInterval);
			basicsCommonChangeStatusService.onStatusChanged.register(statusChangeInterval);
			service.start();
		};

		service.start = function () {
			if (!running) {
				running = true;
				$interval(popUpIntervalShort, intervalShort, 3);
			}
		};

		service.stop = function () {
			running = false;
		};

		return service;
	}

	angular.module('basics.workflow')
		.factory('basicsWorkflowTaskPopUpService', ['$interval', '$window', '_', 'basicsWorkflowInstanceService', 'basicsWorkflowClientActionService', 'basicsWorkflowModuleUtilService', 'platformUserInfoService', 'basicsCommonChangeStatusService', 'basicsWorkflowUtilityService', '$rootScope', basicsWorkflowTaskPopUpService])
		.run(['$rootScope', 'platformIsPreInitState', 'basicsWorkflowTaskPopUpService', 'tokenAuthentication', function ($rootScope, platformIsPreInitState, basicsWorkflowTaskPopUpService, tokenAuthentication) {
			var unregisterDelegate = $rootScope.$on('$stateChangeSuccess', function () {
				var stateName = arguments[1].name;
				if (!platformIsPreInitState(stateName) && tokenAuthentication.isloggedIn()) {
					unregisterDelegate();
					basicsWorkflowTaskPopUpService.init();
				}
			});
		}]);

})(angular);
