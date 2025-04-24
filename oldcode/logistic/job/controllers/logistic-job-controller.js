(function () {
	/* global globals */
	/* global angular */

	'use strict';

	angular.module('logistic.job').controller('logisticJobController',['$scope','platformMainControllerService', 'logisticJobDataService',
		'platformNavBarService', 'logisticJobTranslationService', 'logisticJobDocumentsProjectService',
		function ($scope,platformMainControllerService, logisticJobDataService, 
		          platformNavBarService, logisticJobTranslationService, logisticJobDocumentsProjectService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true };
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, logisticJobDataService, configObject, logisticJobTranslationService, 'logistic.job', options);
			
			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = logisticJobTranslationService.getTranslate();
			}
			// register translation changed event
			logisticJobTranslationService.registerUpdates(loadTranslations);

			//register documents project
			logisticJobDocumentsProjectService.register();
			
			// un-register on destroy
			$scope.$on('$destroy', function () {
				logisticJobTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				logisticJobDocumentsProjectService.unRegister();
				platformMainControllerService.unregisterCompletely(logisticJobDataService, sidebarReports, logisticJobTranslationService, options);
			});
		}
	]);
})();
