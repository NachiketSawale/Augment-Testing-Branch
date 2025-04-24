/**
 * Created by joshi on 25.10.2016.
 */
/*global angular */
(function (angular) {

	'use strict';

	var moduleName = 'project.structures';
	/**
	 * @ngdoc controller
	 * @name projectStructturesMainController
	 * @description main controller for the project structures
	 */

	angular.module(moduleName).controller('projectStructturesMainController', ['$scope', 'projectStructuresMainService', 'platformNavBarService', 'projectMainTranslationService', 'platformMainControllerService',

		function ($scope, projectStructuresMainService, platformNavBarService, projectMainTranslationService, platformMainControllerService) {

			$scope.path = globals.appBaseUrl;
			var options = { search: true, reports: false };
			var sidebarReports = platformMainControllerService.registerCompletely($scope, projectStructuresMainService, {}, projectMainTranslationService, globals.appBaseUrl + moduleName, options);
			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformMainControllerService.unregisterCompletely(projectStructuresMainService, sidebarReports, projectMainTranslationService, options);
			});
		}
	]);
})(angular);