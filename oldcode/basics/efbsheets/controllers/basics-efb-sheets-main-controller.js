/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	angular.module('basics.efbsheets').controller('basicsEfbsheetsController',['$scope','platformMainControllerService', 'basicsEfbsheetsMainService',
		'platformNavBarService', 'basicsEfbsheetsTranslationService',
		function ($scope,platformMainControllerService, basicsEfbsheetsMainService, platformNavBarService, basicsEfbsheetsTranslationService){

			$scope.path = globals.appBaseUrl;

			let options = { search: true, reports: true };
			let configObject = {};
			let sidebarReports = platformMainControllerService.registerCompletely($scope, basicsEfbsheetsMainService, configObject, basicsEfbsheetsTranslationService, 'basics.efbsheets', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsEfbsheetsTranslationService.getTranslate();
			}
			// register translation changed event
			basicsEfbsheetsTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsEfbsheetsTranslationService.unregisterUpdates();
				platformMainControllerService.unregisterCompletely(basicsEfbsheetsMainService, sidebarReports, basicsEfbsheetsTranslationService, options);
			});
		}
	]);
})();
