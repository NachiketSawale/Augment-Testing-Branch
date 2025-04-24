/* global angular */
(function () {
	'use strict';

	var module = 'basics.workflowTask';

	function basicsWorkflowTaskController($scope, platformNavBarService, basicsWorkflowNavBarService,
	                                      basicsWorkflowInstanceService, platformModuleStateService, platformMainControllerService,
	                                      cloudDesktopInfoService, cloudDesktopSidebarService, cloudDesktopModalBackgroundService, $rootScope,
	                                      $translate, platformTranslateService) {

		var state = platformModuleStateService.state(module);

		//Defect #111874 - Name module Workflow Task not correct in module itself
		var moduleName = '';
		var loadTranslations = function () {
			moduleName = $translate.instant('cloud.desktop.moduleDisplayNameWorkflowTask') || 'X-Task';
			cloudDesktopInfoService.updateModuleInfo(moduleName);
		};
		platformMainControllerService.getModuleConfig(module);

		platformTranslateService.translationChanged.register(loadTranslations);

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule(module)) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		}

		var sidebarSearchFn = function (e, filter) {
			filter = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(filter);
			return basicsWorkflowInstanceService.getTaskListByFilter(filter).then(function (result) {
				cloudDesktopSidebarService.updateFilterResult(
					{isPending: false, filterRequest: filter, filterResult: result.FilterResult}
				);
			});
		};

		var navBarUtil = basicsWorkflowNavBarService.getNavBarUtil('basics.workflowTask', 'selectedMainEntity', 'mainEntities', basicsWorkflowInstanceService.changeSelectedTask);

		platformNavBarService.clearActions();
		platformNavBarService.getActionByKey('prev').fn = navBarUtil.goToPrevFolder;
		platformNavBarService.getActionByKey('next').fn = navBarUtil.goToNextFolder;
		platformNavBarService.getActionByKey('first').fn = navBarUtil.goToFirstFolder;
		platformNavBarService.getActionByKey('last').fn = navBarUtil.goToLastFolder;
		platformNavBarService.getActionByKey('refresh').fn = function () {
			sidebarSearchFn(null, null);
		};

		//Remove the unnecessary default buttons
		platformNavBarService.removeAction('discard');

		platformNavBarService.getActionByKey('save').fn = function () {
			$rootScope.$emit('updateRequested');
			cloudDesktopModalBackgroundService.setModalBackground(true);
			basicsWorkflowInstanceService.saveSelectedTask().then(function () {
					cloudDesktopModalBackgroundService.setModalBackground(false);
					navBarUtil.refreshSelection();
				},
				function () {
					cloudDesktopModalBackgroundService.setModalBackground(false);
				});
		};

		$scope.$watch(function () {
			return state.selectedMainEntity;
		}, function (newVal, oldVal) {
			if (newVal) {
				if (newVal !== oldVal) {
					if (newVal.Id && newVal.Description) {
						cloudDesktopInfoService.updateModuleInfo(moduleName + ': ' + newVal.Id + ' - ' + newVal.Description);
					} else {
						cloudDesktopInfoService.updateModuleInfo(moduleName);
					}
				}
			} else {
				cloudDesktopInfoService.updateModuleInfo(moduleName);
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
			showProjectContext: false,
			withExecutionHints: true
		});

		cloudDesktopSidebarService.onExecuteSearchFilter.register(sidebarSearchFn);

		$scope.$on('$destroy', function () {
			cloudDesktopSidebarService.onExecuteSearchFilter.unregister(sidebarSearchFn);
			platformNavBarService.clearActions();
			platformTranslateService.translationChanged.unregister(loadTranslations);
			platformMainControllerService.saveModuleConfig();
		});

		$scope.path = globals.appBaseUrl;

	}

	angular.module(module).controller('basicsWorkflowTaskController',
		['$scope', 'platformNavBarService', 'basicsWorkflowNavBarService', 'basicsWorkflowInstanceService',
			'platformModuleStateService', 'platformMainControllerService', 'cloudDesktopInfoService', 'cloudDesktopSidebarService', 'cloudDesktopModalBackgroundService', '$rootScope',
			'$translate', 'platformTranslateService',
			basicsWorkflowTaskController]);
})();
