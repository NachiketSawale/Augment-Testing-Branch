/* global angular */
(function () {
	'use strict';

	function BasicsWorkflowSidebarController($rootScope, basicsWorkflowInstanceService, basicsWorkflowTemplateService,
		cloudDesktopSidebarService, _, $state, $translate, basicsWorkflowUtilityService,
		basicsWorkflowWorkflowListGroupingOptions, basicsWorkflowWorkflowSortingOptions,
		platformTranslateService, basicsWorkflowSidebarRegisterService, basicsWorkflowModuleUtilService,
		$templateCache, $window, basicsWorkflowMasterDataService, platformContextService) {
		var self = this;
		var testDataKey = 'workflow-test-data-list';

		// To load Entities into the workflow sidebar pinned option.
		$rootScope.$on('$stateChangeSuccess', function () {
			updateEntityList(basicsWorkflowModuleUtilService.getCurrentModule($state.current));
		});

		var containerWatch;

		// De-registering the watch if it already has been registered.
		if (containerWatch !== undefined) {
			containerWatch();
		}

		containerWatch = $rootScope.$watch(function () {
			if (self.selectedEntityId) {
				var temp = basicsWorkflowSidebarRegisterService.getFnsForEntity(self.selectedEntityId);
				if (temp) {
					let selectedId = temp.getFn();
					return selectedId ? selectedId : null;
				}
			}

			return null;
		}, function (newVal) {
			if (typeof (newVal) === 'number') {
				self.newId = newVal;
			}
			else if (typeof (newVal) === 'object' && newVal !== null) {
				self.newId = newVal.Id;
				self.selectedObj = newVal;
			}
			self.newDescription = '';
		});

		var onStateChangeWatch;

		self.terms = {
			headline: $translate.instant('basics.workflow.action.customEditor.workflow'),
			btnSingleWorkflow: $translate.instant('basics.workflow.sidebar.startWorkflow'),
			btnMultiWorkflow: $translate.instant('basics.workflow.sidebar.startWorkflowForEveryEntity')
		};

		self.lastWorkflow = {
			name: '',
			status: '',
			error: ''
		};

		self.listConfig = {
			isGrouped: false,
			filter: null
		};
		self.getModule = function () {
			return basicsWorkflowModuleUtilService.getCurrentModule($state.current);
		};
		var listProperty = 'workflowList';
		self[listProperty] = [];
		self.itemTemplate = $templateCache.get('basics.workflow/workflowItem.html');
		self.showFilter = false;
		self.showSettings = false;
		self.detailConfig = {};
		self.detail = false;
		self.list = true;
		self.listConfig = {};
		self.listConfig.filter = {};
		self.listConfig.filter.value = '';
		self.listConfig.grouping = {};
		self.listConfig.grouping.value = '';
		self.listConfig.preProcessors = [];
		self.listConfig.sort = {};
		self.listConfig.sort.value = '';
		self.testData = {
			get currentList() {

				var list = angular.fromJson(self.testDataList);
				return _.filter(list, { 'EntityId': self.selectedEntityId });
			}
		};
		self.entityTypeList = [];
		self.groupTemplate = $templateCache.get('basics.workflow/groupItem.html');
		self.detailFn = basicsWorkflowUtilityService.addSimpleListFn(self, 'workflowList');

		function translateOptions(options) {
			_.each(options.items, function (item) {
				item.displayMember = platformTranslateService.instant(item.displayMember, null, true);
			});

		}

		//define toolbar

		translateOptions(basicsWorkflowWorkflowListGroupingOptions.options);
		translateOptions(basicsWorkflowWorkflowSortingOptions.options);
		self.grouping = basicsWorkflowWorkflowListGroupingOptions;
		self.sorting = basicsWorkflowWorkflowSortingOptions;

		self.refresh = function () {
			self.listConfig.filter.fn = basicsWorkflowUtilityService.configurableFilterFnFactory(['Description'], self.listConfig.filter.value);

			updateWorkflows(basicsWorkflowModuleUtilService.getCurrentModule($state.current)).then(function (list) {
				self.workflowList = basicsWorkflowInstanceService.updateListConfig(self.listConfig, list);
				if(self.listConfig.isGrouped){
					for(let i = 0; i < self.workflowList.length; i++){
						if(!self.workflowList[i].name){
							self.workflowList[i].name = $translate.instant('basics.workflow.sidebar.no') + ' ' + self.listConfig.grouping.displayMember;
						}
					}
				}
				self.detailFn = angular.extend(self.detailFn, self.listConfig.isGrouped ? basicsWorkflowUtilityService.addGroupedListFn(self, listProperty) :
					basicsWorkflowUtilityService.addSimpleListFn(self, listProperty));
			});

		};
		self.clearSearch = function () {
			self.listConfig.filter.value = null;
			self.refresh();
		};

		function updateWorkflows(module) {
			var entities = _.map(basicsWorkflowSidebarRegisterService.getEntitiesForModule(module), 'entityId');

			entities.push('0');
			return basicsWorkflowTemplateService.getUserWorkflows(entities).then(function (response) {
				_.forEach(response, function (item) {
					item.CommentText = item.CommentText ? item.CommentText : '';
					item.Entity = item.Entity ? item.Entity : '';
				});
				return response;
			});
		}

		self.selectOptions = {
			displayMember: 'Description',
			valueMember: 'Id',
			items: []
		};

		self.entityOptions = {
			items: self.entityList,
			displayMember: 'description',
			valueMember: 'entityId'
		};

		self.startWorkflow = function (template) {
			basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).prepareFn();
			var id = basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).getFn();
			self.lastWorkflow.status = '';
			self.lastWorkflow.name = '';
			self.lastWorkflow.error = '';
			self.lastWorkflow.history = [];

			basicsWorkflowInstanceService.startWorkflow(template.Id, id).then(function (response) {
				self.lastWorkflow.status = response.StatusName;
				self.lastWorkflow.name = response.Description;
				var context = angular.fromJson(response.Context);
				if (context.Exception) {
					self.lastWorkflow.error = context.Exception.Message;
				}
				self.lastWorkflow.history = response.ActionInstances;

				let disableRefreshEntity = evaluateDisableRefresh(response.ActionInstances);
				if (!disableRefreshEntity) {
					basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).updateFn();
				}
			});
		};

		function evaluateDisableRefresh(instances){
			let disableRefresh = false;
			instances.forEach((instance)=>{
				let disableRefreshLocal = JSON.parse(instance.Input).filter(e => e.key === 'DisableRefresh')[0];
				disableRefreshLocal = disableRefreshLocal === undefined ? false : disableRefreshLocal.value;
				disableRefresh = disableRefresh || disableRefreshLocal;
			});
			return disableRefresh;
		}

		self.startWorkflowForEveryEntity = function (template) {
			basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).prepareFn();
			var idArray = basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).getListFn();

			self.lastWorkflow.status = '';
			self.lastWorkflow.name = '';
			self.lastWorkflow.error = '';
			self.lastWorkflow.history = [];

			basicsWorkflowInstanceService.startWorkflowBulk(template.Id, idArray).then(function (response) {
				self.lastWorkflow.status = 'done';
				self.lastWorkflow.name = 'execute ' + response.data.Count + ' workflows';


				let disableRefreshEntity = evaluateDisableRefresh(response.data.ActionInstances);
				if (!disableRefreshEntity) {
					basicsWorkflowModuleUtilService.refreshAllCurrentEntities();
				}
			}, function () {
				self.lastWorkflow.status = '';
				self.lastWorkflow.name = '';
			});
		};

		self.startWorkflowForEverySelectedEntity = function (template) {
			basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).prepareFn();
			var idArray = basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).getSelectedListFn();

			self.lastWorkflow.status = '';
			self.lastWorkflow.name = '';
			self.lastWorkflow.error = '';
			self.lastWorkflow.history = [];

			var context = angular.toJson({ EntityIdList: idArray });

			basicsWorkflowInstanceService.startWorkflow(template.Id, 0, context).then(function (response) {
				self.lastWorkflow.status = response.StatusName;
				self.lastWorkflow.name = response.Description;
				var context = angular.fromJson(response.Context);
				if (context.Exception) {
					self.lastWorkflow.error = context.Exception.Message;
				}
				self.lastWorkflow.history = response.ActionInstances;

				let disableRefreshEntity = evaluateDisableRefresh(response.ActionInstances);
				if (!disableRefreshEntity) {
					basicsWorkflowSidebarRegisterService.getFnsForEntity(template.EntityId).updateFn();
				}
			}, function () {
				self.lastWorkflow.status = '';
				self.lastWorkflow.name = '';
			});
		};

		self.isItemSelected = function () {
			return self.selectedItem.EntityId === '0' ? true :
				!!basicsWorkflowModuleUtilService.getCurrentItem();
		};

		self.hasListItems = function () {
			if (self.selectedItem.EntityId === '0') {
				return true;
			}
			var list = basicsWorkflowModuleUtilService.getCurrentList();
			return list.length !== 0;
		};

		function openSidebar() {
			self.refresh();
			onStateChangeWatch = $rootScope.$on('$stateChangeSuccess', onStateChange);
		}

		cloudDesktopSidebarService.onOpenSidebar.register(function (cmdId) {
			if (cmdId === '#workflow') {
				openSidebar();
			}
		});

		cloudDesktopSidebarService.onClosingSidebar.register(function (cmdId) {
			if (cmdId === '#workflow' && onStateChangeWatch) {
				onStateChangeWatch();
			}
		});

		$rootScope.$watch(function () {
			return self.selectedItem;
		}, function () {
			self.lastWorkflow = {};
		});

		function onStateChange() {
			if (platformContextService.isLoggedIn) {
				const toState = arguments[1];
				const module = basicsWorkflowModuleUtilService.getCurrentModule(toState);
				//console.log('onStateChange() tostate:', toState, ' module: ', module);
				updateWorkflows(module);
				updateEntityList(module);
			}
		}

		updateEntityList(basicsWorkflowModuleUtilService.getCurrentModule($state.current));

		function updateEntityList(module) {

			if (module.length > 0) {
				self.entityList = _.filter(basicsWorkflowSidebarRegisterService.getEntitiesForModule(module));
			} else {
				self.entityList = [];
			}

			self.entityOptions.items = self.entityList;
			if (self.entityList.length > 0) {
				self.selectedEntityId = self.entityList[0].entityId;
			}

			self.newId = '';
			self.newDescription = '';
		}

		var lsList = basicsWorkflowInstanceService.task.list[testDataKey];

		if (lsList) {
			self.testDataList = basicsWorkflowInstanceService.task.list[testDataKey];
		} else {
			self.testDataList = [];
		}

		self.add = function () {
			self.testDataList.push({
				Id: self.newId,
				Description: self.newDescription,
				EntityId: self.selectedEntityId,
				SelectedObj: self.selectedObj
			});
			basicsWorkflowInstanceService.task.list[testDataKey] = self.testDataList;
		};

		self.remove = function (id) {
			_.remove(self.testDataList, function (item) {
				return item.Id === id;
			});
			basicsWorkflowInstanceService.task.list[testDataKey] = self.testDataList;
		};

		if (cloudDesktopSidebarService.checkedInLocalStorage(cloudDesktopSidebarService.getSidebarIds().workflow)) {
			openSidebar();
		}
	}

	angular.module('basics.workflow').controller('basicsWorkflowSidebarController',
		['$rootScope', 'basicsWorkflowInstanceService', 'basicsWorkflowTemplateService',
			'cloudDesktopSidebarService', '_', '$state',
			'$translate', 'basicsWorkflowUtilityService',
			'basicsWorkflowWorkflowListGroupingOptions', 'basicsWorkflowWorkflowSortingOptions',
			'platformTranslateService', 'basicsWorkflowSidebarRegisterService',
			'basicsWorkflowModuleUtilService', '$templateCache', '$window', 'basicsWorkflowMasterDataService', 'platformContextService', BasicsWorkflowSidebarController]);

})();
