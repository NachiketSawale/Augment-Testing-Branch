/*
 * $Id: mtwo-aiconfiguration-controller.js 627575 2021-03-15 06:14:44Z chd $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).controller('mtwoAiconfigurationController', MtwoAIConfigurationController);

	MtwoAIConfigurationController.$inject = ['$scope', 'platformMainControllerService', 'mtwoAIConfigurationModelListDataService', 'mtwoAIConfigurationTranslationService'];

	function MtwoAIConfigurationController($scope, platformMainControllerService, mtwoAIConfigurationModelListDataService, mtwoAIConfigurationTranslationService) {
		$scope.path = globals.appBaseUrl;
		let opt = {search: true, reports: false, wizards: true};
		let mc = {};
		let sidebarReports = platformMainControllerService.registerCompletely($scope, mtwoAIConfigurationModelListDataService, mc, mtwoAIConfigurationTranslationService, moduleName, opt);

		// loads or updates translated strings
		function loadTranslations() {
			$scope.translate = mtwoAIConfigurationTranslationService.getTranslate();
		}

		// register translation changed event
		mtwoAIConfigurationTranslationService.registerUpdates(loadTranslations);

		$scope.$on('$destroy', function () {
			mtwoAIConfigurationTranslationService.unregisterUpdates();
			platformMainControllerService.unregisterCompletely(mtwoAIConfigurationModelListDataService, sidebarReports, mtwoAIConfigurationTranslationService, opt);
		});
	}
})(angular);
