
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.assembly';
	/**
	 * @ngdoc controller
	 * @name projectAssemblyMainController
	 * @description main controller for the project assembly
	 */

	angular.module(moduleName).controller('projectAssemblyMainController', ['$scope', 'projectAssemblyMainService', 'platformNavBarService', 'projectAssemblyTranslationService', 'platformMainControllerService',

		function ($scope, projectAssemblyMainService, platformNavBarService, projectAssemblyTranslationService, platformMainControllerService) {

			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: false };
			var sidebarReports = platformMainControllerService.registerCompletely($scope, projectAssemblyMainService, {}, projectAssemblyTranslationService, globals.appBaseUrl + moduleName, options);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(projectAssemblyMainService, sidebarReports, projectAssemblyTranslationService, options);
			});
		}
	]);
})(angular);