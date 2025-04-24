/*
 * $Id: pinningfilter-service.js 2021-06-17 10:56:37Z ong $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 *
	 */
	angular.module('cloud.desktop').factory('cloudDesktopPinningFilterService', cloudDesktopPinningFilterService);

	cloudDesktopPinningFilterService.$inject = ['$rootScope', 'mainViewService', 'cloudDesktopSidebarService', 'cloudDesktopBulkSearchDataService', '$q'];

	function cloudDesktopPinningFilterService($rootScope, mainViewService, cloudDesktopSidebarService, cloudDesktopBulkSearchDataService, $q) { // jshint ignore:line

		let onSetPinningFilter = new Platform.Messenger();
		let onClearPinningFilter = new Platform.Messenger();

		mainViewService.registerListener('onViewChanged', function (viewObj) {
			setPinningFilter(viewObj, false, false);
		});

		mainViewService.registerListener('onTabChanged', function (e, args) {
			if (args.fromTab !== args.toTab) {
				setPinningFilter(null, true, false);
			}
		});

		$rootScope.$on('layout-system:layout-saved', function (e, view) {
			setPinningFilter(view, true, false);
		});

		$rootScope.$on('$stateChangeSuccess', function (e, toState, toParams, fromState, fromParams) {
			if (toState.isDesktop) {
				delete cloudDesktopSidebarService.filterRequest.pinnedFilter;
				onSetPinningFilter.fire({filter: null});
			} else if (fromState.isDesktop) {
				let currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;
				cloudDesktopBulkSearchDataService.changeModule(currentModuleName).then(function () {
					setPinningFilter(null, false, true);
				});
			} else if (toParams.tab !== fromParams.tab) {
				if (toState.name !== fromState.name) { // indicates change of module
					let currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;
					cloudDesktopBulkSearchDataService.changeModule(currentModuleName).then(function () {
						setPinningFilter(null, false, true);
					});
				}
			}
		});

		function getCurrentViewConfig() {
			return mainViewService.getCurrentViewConfig();
		}

		/**
		 * This function sets the pinning filter of the active view.
		 *
		 * @param view
		 * @param tabChanged
		 * @param moduleLoaded
		 */
		function setPinningFilter(view, tabChanged, moduleLoaded) {

			var activeConfig;
			let _isViewChanged = !!view;
			if (view) {
				activeConfig = view.Config;
			} else {
				let activeView = mainViewService.getCurrentView();
				activeConfig = activeView ? activeView.Config : null;
			}

			if (activeConfig) {
				if (activeConfig.filterId) {
					let savedFilter = cloudDesktopBulkSearchDataService.getFilterByID(activeConfig.filterId);
					if (savedFilter) {
						cloudDesktopSidebarService.filterRequest.pinnedFilter = savedFilter;
						cloudDesktopSidebarService.onFilterReady.fire();
						onSetPinningFilter.fire({
							filter: savedFilter,
							config: activeConfig,
							tabChanged: tabChanged,
							moduleLoaded: moduleLoaded,
							viewChanged: _isViewChanged
						});
					} else {
						let currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;
						cloudDesktopBulkSearchDataService.fetchFilters(currentModuleName).then(function (filters) {
							if (filters) {
								let found = false;
								for (let i = 0; i < filters.length; i++) {
									if (filters[i].id === activeConfig.filterId) {
										found = true;
										cloudDesktopSidebarService.filterRequest.pinnedFilter = filters[i];
										cloudDesktopSidebarService.onFilterReady.fire();
										onSetPinningFilter.fire({
											filter: filters[i],
											config: activeConfig,
											tabChanged: tabChanged,
											moduleLoaded: moduleLoaded,
											viewChanged: _isViewChanged
										});
										break;
									}
								}
								if (!found) {
									delete activeConfig.filterId;
									delete cloudDesktopSidebarService.filterRequest.pinnedFilter;
									cloudDesktopSidebarService.onFilterReady.fire();
									onSetPinningFilter.fire({
										filter: null,
										config: activeConfig,
										tabChanged: tabChanged,
										moduleLoaded: moduleLoaded,
										viewChanged: _isViewChanged
									});
								}
							}
						});
					}
				} else {
					delete cloudDesktopSidebarService.filterRequest.pinnedFilter;
					cloudDesktopSidebarService.onFilterReady.fire();
					onSetPinningFilter.fire({
						filter: null,
						config: activeConfig,
						tabChanged: tabChanged,
						moduleLoaded: moduleLoaded,
						viewChanged: _isViewChanged
					});
				}
			} else {
				cloudDesktopSidebarService.onFilterReady.fire();
				onSetPinningFilter.fire({
					filter: null,
					config: null,
					tabChanged: tabChanged,
					moduleLoaded: moduleLoaded,
					viewChanged: _isViewChanged
				});
			}
		}

		/**
		 * Call this function to clear the current pinned filter in the active view
		 */
		function clearPinnedFilter() {
			let activeView = mainViewService.getCurrentView();
			delete activeView.Config.filterId;
			delete cloudDesktopSidebarService.filterRequest.pinnedFilter;
			mainViewService.saveview(null, null, true);
			onSetPinningFilter.fire({filter: null, config: activeView.Config, filterCleared: true});
		}

		/**
		 * Call this function to get the currently pinned filter in the active view
		 */
		function getPinnedFilter() {
			let activeView = mainViewService.getCurrentView();
			if (activeView && activeView.Config && activeView.Config.filterId) {
				let currentModuleName = cloudDesktopSidebarService.filterRequest.moduleName;
				return cloudDesktopBulkSearchDataService.fetchFilters(currentModuleName).then(function (filters) {
					if (filters) {
						for (let i = 0; i < filters.length; i++) {
							if (filters[i].id === activeView.Config.filterId) {
								if (cloudDesktopSidebarService.filterRequest.pinnedFilter !== filters[i]) {
									cloudDesktopSidebarService.filterRequest.pinnedFilter = filters[i];
								}
								return filters[i];
							}
						}
					}
				});
			}
			return $q.when(null);
		}

		// all method support by this service listed here
		return {
			// events
			onSetPinningFilter: onSetPinningFilter,
			onClearPinningFilter: onClearPinningFilter,
			// other functions
			clearPinnedFilter: clearPinnedFilter,
			getPinnedFilter: getPinnedFilter,
			setPinningFilter: setPinningFilter,
			getCurrentViewConfig: getCurrentViewConfig
		};
	}
})(angular);
