(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'basics.workflow';

	/* jshint -W072 */
	function TaskSidebarCtrl(_, basicsWorkflowInstanceService, $templateCache, $state, basicsWorkflowPreProcessorService,
		basicsWorkflowUtilityService, basicsWorkflowTaskListGroupingOptions,
		basicsWorkflowTaskListSortingOptions, cloudDesktopSidebarService, $scope,
		platformModuleStateService, platformTranslateService, $q,
		basicsWorkflowMasterDataService, basicsWorkflowTaskUiService, $interval, basicsWorkflowTaskPopUpService,
		basicsWorkflowModuleUtilService, basicsWorkflowGroupSettingEfilterService, platformUserInfoService, $translate, $timeout,
		platformContextService, cloudDesktopCompanyService) {
		var ctrl = this;
		var listProperty = 'taskList';
		var state = platformModuleStateService.state(moduleName);
		var optionsHook = function () {
			if (ctrl.selectedItem) {

				ctrl.transition.options.items = ctrl.selectedItem.options;
				basicsWorkflowInstanceService.task.selectedTask = ctrl.selectedItem;
				buildTooltipCaptions();

				if (ctrl.selectedItem.input !== undefined) {
					allowReassignGeneric(ctrl.selectedItem);
				}

			} else {
				basicsWorkflowInstanceService.task.selectedTask = null;
			}
		};

		function allowReassignGeneric(task) {

			//Preparing input properties
			if (!task.taskPrepared) {
				task = basicsWorkflowInstanceService.prepareTask(task);
				task.taskPrepared = true;
			}

			//Code to check if the current task is a contract approval task.
			let isGenericWizard = task.input.filter(t => t.key.toLowerCase() === 'genericwizardinstanceid')[0];
			let isContractApproval = isGenericWizard !== undefined ? isGenericWizard.value === 2 : false;
			if (isContractApproval) {
				let isForwarded = task.Context.IsForwarded !== undefined ? task.Context.IsForwarded : false;
				task.allowNewTaskAssign = !isForwarded;
				task.createNewTaskForClerk = basicsWorkflowInstanceService.createNewTaskForClerk;
				task.returnToSender = false;
			}
		}

		$scope.isMainEntityFilter = false;
		$scope.isCompanyFilter = false;

		function buildTooltipCaptions() {
			let userDefinedDescriptions = '';
			let userDefinedMoneyDescriptions = '';
			let userDefinedDateDescriptions = '';
			let endDateDescription = '';
			let businessPartnerName = '';
			let clerkName = ctrl.selectedItem.ClerkFirstName + ' ' + ctrl.selectedItem.ClerkFamilyName;

			for (let i = 1; i < 6; i++) {
				let userDefined = 'UserDefined' + i;
				let userDefinedMoney = 'UserDefinedMoney' + i;
				let userDefinedDate = 'UserDefinedDate' + i;

				if (ctrl.selectedItem[userDefined] !== '') {
					userDefinedDescriptions += $translate.instant('basics.workflow.action.detail.userDefined' + i) + ': ' + ctrl.selectedItem[userDefined] + '<br>';
				}
				if (ctrl.selectedItem[userDefinedMoney]) {
					userDefinedMoneyDescriptions += $translate.instant('basics.workflow.action.detail.userDefinedMoney' + i) + ': ' + ctrl.selectedItem[userDefinedMoney] + '<br>';
				}
				if (ctrl.selectedItem[userDefinedDate]) {
					userDefinedDateDescriptions += $translate.instant('basics.workflow.action.detail.userDefinedDate' + i) + ': ' + ctrl.selectedItem[userDefinedDate] + '<br>';
				}
			}

			if (ctrl.selectedItem.EndDate) {
				endDateDescription = $translate.instant('basics.workflow.action.detail.endTime') + ': ' + ctrl.selectedItem.EndDate + '<br>';
			}
			if (ctrl.selectedItem.BusinesspartnerId) {
				businessPartnerName = $translate.instant('basics.workflow.action.detail.businessPartner') + ': ' +
					(ctrl.selectedItem.BusinesspartnerName1 || ctrl.selectedItem.BusinesspartnerName2 || ctrl.selectedItem.BusinesspartnerName3 || ctrl.selectedItem.BusinesspartnerName4) + '<br>';
			}
			if (!ctrl.selectedItem.ClerkFamilyName || !ctrl.selectedItem.ClerkFirstName) {
				clerkName = ctrl.selectedItem.Clerk;
				$scope.tooltipCaptionOptions =
					$translate.instant('basics.workflow.action.detail.description') + ': ' + ctrl.selectedItem.Description + '<br>' +
					$translate.instant('basics.workflow.action.detail.lifeTime') + ': ' + ctrl.selectedItem.Lifetime + '<br>' +
					$translate.instant('basics.workflow.action.detail.comment') + ': ' + ctrl.selectedItem.Comment + '<br>' + endDateDescription +
					$translate.instant('basics.workflow.action.detail.action') + ': ' + ctrl.selectedItem.Action.Description + '<br>' +
					$translate.instant('basics.workflow.action.detail.result') + ': ' + ctrl.selectedItem.Result + '<br>' +
					$translate.instant('basics.workflow.action.detail.ownerId') + ': ' + ctrl.selectedItem.OwnerId + '<br>' +
					$translate.instant('basics.workflow.action.detail.executeCondition') + ': ' + ctrl.selectedItem.ExecuteCondition + '<br>' +
					$translate.instant('basics.workflow.action.customEditor.clerk') + ': ' + clerkName + '<br>' +
					businessPartnerName +
					userDefinedDescriptions +
					userDefinedMoneyDescriptions +
					userDefinedDateDescriptions;
			}

			$scope.tooltipTitleOptions = $translate.instant('basics.workflow.action.detail.userTaskDetail');
			$timeout(function () {
				$scope.version = ctrl.version;
			});
		}

		var simpleListFnHooks = {
			switchListDetailHook: optionsHook,
			previousTaskHook: optionsHook,
			nextTaskHook: optionsHook
		};

		function loadData(listConfig) {
			ctrl.taskList = basicsWorkflowInstanceService.updateListConfig(listConfig, basicsWorkflowInstanceService.task.list);
			ctrl.taskListIsLoading = false;
		}

		function translateOptions(options) {
			_.each(options.items, function (item) {
				item.displayMember = platformTranslateService.instant(item.displayMember, null, true);
			});
		}

		// get the Total count of all Running Workflow Tasks
		$scope.totalRunningWorkflowTasksCount = function () {
			basicsWorkflowInstanceService.refreshTaskCount().then(function (count) {
				taskCountChanged($scope.totalRunningTasksCount, count);
				$scope.totalRunningTasksCount = count;
				return $scope.totalRunningTasksCount;
			});
		};

		// refresh Controller if task count changed
		function taskCountChanged(oldVal, newVal) {
			if (oldVal !== newVal) {
				ctrl.refresh();
			}
		}

		// define toolbar
		translateOptions(basicsWorkflowTaskListGroupingOptions.options);
		translateOptions(basicsWorkflowTaskListSortingOptions.options);

		// init scope
		ctrl.version = 0;
		ctrl.taskList = [];
		ctrl.taskListIsLoading = false;
		ctrl.itemTemplate = '';
		ctrl.state = '';
		ctrl.listConfig = {};
		ctrl.listConfig.filter = {};
		ctrl.listConfig.filter.value = '';
		ctrl.listConfig.grouping = {};
		ctrl.listConfig.grouping.value = '';
		ctrl.listConfig.preProcessors = [];
		ctrl.listConfig.sort = {};
		ctrl.listConfig.sort.value = '';
		ctrl.listConfig.mainEntityFilter = {};
		ctrl.listConfig.mainEntityFilter.isFilter = false;
		ctrl.listConfig.mainEntityFilter.fn = function (item) {
			var idArray = basicsWorkflowModuleUtilService.getCurrentSelectedList();
			var filterIds = _.filter(idArray, function (id) {
				return id && item.EntityIdList && item.EntityIdList.indexOf(id) > -1;
			});
			return filterIds.length > 0;
		};
		ctrl.listConfig.companyFilter = {};
		ctrl.listConfig.companyFilter.isFilter = false;
		ctrl.listConfig.companyFilter.fn = function (item) {
			return item.CompanyFk === platformContextService.signedInClientId;
		};
		ctrl.list = true;
		ctrl.showGroupTask = basicsWorkflowInstanceService.task.showGroupTask;
		ctrl.sorting = basicsWorkflowTaskListSortingOptions;
		ctrl.grouping = basicsWorkflowTaskListGroupingOptions;
		ctrl.itemTemplate = $templateCache.get('basics.workflow/taskItem.html');
		ctrl.groupTemplate = $templateCache.get('basics.workflow/groupItem.html');
		ctrl.detailConfig = {};
		ctrl.selectedGroup = 0;
		ctrl.selectedItem = null;
		ctrl.detailConfig.selectedIndex = 0;
		ctrl.labels = {};
		ctrl.detailFn = basicsWorkflowUtilityService.addSimpleListFn(ctrl, listProperty, simpleListFnHooks);
		ctrl.baseSprite = 'cloud.style/content/images/control-icons.svg#';
		basicsWorkflowTaskUiService.addProcessingFns(ctrl.detailFn, responseFn);
		basicsWorkflowTaskUiService.addNavigationFns(ctrl.detailFn, ctrl);

		$scope.onOk = function () {
			ctrl.detailFn.ok(ctrl.selectedItem);
		};
		$scope.onCancel = null;
		$scope.onBreak = function () {
			ctrl.detailFn.break(ctrl.selectedItem);
		};

		$scope.showAsDialog = function () {
			ctrl.selectedItem.isPopup = true;
			basicsWorkflowTaskPopUpService.openAsPopUp(ctrl.selectedItem);
			ctrl.detailFn.switchListDetail();
		};
		$scope.isModalDialog = false;
		$scope.isSidebar = true;

		function responseFn(response) {
			ctrl.selectedItem = basicsWorkflowInstanceService.prepareTask(response.data);
			ctrl.response = response.data;
			ctrl.selectedItem = processItem(ctrl.selectedItem);
			ctrl.refresh();
		}

		function processItem(item) {
			if (ctrl.listConfig.preProcessors) {
				_.each(ctrl.listConfig.preProcessors, function (processor) {
					processor(item);
				});
				return item;
			}
		}

		ctrl.transition = {};
		ctrl.transition.options = {
			valueMember: 'Id',
			items: [],
			displayMember: 'Parameter'
		};

		function addProcessors() {
			function prepareAddingPreProcessors() {
				if (!_.isEmpty(ctrl.listConfig.preProcessors)) {
					return;
				}
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.convertToMomentHandler('Started', 'StartedFormated', 'L LT'));
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.convertPrioToIcon('PriorityId', 'PrioIcon'));
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.convertLifeTimeToIcon('Endtime', 'Lifetime', 'lifeTimeIcon', platformTranslateService.instant('basics.workflow.task.list.grouping.ended', null, true)));
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.createGroupableDate('Endtime', 'EndDate', platformTranslateService.instant('basics.workflow.task.list.grouping.noEndDate', null, true)));
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.addEntityHeader);
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.addWrapper);
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.addCompanyName());
			}

			if (!globals.portal) {
				return basicsWorkflowMasterDataService.getCurrentClerk().then(function (currentClerk) {
					return cloudDesktopCompanyService.loadAssigedCompaniesToUser().then(function () {
						prepareAddingPreProcessors();
						if (currentClerk) {
							ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.addUserInfo(currentClerk.Id));
							ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.addProcessingStatus(currentClerk));
						}
					});
				});
			} else {
				prepareAddingPreProcessors();
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.addPortalUserInfo());
				ctrl.listConfig.preProcessors.push(basicsWorkflowPreProcessorService.addProcessingStatus());
				return $q.when();
			}
		}

		function setMainEntityClass(flag) {
			var curState = $state.current.name;
			if (flag) {
				if (ctrl.state !== curState) {
					ctrl.state = curState;
					$scope.isMainEntityFilter = false;
				}
			} else {
				$scope.isMainEntityFilter = !$scope.isMainEntityFilter;
			}
			ctrl.listConfig.mainEntityFilter.isFilter = $scope.isMainEntityFilter;
		}

		function setCompanyClass(flag) {
			var curState = $state.current.name;
			if (flag) {
				if (ctrl.state !== curState) {
					ctrl.state = curState;
					$scope.isCompanyFilter = false;
				}
			} else {
				$scope.isCompanyFilter = !$scope.isCompanyFilter;
			}
			ctrl.listConfig.companyFilter.isFilter = $scope.isCompanyFilter;
		}

		ctrl.clearSearch = function () {
			ctrl.listConfig.filter.value = '';
			ctrl.listConfig.isClear = true;
			ctrl.refresh();
		};

		ctrl.mainEntityFilter = async function () {
			//Setting spinner and disabling the filter icon
			ctrl.taskListIsLoading = true;
			ctrl.isFilterDisable = true;

			//Loading entity ids required for filter
			await basicsWorkflowUtilityService.setEntityIdListForActionInstances(basicsWorkflowInstanceService.task.list);

			//Filtering data
			setMainEntityClass();
			loadData(ctrl.listConfig);

			//Enabling filter icon once filter function is complete
			ctrl.isFilterDisable = false;

			$scope.$apply();
		};

		ctrl.companyFilter = async function () {
			//Setting spinner and disabling the filter icon
			ctrl.taskListIsLoading = true;
			ctrl.isFilterDisable = true;

			setCompanyClass();
			loadData(ctrl.listConfig);

			//Enabling filter icon once filter function is complete
			ctrl.isFilterDisable = false;
		};

		ctrl.clearNotificationTask = function () {
			var workflowCallBack = function (/* response */) {
				ctrl.refresh();
			};
			_.filter(ctrl.taskList, function (task) {

				//Clearing grouped tasks that are notifications
				if (!_.isNil(task.childs)) {
					_.forEach(task.childs, function (child) {
						clearTask(child);
					});
					return;
				}

				//Clearing tasks that are notifications
				clearTask(task);
			});

			function clearTask(task) {
				if (task.isNotification) {
					basicsWorkflowInstanceService.continueWorkflow(task, workflowCallBack);
					basicsWorkflowTaskPopUpService.removeFromNotShowList(task.Id);
					task.Status = 4;
				}
			}
		};

		ctrl.refresh = function (isSwitchDetail) {
			return addProcessors().then(function () {
				ctrl.taskList = [];
				ctrl.listConfig.filter.fn = basicsWorkflowUtilityService.configurableFilterFnFactory(['comment', 'description'],
					ctrl.listConfig.filter.value);
				ctrl.taskListIsLoading = true;
				var promises = [];

				promises.push(basicsWorkflowInstanceService.getTaskList(basicsWorkflowInstanceService.task.showGroupTask));
				if (!state.priority || state.priority.length < 1) {
					promises = basicsWorkflowMasterDataService.getPriority();
				}
				return $q.all(promises)
					.then(function () {
						loadData(ctrl.listConfig);
						_.each(ctrl.taskList, processItem);
						ctrl.detailFn = angular.extend(ctrl.detailFn, ctrl.listConfig.isGrouped ? basicsWorkflowUtilityService.addGroupedListFn(ctrl, listProperty, simpleListFnHooks) :
							basicsWorkflowUtilityService.addSimpleListFn(ctrl, listProperty, simpleListFnHooks));
						if (isSwitchDetail) {
							switchLastUserInput();
						}
						basicsWorkflowTaskPopUpService.makePopUp(ctrl.taskList);
					});
			});
		};

		function switchLastUserInput() {
			var taskList = ctrl.taskList;
			basicsWorkflowUtilityService.getLastUserInput().then(function (response) {
				var userId = platformUserInfoService.getCurrentUserInfo().UserId;
				var data = response.data;
				var filterDef;
				if (!!data && data.length > 0 && taskList.length > 0) {
					var lastUseInput = {};
					for (var i = 0; i < data.length; i++) {
						var item = data[i];
						filterDef = JSON.parse(item.filterDef);
						if (filterDef.userId === userId) {
							if (!taskList[0].childs) {
								lastUseInput = _.filter(taskList, {Id: filterDef.actionInstanceId});
								if (!_.isEmpty(lastUseInput)) {
									break;
								}
							} else {
								var task = {};
								task = getActionChild(taskList, filterDef.actionInstanceId);
								if (!_.isEmpty(task)) {
									lastUseInput = task;
									break;
								}
							}
						}
					}
					if (!_.isEmpty(lastUseInput)) {
						ctrl.list = true;
						ctrl.detail = false;
						ctrl.detailFn.switchListDetail(filterDef.actionInstanceId);
					}
				}
			});
		}

		function getActionChild(taskList, actionInstanceId) {
			var task;
			for (var j = 0; j < taskList.length; j++) {
				var taskGroup = taskList[j];
				task = _.filter(taskGroup.childs, {Id: actionInstanceId});
				if (!_.isEmpty(task)) {
					break;
				}
			}
			return task;
		}

		ctrl.refreshSelected = function () {
			basicsWorkflowInstanceService.getTaskById(ctrl.selectedItem.id).then(function (response) {
				if (response) {
					var currentItem = _.find(basicsWorkflowInstanceService.task.list, {Id: ctrl.selectedItem.Id});
					currentItem = angular.extend(currentItem, response[0]);
					currentItem = basicsWorkflowInstanceService.prepareTask(currentItem);
					ctrl.selectedItem = currentItem;
					ctrl.detailFn.switchListDetail(ctrl.selectedItem.id);
					ctrl.detailFn.switchListDetail(ctrl.selectedItem.id);
				}
			});
		};

		ctrl.changeGroupFilter = function () {
			basicsWorkflowInstanceService.task.showGroupTask = !basicsWorkflowInstanceService.task.showGroupTask;
			ctrl.showGroupTask = basicsWorkflowInstanceService.task.showGroupTask;
			ctrl.refresh();
		};

		function saveSelectedListConfig() {
			var todoSettings = _.pick(ctrl.listConfig, ['filter', 'grouping', 'sort', 'isFiltered', 'isGrouped', 'isSorted']);
			return basicsWorkflowInstanceService.saveUserPreferedListConfig(todoSettings);
		}

		ctrl.updateView = function () {
			ctrl.listConfig.filter.fn = basicsWorkflowUtilityService.configurableFilterFnFactory(['Category', 'Description'], ctrl.listConfig.filter.value);
			ctrl.taskListIsLoading = true;
			loadData(ctrl.listConfig);
			ctrl.detailFn = angular.extend(ctrl.detailFn, ctrl.listConfig.isGrouped ? basicsWorkflowUtilityService.addGroupedListFn(ctrl, listProperty, simpleListFnHooks) :
				basicsWorkflowUtilityService.addSimpleListFn(ctrl, listProperty, simpleListFnHooks));
			saveSelectedListConfig();
		};

		function loadListConfig() {
			basicsWorkflowInstanceService.getUserPreferedListConfig().then(function (response) {
				if (!_.isEmpty(response)) {
					var listConfig = JSON.parse(JSON.stringify(ctrl.listConfig));
					var filterValue = ctrl.listConfig.filter.value;
					ctrl.listConfig = _.merge(ctrl.listConfig, _.mapKeys(response, function (v, k) {
						return _.camelCase(k);
					}));
					// restore origin filter
					if (_.isEmpty(response.Filter.value) || listConfig.isClear || listConfig.isFiltered) {
						ctrl.listConfig.filter.value = filterValue;
						ctrl.listConfig.isClear = false;
					}
				}
			});
		}

		function listWatchIf() {
			return basicsWorkflowInstanceService.task.listSeal;
		}

		function listWatchThen() {
			addProcessors().then(function () {
				loadData(ctrl.listConfig);
				loadListConfig();
			});
		}

		$scope.$watch(listWatchIf, listWatchThen);

		// initial task count refresh
		loadData(ctrl.listConfig);
		$scope.totalRunningWorkflowTasksCount();

		// task count refresh interval
		$interval(function () {
			$scope.totalRunningWorkflowTasksCount();
		}, 20000, false);

		basicsWorkflowInstanceService.registerWorkflowCallback($scope.totalRunningWorkflowTasksCount);

		cloudDesktopSidebarService.onOpenSidebar.register(function (cmdId) {
			if (cmdId === '#workflow-tasks') {
				setMainEntityClass(true);
				loadData(ctrl.listConfig);
				$scope.totalRunningWorkflowTasksCount();
				ctrl.refresh(true);
			}
		});

		basicsWorkflowGroupSettingEfilterService.registerTodoSettingsChange(todoSettingsChange);

		function todoSettingsChange(o, args) {
			if (args && args.dto && args.dto.todoSettings) {
				Object.assign(ctrl.listConfig, args.dto.todoSettings);
				ctrl.updateView();
			}
		}

		ctrl.reassignTaskOwnerCallback = function () {
			ctrl.detailFn.switchListDetail();
			$scope.totalRunningWorkflowTasksCount();
		};

		$scope.$on('$destroy', function () {
			basicsWorkflowGroupSettingEfilterService.unRegisterTodoSettingsChange(todoSettingsChange);
		});
	}

	angular.module(moduleName).controller('basicsWorkflowTaskSidebarController', ['_', 'basicsWorkflowInstanceService',
		'$templateCache', '$state', 'basicsWorkflowPreProcessorService', 'basicsWorkflowUtilityService',
		'basicsWorkflowTaskListGroupingOptions', 'basicsWorkflowTaskListSortingOptions', 'cloudDesktopSidebarService',
		'$scope', 'platformModuleStateService', 'platformTranslateService', '$q',
		'basicsWorkflowMasterDataService', 'basicsWorkflowTaskUiService', '$interval', 'basicsWorkflowTaskPopUpService',
		'basicsWorkflowModuleUtilService', 'basicsWorkflowGroupSettingEfilterService', 'platformUserInfoService', '$translate',
		'$timeout', 'platformContextService', 'cloudDesktopCompanyService', TaskSidebarCtrl]);

})(angular);
