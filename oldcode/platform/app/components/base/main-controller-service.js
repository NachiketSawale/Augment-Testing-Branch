/*
 * $Id: main-controller-service.js 634282 2021-04-27 16:17:27Z baf $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	/* global globals, Platform */
	'use strict';
	/**
	 * @ngdoc controller / service
	 * @name platformMainControllerService
	 * @function
	 *
	 * @description
	 * Service to do the initializing in a flat item list controller
	 **/
	angular.module('platform').service('platformMainControllerService', PlatformMainControllerService);

	PlatformMainControllerService.$inject = ['_', '$q', 'platformNavBarService', 'cloudDesktopSidebarService', 'basicsExportService',
		'platformModuleStateService', 'basicsReportingSidebarService', 'cloudDesktopSidebarInquiryService', 'cloudDesktopSidebarWatchListService',
		'basicsImportService', 'platformGridAPI', 'mainViewService', 'basicsConfigWizardSidebarService', 'basicsAudittrailPopupService',
		'$rootScope', '$window', '$translate', 'platformDataServiceModificationTrackingExtension', 'platformPermissionService',
		'basicsConfigAuditContainerService', 'platformDataValidationService', 'platformConcurrencyExceptionHandler', 'dialogUserSettingService',
		'platformDialogService', 'basicsConfigNavCommandbarService', 'basicCustomizeSystemoptionLookupDataService', 'cloudDesktopPinningContextService', 'cloudDesktopHotKeyService'];

	function PlatformMainControllerService(_, $q, platformNavBarService, cloudDesktopSidebarService, basicsExportService, platformModuleStateService, // jshint ignore:line
		basicsReportingSidebarService, inquiryService, watchListService, basicsImportService, platformGridAPI, mainViewService, basicsConfigWizardSidebarService, basicsAudittrailPopupService,
		$rootScope, $window, $translate, platformDataServiceModificationTrackingExtension, platformPermissionService,
		basicsConfigAuditContainerService, platformDataValidationService, platformConcurrencyExceptionHandler, dialogUserSettingService,
		platformDialogService, basicsConfigNavCommandbarService, basicCustomizeSystemoptionLookupDataService, cloudDesktopPinningContextService, cloudDesktopHotKeyService ) {

		let isModuleLoaded = false;
		let isTabChanged = false;
		let suppressRefresh = false;
		let filterLoading = false;
		let currentRootDataService = null;

		$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
			if (fromState.isDesktop) {
				isModuleLoaded = true;
				isTabChanged = false;
			} else if (toParams.tab !== fromParams.tab) {
				if (toState.name !== fromState.name) { // indicates change of module
					isModuleLoaded = true;
					isTabChanged = false;
				}
			}
		});

		$rootScope.$on('layout-system:layout-saved', function () {
			checkLoadData();
		});

		mainViewService.registerListener('onTabChanged', function(e, args) {
			if(args.fromTab !== args.toTab) {
				isTabChanged = true;
			}
		});

		mainViewService.registerListener('onViewChanged', function () {
			isTabChanged = true;
			checkLoadData();
		});

		$rootScope.$on('navigateTo', function() {
			suppressRefresh = true;
		});

		$rootScope.$on('$viewContentLoaded', function () {
			if(window.location.hash.indexOf('/api?navigate') > 0)
			{
				suppressRefresh = true;
			}
		});

		return {
			assertModuleState: assertModuleState,
			registerNavBar: registerNavBar,
			unregisterNavBar: unregisterNavBar,
			registerExport: registerExport,
			registerImport: registerImport,
			registerExportLayouts: registerExportLayouts,
			registerTranslation: registerTranslation,
			unregisterTranslation: unregisterTranslation,
			registerReports: registerReports,
			unregisterReports: unregisterReports,
			registerWizards: registerWizards,
			unregisterWizards: unregisterWizards,
			registerSearch: registerSearch,
			unregisterSearch: unregisterSearch,
			registerCompletely: registerCompletely,
			activateSidebarInquiry: activateSidebarInquiry,
			unregisterCompletely: unregisterCompletely,
			showModuleHeaderInformation: showModuleHeaderInformation,
			registerAuditTrail: registerAuditTrail,
			commitAndUpdate: commitAndUpdate,
			getModuleConfig: getModuleConfig,
			saveModuleConfig: saveModuleConfig
		};

		function checkLoadData(triggerSearch = false) {
			basicCustomizeSystemoptionLookupDataService.getParameterValueAsync(10123).then(function (result) {
				if(result && result === '1') {
					let pinningProject = cloudDesktopPinningContextService.getPinningItem(cloudDesktopPinningContextService.tokens.projectToken);
					let containsGlobalData = cloudDesktopSidebarService.filterRequest.containsGlobalData;
					if(!pinningProject || containsGlobalData) {
						suppressRefresh = true;
					}
				}

				if(!suppressRefresh) {
					let currentView = mainViewService.getCurrentView();
					let config = currentView ? currentView.Config : null;
					let callRefresh = false;
					if (config) {
						let isModuleLoadedRefresh = config.loadDataModuleStart && isModuleLoaded;
						let isTabViewChangedRefresh = config.loadDataTabChanged && isTabChanged;
						if (isModuleLoadedRefresh || isTabViewChangedRefresh) {
							callRefresh = true;
						}
						if (!callRefresh && currentRootDataService && _.isFunction(currentRootDataService.requiresRefresh) && currentRootDataService.requiresRefresh()) {
							callRefresh = true;
						}

						if (callRefresh) {
							if(triggerSearch) {
								if(cloudDesktopSidebarService.currentSearchType === 'google') {
									cloudDesktopSidebarService.filterStartSearch();
								} else {
									cloudDesktopSidebarService.filterStartEnhancedSearch();
								}
							}
							else {
								platformNavBarService.getActionByKey('refresh').fn();
							}
							if(currentRootDataService && _.isFunction(currentRootDataService.unHookRequiresRefresh)) {
								currentRootDataService.unHookRequiresRefresh();
							}
						}
					}
				}
				isModuleLoaded = isTabChanged = suppressRefresh = false;
			});
		}

		function onFilterLoaded() {
			if(!cloudDesktopSidebarService.filterInfo.isPending) {
				if(!suppressRefresh) {
					filterLoading = false;
					checkLoadData(true);
				}
				suppressRefresh = false;
				cloudDesktopSidebarService.onFilterReady.unregister(onFilterLoaded);
			}
		}

		function commitAndUpdate(dataService) {
			return function () {
				$rootScope.$emit('before-save-entity-data');
				platformGridAPI.grids.commitAllEdits();
				$rootScope.$broadcast('commit-form-all-edits');
				return dataService.update(false).then(function () {
					return $rootScope.$emit('after-save-entity-data');
				});
			};
		}

		/**
		 * activate/deactivate inquiry provider from sidebar inquiry service
		 * @param {boolean} active      set inquiry for this module active/inactive
		 * @param {object} dataService  actually not used
		 */
		function activateSidebarInquiry(active, dataService) { // jshint ignore:line
			inquiryService.activateSidebarInquiryProvider(active);
		}

		function assertModuleState(module, rootService) {
			platformModuleStateService.state(module, rootService);
		}

		function registerNavBar(dataService) {

			platformNavBarService.getActionByKey('prev').fn = dataService.goToPrev;
			platformNavBarService.getActionByKey('next').fn = dataService.goToNext;
			platformNavBarService.getActionByKey('first').fn = dataService.goToFirst;
			platformNavBarService.getActionByKey('last').fn = dataService.goToLast;

			var saveBtn = platformNavBarService.getActionByKey('save');
			saveBtn.fn = commitAndUpdate(dataService);
			saveBtn.iconCSS = function () {
				var cssClass = saveBtn.group === 'navBar' ? 'tlb-wh-icons ico-save' : 'tlb-icons ico-save';
				var title = $translate.instant('cloud.desktop.navBarSaveDesc');
				if (platformDataServiceModificationTrackingExtension.hasModifications(dataService)) {
					cssClass =  saveBtn.group === 'navBar' ? 'tlb-wh-icons ico-save2' : 'tlb-icons ico-save2';
					title = $translate.instant('platform.unsavedData');
				}
				saveBtn.description = title;
				return cssClass;
			};

			var reloadSelectionBtn = platformNavBarService.getActionByKey('refreshSelection');
			if (reloadSelectionBtn && dataService.hasSidebar) {
				reloadSelectionBtn.fn = dataService.refreshSelectedEntities;
				platformNavBarService.setActionVisible('refreshSelection');
			} else {
				platformNavBarService.setActionInVisible('refreshSelection');
			}
			platformNavBarService.getActionByKey('refresh').fn = dataService.refresh;
			platformNavBarService.getActionByKey('discard').fn = dataService.clear;

			cloudDesktopHotKeyService.registerToolbar(platformNavBarService.getActionGroup('navBar'), 'navBar');
		}

		function unregisterNavBar() {
			platformNavBarService.clearActions();
		}

		function registerRestoreDeactivatedMessages() {

			platformNavBarService.addAction(new Platform.Action('restore', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarResetDeactivateMsg', 'tlb-icons ico-reset', true, false, 15, resetDeactivateMsg));

			function resetDeactivateMsg() {
				platformDialogService.showYesNoDialog('cloud.desktop.navBarResetDeactivateDialogMsg', 'cloud.desktop.navBarResetDeactivateMsg', 'yes')
					.then(function (result) {
						if (result.yes) {
							dialogUserSettingService.resetDeactivatedDialogs();
						}
					});
			}
		}

		function registerExport(exportOptions) {

			platformNavBarService.addAction(new Platform.Action('export', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarExportDesc', 'tlb-icons ico-export', true, false, 14, showExportDialog, exportOptions.permission));

			function showExportDialog() {
				basicsExportService.showExportDialog(exportOptions);
			}
		}

		function registerImport(importOptions) {
			platformNavBarService.addAction(new Platform.Action('import', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarImportDesc', 'tlb-icons ico-import', true, false, 13, showImportDialog, importOptions.permission));

			function showImportDialog() {
				basicsImportService.showImportDialog(importOptions);
			}
		}

		function registerAuditTrail(auditTrailOptions, controllerOptions) {
			var activeAuditTrail = false;

			function showAuditTrailPopup() {
				if (activeAuditTrail) {
					basicsAudittrailPopupService.showAuditTrails(auditTrailOptions);
				}
			}

			function isPortal() {
				return globals.portal;
			}

			function isVisible() {
				return activeAuditTrail;
			}

			if (!isPortal() && controllerOptions.auditTrail) {
				$q.all([
					basicsConfigAuditContainerService.checkAuditTrailAvailability(auditTrailOptions.ModuleName),
					platformPermissionService.loadPermissions([controllerOptions.auditTrail])])
					.then(function (response) {
						activeAuditTrail = response[0].data && platformPermissionService.hasRead(controllerOptions.auditTrail);
						if (!activeAuditTrail) {
							platformNavBarService.setActionInVisible('audittrail');
						} else {
							platformNavBarService.setActionVisible('audittrail');
						}
					});

				platformNavBarService.addAction(new Platform.Action('audittrail', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarAuditTrailDesc', 'tlb-icons ico-audit-trail', isVisible, false, 11, showAuditTrailPopup));
			}
		}

		function registerExportLayouts() {
			platformNavBarService.addAction(new Platform.Action('exportLayouts', Platform.ActionGroup.defaultOptionsAction, 'cloud.desktop.navBarExportLayouts', 'tlb-icons ico-export-all-views', true, false, 12, mainViewService.exportAllViews, 'b92e1f10594d4e7daa2cba19be14d5aa'));
		}

		function registerTranslation(scope, ctrlProxy, transService) {
			scope.translate = {};
			ctrlProxy.loadTranslations = function loadTranslations() {
				scope.translate = transService.getTranslate();
			};
			scope.translate = ctrlProxy.loadTranslations();
			transService.registerUpdates(ctrlProxy.loadTranslations);
		}

		function unregisterTranslation(transService) {
			transService.unregisterUpdates();
		}

		function registerReports(module) {
			return basicsReportingSidebarService.registerModule(module);
		}

		function unregisterReports() {
			basicsReportingSidebarService.unregisterModule();
		}

		function registerWizards(module) {
			return basicsConfigWizardSidebarService.registerModule(module);
		}

		function unregisterWizards() {
			basicsConfigWizardSidebarService.unregisterModule();
		}

		function registerSearch(dataService) {
			cloudDesktopSidebarService.showHideButtons([{
				sidebarId: cloudDesktopSidebarService.getSidebarIds().search, active: true
			}]);
			cloudDesktopSidebarService.onExecuteSearchFilter.register(dataService.executeSearchFilter);
			dataService.registerSidebarFilter();
		}

		/**
		 * unregistering search sidebar container and removing onExecuteSearchFilter handler..
		 * @param dataService
		 */
		function unregisterSearch(dataService) {
			// remark: rei@18.6.15: is not required normally, because sidebar removes search when moving back to desktop,
			// but in case of not navigating via desktop the search might be accessible....
			cloudDesktopSidebarService.showHideButtons([{
				sidebarId: cloudDesktopSidebarService.getSidebarIds().search, active: false
			}]);
			cloudDesktopSidebarService.onExecuteSearchFilter.unregister(dataService.executeSearchFilter);
		}

		/**
		 * this function register the sidebar watchlist contianer for the current module
		 * @param scope
		 * @param dataService
		 */
		function registerWatchList(scope, dataService) {
			if (_.isFunction(dataService.getWatchListOptions)) {
				var wloptions = dataService.getWatchListOptions();
				if (wloptions.active) {
					cloudDesktopSidebarService.showHideButtons([{
						sidebarId: cloudDesktopSidebarService.getSidebarIds().watchlist, active: true
					}]);

					if (dataService.getModule().name) {
						watchListService.initialize(dataService.getModule().name, wloptions, dataService);
					} else {
						console.error('wrong configured, Module not contains angular module');
					}
				}
			}
		}

		/**
		 * unregistering watchlist sidebar container and removing onExecuteSearchFilter handler..
		 * @param dataService
		 */
		function unregisterWatchList(dataService) {
			cloudDesktopSidebarService.showHideButtons([{
				sidebarId: cloudDesktopSidebarService.getSidebarIds().watchlist, active: false
			}]);
			watchListService.deActivateWatchlist(dataService);
		}

		function showModuleHeaderInformation(dataService) {
			dataService.showModuleHeaderInformation();
		}

		function checkActiveTab(dataService) {
			if (dataService.getList().length === 0 && !dataService.hasSelection()) {
				mainViewService.setActiveTab(0, true);
			}
		}

		function registerCompletely(scope, dataService, ctrlProxy, transService, modulePath, options) { // jshint ignore:line

			$window.onbeforeunload = function () {
				platformGridAPI.grids.commitAllEdits();
				$rootScope.$emit('platform:onBeforeUnload', dataService);
				if (platformDataServiceModificationTrackingExtension.hasModifications(dataService) || platformDataValidationService.validationsOngoing(dataService)) {
					return true;
				}
			};

			scope.$on('$destroy', function unRegisterBeforeUnload() {
				$window.onbeforeunload = undefined;
				currentRootDataService = null;
			});

			assertModuleState(dataService.getModule(), dataService);
			registerNavBar(dataService);

			registerExportLayouts();
			registerTranslation(scope, ctrlProxy, transService);
			var result = registerReports(dataService.getModule());
			registerWizards(dataService.getModule());

			if (options.search) {
				registerSearch(dataService);
				filterLoading = true;
				cloudDesktopSidebarService.onFilterReady.unregister(onFilterLoaded);
				cloudDesktopSidebarService.onFilterReady.register(onFilterLoaded);
				// executes sidebarFilter with Startup parameter if there is one, otherwise returning false
				cloudDesktopSidebarService.checkStartupFilter();// rei@17.6.2015, support startup filter
			}
			else {
				cloudDesktopSidebarService.filterRequest.reset();
			}

			registerWatchList(scope, dataService);
			activateSidebarInquiry(true, dataService); // 11.Jun.2015@rei added:
			showModuleHeaderInformation(dataService);

			if (!_.isNull(options.wizardService) && !_.isUndefined(options.wizardService)) {
				options.wizardService.activate();
			}

			var auditTrailOptions = {
				ModuleName: modulePath,
				MainService: dataService
			};
			registerAuditTrail(auditTrailOptions, options);

			registerRestoreDeactivatedMessages();

			// check if any entities are loaded
			checkActiveTab(dataService);

			if (_.isFunction(dataService.setCurrentlyOpenedModule)) {
				dataService.setCurrentlyOpenedModule(modulePath);
			}

			if (_.isFunction(dataService.refreshEntitiesFromComplete)) {
				platformConcurrencyExceptionHandler.registerConcurrencyExceptionHandler(dataService.refreshEntitiesFromComplete);
			}

			if(_.isFunction(dataService.getConcurrencyConfig)) {
				platformConcurrencyExceptionHandler.addCustomConcurrencyConfig(dataService.getConcurrencyConfig());
			}

			let moduleName = dataService.getModule().name;
			getModuleConfig(moduleName);

			currentRootDataService = dataService;

			return result;
		}

		function getModuleConfig(moduleName) {
			if(moduleName) {
				basicsConfigNavCommandbarService.getModuleConfig(moduleName).then(function () {
					$rootScope.$emit('moduleConfigLoaded');
				});
			}
		}

		function saveModuleConfig() {
			// save default commandbar and navbar
			let moduleConfig = basicsConfigNavCommandbarService.moduleConfigurations[$rootScope.currentModule];
			if(moduleConfig) {
				if((globals.portal && (moduleConfig.CombarPortalEnabled || moduleConfig.NavbarPortalEnabled)) ||
					(!globals.portal && (moduleConfig.CombarEnabled || moduleConfig.NavBarEnabled))) {
					let combarItems = moduleConfig.CommandbarConfig.length === 0 ? cloudDesktopSidebarService.getCommandBarItems() : moduleConfig.CommandbarConfig.length !== cloudDesktopSidebarService.getCommandBarItems().length ? cloudDesktopSidebarService.getCommandBarItems() : [];
					let navbarItems = moduleConfig.NavbarConfig.length === 0 ? platformNavBarService.getActions() : moduleConfig.NavbarConfig.length !== platformNavBarService.getActions().length ?  platformNavBarService.getActions() : [];

					if (combarItems.length > 0 || navbarItems > 0) {
						basicsConfigNavCommandbarService.saveDefaultConfig(_.orderBy(navbarItems, ['group', 'sortOrder'], ['desc', 'asc']), combarItems, moduleConfig.InternalName);
					}
					else {
						let combarVersion = moduleConfig.CommandbarConfig.length > 0 ? moduleConfig.CommandbarConfig[0].ConfigAppVersion : '';
						let navbarVersion = moduleConfig.NavbarConfig.length > 0 ? moduleConfig.NavbarConfig[0].ConfigAppVersion : '';
						if(combarVersion !== globals.buildversion || navbarVersion !== globals.buildversion) {
							basicsConfigNavCommandbarService.saveDefaultConfig(_.orderBy(platformNavBarService.getActions(), ['group', 'sortOrder'], ['desc', 'asc']), cloudDesktopSidebarService.getCommandBarItems(), moduleConfig.InternalName);
						}
					}
				}
			}
		}

		function unregisterCompletely(dataService, sidebarReports, transService, options) {
			saveModuleConfig();
			dataService.update(false);
			dataService.saveLastObjects();

			if (_.isFunction(dataService.setCurrentlyOpenedModule)) {
				dataService.setCurrentlyOpenedModule('');
			}

			if (!_.isNull(options.wizardService) && !_.isUndefined(options.wizardService)) {
				options.wizardService.deactivate();
			}

			if (options.search) {
				unregisterSearch(dataService);
			}

			// cloudDesktopSidebarService.clearModuleConfigToolbarList();

			activateSidebarInquiry(false, dataService); // 11.Jun.2015@rei added:

			unregisterWatchList();
			unregisterReports();
			unregisterWizards();
			unregisterTranslation(transService);
			unregisterNavBar();

			if (_.isFunction(dataService.refreshEntitiesFromComplete)) {
				platformConcurrencyExceptionHandler.unregisterConcurrencyExceptionHandler(dataService.refreshEntitiesFromComplete);
			}

			if(_.isFunction(dataService.getConcurrencyConfig)) {
				platformConcurrencyExceptionHandler.removeCustomConcurrencyConfig(dataService.getConcurrencyConfig());
			}
		}
	}
})();
