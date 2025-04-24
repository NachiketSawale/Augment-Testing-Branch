(function () {
	/* global globals */

	'use strict';

	angular.module('basics.controllingcostcodes').controller('basicsControllingcostcodesController',['$scope','platformMainControllerService', 'basicsControllingCostCodesMainService',
		'platformNavBarService', 'basicsControllingCostCodesTranslationService',
		function ($scope,platformMainControllerService, basicsControllingCostCodesMainService,
			platformNavBarService, basicsControllingCostCodesTranslationService){
			$scope.path = globals.appBaseUrl;

			let options = { search: true, reports: true };
			let configObject = {};
			let sidebarReports = platformMainControllerService.registerCompletely($scope, basicsControllingCostCodesMainService, configObject, basicsControllingCostCodesTranslationService, 'basics.controllingcostcodes', options);

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsControllingCostCodesTranslationService.getTranslate();
			}
			// register translation changed event
			basicsControllingCostCodesTranslationService.registerUpdates(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsControllingCostCodesTranslationService.unregisterUpdates();
				platformMainControllerService.unregisterCompletely(basicsControllingCostCodesMainService, sidebarReports, basicsControllingCostCodesTranslationService, options);
			});
		}
	]);
})();
