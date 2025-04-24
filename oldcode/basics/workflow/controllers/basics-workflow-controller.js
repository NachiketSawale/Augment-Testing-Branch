/* global angular */
(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name workflowMainController
	 * @function
	 *
	 * @description
	 * Controller for the module of Workflow Designer.
	 **/

	function basicsWorkflowController($scope, platformNavBarService, basicsWorkflowNavBarService, basicsWorkflowTemplateService,
	                                  basicsWorkflowUIService, cloudDesktopSidebarService, cloudDesktopModalBackgroundService, basicsWorkflowService, basicsWorkflowTranslationService, basicsConfigWizardSidebarService, platformModuleStateService,
	                                  $translate, cloudDesktopInfoService, platformTranslateService, $window,basicsWorkflowInstanceService) {

		var state = platformModuleStateService.state('basics.workflow');

		//Defect #111874 - Name module Workflow Designer not correct in module itself on top left
		var moduleName = '';
		var loadTranslations = function () {
			moduleName = cloudDesktopInfoService.updateModuleInfo($translate.instant('basics.workflow.moduleName'));
		};

		platformTranslateService.translationChanged.register(loadTranslations);

		// register a module - translation table will be reloaded if module isn't available yet
		if (!platformTranslateService.registerModule('basics.workflow')) {
			// if translation is already available, call loadTranslation directly
			loadTranslations();
		}

		var navBarUtil = basicsWorkflowNavBarService.getNavBarUtil('basics.workflow', 'selectedMainEntity', 'mainEntities', basicsWorkflowTemplateService.changeSelectedMainEntity);
		basicsConfigWizardSidebarService.registerModule('basics.workflow');

		var sidebarSearchFn = function (e, filter) {
			filter = cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(filter);
			return basicsWorkflowTemplateService.getFilteredList(filter).then(function (result) {
				if (!result || !result.FilterResult) {
					result = {
						FilterResult: {
							RecordsFound: 0,
							RecordsRetrieved: 0,
							ExecutionInfo: ''
						}
					};
				}
				cloudDesktopSidebarService.updateFilterResult({
					isPending: false,
					filterRequest: filter,
					filterResult: result.FilterResult
				});
			});
		};

		platformNavBarService.clearActions();
		platformNavBarService.getActionByKey('prev').fn = navBarUtil.goToPrevFolder;
		platformNavBarService.getActionByKey('next').fn = navBarUtil.goToNextFolder;
		platformNavBarService.getActionByKey('first').fn = navBarUtil.goToFirstFolder;
		platformNavBarService.getActionByKey('last').fn = navBarUtil.goToLastFolder;
		platformNavBarService.getActionByKey('refreshSelection').fn = navBarUtil.refreshSelection;

		//Remove the unnecessary default buttons
		platformNavBarService.removeAction('discard');

		platformNavBarService.getActionByKey('save').fn = function () {
			basicsWorkflowUIService.prepareSave();
			cloudDesktopModalBackgroundService.setModalBackground(true);
			basicsWorkflowTemplateService.saveSelectedItem().then(function () {
					cloudDesktopModalBackgroundService.setModalBackground(false);
					navBarUtil.refreshSelection();
				},
				function () {
					cloudDesktopModalBackgroundService.setModalBackground(false);
				});

		};

		// reload selected Entity
		platformNavBarService.getActionByKey('refreshSelection').fn = function () {
			var id = basicsWorkflowInstanceService.getSelected().Id;
			if(id !== undefined) {
				basicsWorkflowTemplateService.loadEntityById(id).then(function (res) {
					let entities = state.mainEntities;

					entities.forEach(function(entity) {
						if(entity.Id === res.data.Id){
							entity = res.data;
						}
					});
				});
			}
		};

		var saveBtn = platformNavBarService.getActionByKey('save');
		saveBtn.iconCSS = function () {
			var cssClass = 'tlb-wh-icons ico-save';
			var title = $translate.instant('cloud.desktop.navBarSaveDesc');
			if (state.mainItemIsDirty) {
				cssClass = 'tlb-wh-icons ico-save2';
				title = $translate.instant('platform.unsavedData');
			}
			saveBtn.description = title;
			return cssClass;
		};

		$window.onbeforeunload = function () {
			if (state.mainItemIsDirty) {
				return true;
			}
		};

		platformNavBarService.getActionByKey('refresh').fn = function () {
			sidebarSearchFn(null, null);
		};

		// switch sidebar search on
		cloudDesktopSidebarService.showHideButtons([{
			sidebarId: cloudDesktopSidebarService.getSidebarIds().search,
			active: true
		}]);

		cloudDesktopSidebarService.initializeFilterRequest({
			moduleName: 'basics.workflow',
			pattern: '',
			pageSize: 100,
			useCurrentClient: true,
			includeNonActiveItems: null,
			showOptions: true,
			showProjectContext: true,
			withExecutionHints: true
		});

		cloudDesktopSidebarService.onExecuteSearchFilter.register(sidebarSearchFn);

		$scope.$on('$destroy', function () {
			cloudDesktopSidebarService.onExecuteSearchFilter.unregister(sidebarSearchFn);
			basicsWorkflowTranslationService.unregisterUpdates();
			platformNavBarService.clearActions();
			basicsConfigWizardSidebarService.unregisterModule();
			$window.onbeforeunload = undefined;
			platformModuleStateService.state('basics.workflow').copyWorkflowAction = null;
			// platformMainControllerService.unregisterCompletely(basicsWorkflowService, sidebarReports, basicsWorkflowTranslationService, options);
			platformTranslateService.translationChanged.unregister(loadTranslations);
		});

		$scope.path = globals.appBaseUrl;

		//var options = {search: true, reports: false};
		//var configObject = {};
		//var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsWorkflowService, configObject, basicsWorkflowTranslationService, 'basics.workflow', options);

	}

	angular.module('basics.workflow').controller('basicsWorkflowController',
		['$scope', 'platformNavBarService', 'basicsWorkflowNavBarService',
			'basicsWorkflowTemplateService', 'basicsWorkflowUIService', 'cloudDesktopSidebarService',
			'cloudDesktopModalBackgroundService', 'basicsWorkflowService', 'basicsWorkflowTranslationService', 'basicsConfigWizardSidebarService', 'platformModuleStateService',
			'$translate', 'cloudDesktopInfoService', 'platformTranslateService', '$window','basicsWorkflowInstanceService',
			basicsWorkflowController])
		.run(['basicsWorkflowEventService', function (basicsWorkflowEventService) {
			basicsWorkflowEventService.registerEvent('B8164CA929A34E88BE5EC5B5DA75C13E',
				'Send Bidder Mail', 'Entity.Id', 'JsonContext');
		}]);
})();
