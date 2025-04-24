(function () {
	/* global */
	'use strict';
	var moduleName = 'boq.wic';

	angular.module(moduleName).controller('boqWicController',
		['$scope', 'platformMainControllerService', 'boqWicGroupService', 'boqWicTranslationService', 'boqMainService', 'boqMainLookupFilterService',
			function ($scope, platformMainControllerService, boqWicGroupService, boqWicTranslationService, boqMainService, boqMainLookupFilterService) {
				var opt = {search: false},
					mc = {},
					sidebarReports = platformMainControllerService.registerCompletely($scope, boqWicGroupService, mc, boqWicTranslationService, moduleName, opt);

				boqMainLookupFilterService.setTargetBoqMainService(boqMainService);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(boqWicGroupService, sidebarReports, boqWicTranslationService, opt);
					boqMainLookupFilterService.setTargetBoqMainService(null);
				});
			}
		]);
})();