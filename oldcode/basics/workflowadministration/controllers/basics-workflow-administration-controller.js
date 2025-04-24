(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name workflowAdministrationController
	 * @function
	 *
	 * @description
	 * Controller for the module of Workflow Administrations.
	 **/

	var module = 'basics.workflowAdministration';

	function basicsWorkflowAdministrationController($scope, platformNavBarService, basicsWorkflowNavBarService, basicsWorkflowAdministrationInstanceService, platformModuleStateService, cloudDesktopInfoService, cloudDesktopSidebarService, basicsWorkflowAdministrationTranslationService, $translate, platformTranslateService, globals, basicsWorkflowSidebarRegisterService, $injector) {
		var state = platformModuleStateService.state(module);

		// Defect #111874 - Name module Workflow Administration not correct in module itself
		var moduleName = $translate.instant(`${module}.moduleName`);
		var loadTranslations = function () {
			cloudDesktopInfoService.updateModuleInfo(`${module}.moduleName`);
		};

		platformTranslateService.translationChanged.register(loadTranslations);

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule(module)) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		}

		var sidebarSearchFn = function (e, filter) {
			filter = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(filter);
			//Loading tree grid
			basicsWorkflowAdministrationInstanceService.getFilteredListTree(filter);
			//Loading flat list grid
			return basicsWorkflowAdministrationInstanceService.getFilteredList(filter).then(function (result) {
				cloudDesktopSidebarService.updateFilterResult(
					{isPending: false, filterRequest: filter, filterResult: result.FilterResult}
				);
			});
		};

		var navBarUtil = basicsWorkflowNavBarService.getNavBarUtil(module, 'selectedMainEntity', 'mainEntities', basicsWorkflowAdministrationInstanceService.changeSelectedMainEntity);

		platformNavBarService.clearActions();
		platformNavBarService.getActionByKey('prev').fn = navBarUtil.goToPrevFolder;
		platformNavBarService.getActionByKey('next').fn = navBarUtil.goToNextFolder;
		platformNavBarService.getActionByKey('first').fn = navBarUtil.goToFirstFolder;
		platformNavBarService.getActionByKey('last').fn = navBarUtil.goToLastFolder;

		platformNavBarService.getActionByKey('refresh').fn = function () {
			sidebarSearchFn();
		};

		// Remove the unnecessary default buttons
		platformNavBarService.removeAction('discard');

		$scope.$watch(function () {
			return state.selectedMainEntity;
		}, function (newVal, oldVal) {
			if (newVal && newVal.Id !== (oldVal ? oldVal.Id : 0)) {
				if (newVal.Id && newVal.Description) {
					cloudDesktopInfoService.updateModuleInfo(moduleName, newVal.Id + ' - ' + newVal.Description);
				} else {
					cloudDesktopInfoService.updateModuleInfo(moduleName);
				}
			}
		});

		// switch sidebar search on
		cloudDesktopSidebarService.showHideButtons([{
			sidebarId: cloudDesktopSidebarService.getSidebarIds().search,
			active: true
		}]);

		cloudDesktopSidebarService.initializeFilterRequest({
			moduleName: module,
			pattern: '',
			pageSize: 50,
			useCurrentClient: true,
			includeNonActiveItems: false,
			showOptions: true,
			showProjectContext: true,
			withExecutionHints: true,
			enhancedSearchEnabled: true,
			enhancedSearchVersion: '2.0',
			useIdentification: true,
			httpRoute: globals.webApiBaseUrl + 'basics/workflow/instance/'                  //Removing the error of nullgetadditionalsimplesearchcolumnfilterlis
		});

		cloudDesktopSidebarService.onExecuteSearchFilter.register(sidebarSearchFn);

		basicsWorkflowSidebarRegisterService.registerEntityForModule('21922894711C4E9DAA6C0B5658685571', module, false,
			function getSelectedModelId() {
				var basicsWorkflowActionInstanceStatusService = $injector.get('basicsWorkflowAdministrationInstanceService');
				var selModel = basicsWorkflowActionInstanceStatusService.getSelected();
				if (selModel) {
					return selModel.Id;
				}
				return undefined;
			}, function getModelIdList() {
				var basicsWorkflowActionInstanceStatusService = $injector.get('basicsWorkflowAdministrationInstanceService');
				var items = basicsWorkflowActionInstanceStatusService.getList();
				return _.map(_.isArray(items) ? items : [], function (modelEntity) {
					return modelEntity.Id;
				});
			}, angular.noop, angular.noop, angular.noop, true);

		$scope.$on('$destroy', function () {
			cloudDesktopSidebarService.onExecuteSearchFilter.unregister(sidebarSearchFn);
			basicsWorkflowAdministrationTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			platformTranslateService.translationChanged.unregister(loadTranslations);
		});

		$scope.path = globals.appBaseUrl;

	}

	angular.module(module).controller('basicsWorkflowAdministrationController',
		['$scope', 'platformNavBarService', 'basicsWorkflowNavBarService', 'basicsWorkflowAdministrationInstanceService',
			'platformModuleStateService', 'cloudDesktopInfoService', 'cloudDesktopSidebarService', 'basicsWorkflowAdministrationTranslationService', '$translate', 'platformTranslateService', 'globals', 'basicsWorkflowSidebarRegisterService', '$injector',
			basicsWorkflowAdministrationController]);
})();
