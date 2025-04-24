/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'controlling.revrecognition';

	angular.module(moduleName).controller('controllingRevrecognitionController',
		['$scope', 'globals', 'platformNavBarService', 'platformMainControllerService', 'controllingRevenueRecognitionHeaderDataService', 'controllingRevenueRecognitionItemService','controllingRevenueRecognitionE2cItemService',
			'controllingRevenueRecognitionTranslationService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, globals, platformNavBarService, platformMainControllerService, controllingRevenueRecognitionHeaderDataService, controllingRevenueRecognitionItemService,controllingRevenueRecognitionE2cItemService,
				controllingRevenueRecognitionTranslationService) {
				$scope.path = globals.appBaseUrl;
				let opt = {search: true, wizards: true, reports: true};
				let mc = {};
				let sidebarReports = platformMainControllerService.registerCompletely($scope, controllingRevenueRecognitionHeaderDataService, mc, controllingRevenueRecognitionTranslationService, moduleName, opt);

				let originalFn = platformNavBarService.getActionByKey('save').fn;
				platformNavBarService.getActionByKey('save').fn = function () {
					if (originalFn) {
						let parentHeader = controllingRevenueRecognitionHeaderDataService.getSelected();
						controllingRevenueRecognitionHeaderDataService.update().then(function(rep){
							if(parentHeader&&rep.ReloadItemFlg){
								controllingRevenueRecognitionItemService.load();
								controllingRevenueRecognitionE2cItemService.load();
							}
						});
					}
				};

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(controllingRevenueRecognitionHeaderDataService, sidebarReports, controllingRevenueRecognitionTranslationService, opt);
				});
			}]);
})();
