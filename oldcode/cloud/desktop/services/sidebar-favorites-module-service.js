(() => {
	'use strict';

	angular.module('cloud.desktop').factory('cloudDesktopSidebarFavoritesModuleService', cloudDesktopSidebarFavoritesModuleService);

	cloudDesktopSidebarFavoritesModuleService.$inject = ['cloudDesktopSidebarFavoritesService', 'platformDialogService', 'platformModuleNavigationService', 'cloudDesktopSidebarService', '$state'];

	function cloudDesktopSidebarFavoritesModuleService(cloudDesktopSidebarFavoritesService, platformDialogService, platformModuleNavigationService, cloudDesktopSidebarService, $state) { // jshint ignore:line
		let service = {};
		let lastCallingToken = null;

		service.doNavigate = function(favType, objectId, projectId) {
			if (!_.isUndefined(favType)) {
				let favTypeInfo = cloudDesktopSidebarFavoritesService.favtypeInfo[favType];
				if (favTypeInfo.moduleName) {
					let navOptions = {
						moduleName: favTypeInfo.moduleName,
						objectId: objectId,
						furtherFilters: favTypeInfo.furtherFilters,
						naviServiceConnector: favTypeInfo.naviServiceConnector
					};
					navOptions.projectContextId = (favTypeInfo.projectContext) ? projectId : undefined;
					service.onNavigateToObject(navOptions);
				} else {
					platformDialogService.showErrorBox('There is no module defined...', 'Navigation Error');
				}
			}
		};

		service.onNavigateToObject = function(navOptions) {
			var url = globals.defaultState + '.' + navOptions.moduleName.replace('.', '');

			if (navOptions.naviServiceConnector) {
				var currentCallingToken = {};
				lastCallingToken = currentCallingToken;
				navOptions.naviServiceConnector.retrieveItem(navOptions.objectId, navOptions.projectContextId).then(function (item) {
					if (lastCallingToken !== currentCallingToken) {
						return;
					} else {
						lastCallingToken = null;
					}

					let navigator = platformModuleNavigationService.getNavigator(navOptions.moduleName);
					platformModuleNavigationService.navigate(navigator, item);
				});
				return;
			}

			var furtherFilters;
			if (navOptions.furtherFilters) { // map key into Value of furtherFilters
				navOptions.furtherFilters.Value = navOptions.objectId;
				furtherFilters = [navOptions.furtherFilters];
			}

			if (_.startsWith($state.current.name, url)) {
				cloudDesktopSidebarService.filterSearchFromPKeys([navOptions.objectId], furtherFilters, navOptions.projectContextId);
			} else {
				try {
					// first setup StartupFilter since checkStartupFilter() will be called in main controller
					cloudDesktopSidebarService.setStartupFilter({filter: [navOptions.objectId], furtherFilter: furtherFilters, projectContextId: navOptions.projectContextId});
					$state.go(url).then(function () {
						// platformContextService.setApplicationValue('cloud.desktop.StartupParameter', {filter: [navOptions.proxy.ObjectId]});
					});
				} catch (ex) {
					cloudDesktopSidebarService.removeStartupFilter();
					throw new Error('Navigate to module ' + url + ' failed');
				}
			}
		};

		return service;
	}
})();