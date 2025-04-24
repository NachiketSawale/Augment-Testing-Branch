/*
 * Created by alm on 08.31.2020.
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.taxcode';
	angular.module(moduleName).controller('basicsTaxcodeController', ['$scope', 'platformMainControllerService', 'basicsTaxCodeMainService',
		'platformNavBarService', 'basicsTaxCodeTranslationService',
		function ($scope, platformMainControllerService, basicsTaxCodeMainService, platformNavBarService, basicsTaxCodeTranslationService) {

			$scope.path = globals.appBaseUrl;

			var options = {search: true, reports: true};

			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsTaxCodeMainService, {}, basicsTaxCodeTranslationService, moduleName, options);


			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(basicsTaxCodeMainService, sidebarReports, basicsTaxCodeTranslationService, options);
			});
		}
	]);
})(angular);
