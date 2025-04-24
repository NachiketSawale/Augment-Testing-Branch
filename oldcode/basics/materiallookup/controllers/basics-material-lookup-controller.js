/**
 * Created by lja on 2015/12/22.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.materiallookup';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMateriallookupController',
		['$scope', 'cloudDesktopInfoService', 'platformTranslateService',
			'platformNavBarService', '$translate', 'cloudDesktopSidebarService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, cloudDesktopInfoService, platformTranslateService,
			          platformNavBarService, $translate, cloudDesktopSidebarService) {

				platformTranslateService.registerModule(['cloud.common', 'procurement.common', 'basics.material']);

				var loadTranslations = function () {
					cloudDesktopInfoService.updateModuleInfo($translate.instant('basics.materiallookup.moduleName'));
				};

				platformTranslateService.translationChanged.register(loadTranslations);

				//Remove the unnecessary default buttons
				platformNavBarService.removeActions(['prev', 'next', 'save', 'refresh', 'first', 'last', 'discard']);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(moduleName)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().quickStart, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().favorites, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().lastobjects, true);
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().watchlist, true);


				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					platformNavBarService.clearActions();
				});
			}]);
})(angular);