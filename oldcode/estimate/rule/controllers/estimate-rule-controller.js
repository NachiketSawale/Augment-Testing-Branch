/**
 * Created by zos on 3/21/2016.
 */

(function () {

	'use strict';
	/* global globals */
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc controller
	 * @name estimateRuleController
	 * @function
	 *
	 * @description
	 * Main controller for the estimate.rule module
	 **/

	angular.module(moduleName).controller('estimateRuleController',
		['$scope','$translate', 'cloudDesktopInfoService', 'estimateRuleService', 'estimateRuleTranslationService', 'platformMainControllerService',
			function ($scope, $translate, cloudDesktopInfoService, estimateRuleService, estimateRuleTranslationService, platformMainControllerService) {
				$scope.path = globals.appBaseUrl;

				cloudDesktopInfoService.updateModuleInfo($translate.instant('cloud.desktop.moduleDisplayNameRuleDefinitionMaster'));

				let options = { search: true };
				let reports = platformMainControllerService.registerCompletely($scope, estimateRuleService, {}, estimateRuleTranslationService, moduleName, options);

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(estimateRuleService, reports, estimateRuleTranslationService, options);
				});
			}
		]);
})();
