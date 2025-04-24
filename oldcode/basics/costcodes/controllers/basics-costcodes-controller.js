/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc controller
	 * @name basicsCostCodesController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.costcodes module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsCostcodesController', ['$scope', '$injector', '$translate', 'cloudDesktopInfoService',
		'platformMainControllerService', 'platformNavBarService',
		'basicsCostCodesMainService', 'basicsCostCodesTranslationService',
		'basicsCostCodesPriceVersionDataService',
		function ($scope, $injector, $translate, cloudDesktopInfoService, platformMainControllerService, platformNavBarService, basicsCostCodesMainService, basicsCostCodesTranslationService, basicsCostCodesPriceVersionDataService) {

			// Header info
			cloudDesktopInfoService.updateModuleInfo('cloud.desktop.moduleDisplayNameCostCodes');

			// register
			let options = {search: false, report: true, auditTrail: 'e2d486b73b9e4cda8a091c38eac9a762'};
			let configObject = {};
			let sidebarReports = platformMainControllerService.registerCompletely($scope, basicsCostCodesMainService, configObject, basicsCostCodesTranslationService, moduleName, options);

			function goToPrev(){
				basicsCostCodesMainService.goToPrev();
				basicsCostCodesPriceVersionDataService.goToPrev();
			}

			function goToNext(){
				basicsCostCodesMainService.goToNext();
				basicsCostCodesPriceVersionDataService.goToNext();
			}

			function goToFirst(){
				basicsCostCodesMainService.goToFirst();
				basicsCostCodesPriceVersionDataService.goToFirst();
			}

			function goToLast(){
				basicsCostCodesMainService.goToLast();
				basicsCostCodesPriceVersionDataService.goToLast();
			}

			function update(){
				basicsCostCodesMainService.update();
				basicsCostCodesPriceVersionDataService.update();
			}

			function refresh(){
				basicsCostCodesMainService.refresh();
				basicsCostCodesPriceVersionDataService.refresh();
			}

			platformNavBarService.getActionByKey('prev').fn = goToPrev;
			platformNavBarService.getActionByKey('next').fn = goToNext;
			platformNavBarService.getActionByKey('first').fn = goToFirst;
			platformNavBarService.getActionByKey('last').fn = goToLast;

			platformNavBarService.getActionByKey('save').fn = update;
			platformNavBarService.getActionByKey('refresh').fn = refresh;

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(basicsCostCodesMainService, sidebarReports, basicsCostCodesTranslationService, options);
			});
		}]);
})();