(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.ticketsystem';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementTicketsystemController',
		['$scope', 'cloudDesktopInfoService', 'platformTranslateService', 'platformNavBarService', '$translate', 'basicsReportingSidebarService',
			'cloudDesktopSidebarService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, cloudDesktopInfoService, platformTranslateService,
				platformNavBarService, $translate, basicReportingSidebarService,
				cloudDesktopSidebarService) {

				platformTranslateService.registerModule(['cloud.common', 'procurement.common', 'basics.material']);

				basicReportingSidebarService.registerModule(moduleName);

				var loadTranslations = function () {
					cloudDesktopInfoService.updateModuleInfo($translate.instant('procurement.ticketsystem.moduleName'));
				};

				platformTranslateService.translationChanged.register(loadTranslations);

				// Remove the unnecessary default buttons
				platformNavBarService.removeActions(['prev', 'next', 'save', 'refresh', 'first', 'last', 'discard']);

				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule(moduleName)) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				// Watch list should be removed for it is not common sense in module ticket system.
				cloudDesktopSidebarService.showHideButtons([{
					sidebarId: cloudDesktopSidebarService.getSidebarIds().watchlist, active: false
				}]);

				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					platformNavBarService.clearActions();
					basicReportingSidebarService.unregisterModule();
				});
			}]);
})(angular);
