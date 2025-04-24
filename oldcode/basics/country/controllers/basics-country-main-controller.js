(function (angular) {
	/* global globals */

	'use strict';

	angular.module('basics.country').controller('basicsCountryController',['$scope','platformMainControllerService', 'basicsCountryMainService', 'platformNavBarService', 'basicsCountryTranslationService',
		function ($scope,platformMainControllerService, basicsCountryMainService, platformNavBarService, basicsCountryTranslationService){
			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true , auditTrail: '7f835783fd9d416caa24276802cc068f'};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsCountryMainService, configObject, basicsCountryTranslationService, 'basics.country', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsCountryTranslationService.getTranslate();
			}
			// register translation changed event
			basicsCountryTranslationService.registerUpdates(loadTranslations);
			// React on changes of the specification only in case of a change

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsCountryTranslationService.unregisterUpdates();

				//platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(basicsCountryMainService, sidebarReports, basicsCountryTranslationService, options);
			});
		}
	]);
})(angular);
