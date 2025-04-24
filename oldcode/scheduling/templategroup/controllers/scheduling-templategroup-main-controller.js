/**
 * Created by leo on 17.11.2014.
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'scheduling.templategroup';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplategroupController
	 * @function
	 *
	 * @description
	 * Main controller for the scheduling.template module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingTemplategroupController', ['$scope', 'schedulingTemplateGrpEditService', 'platformNavBarService', 'schedulingTemplateTranslationService', 'platformMainControllerService',
		function ($scope, schedulingTemplateGrpEditService, platformNavBarService, schedulingTemplateTranslationService, platformMainControllerService) {

			$scope.path = globals.appBaseUrl;

			var options = {search: true, reports: false};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, schedulingTemplateGrpEditService, configObject, schedulingTemplateTranslationService, globals.appBaseUrl + moduleName, options);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				schedulingTemplateTranslationService.unregisterUpdates();
				platformNavBarService.clearActions();
				platformMainControllerService.unregisterCompletely(schedulingTemplateGrpEditService, sidebarReports, schedulingTemplateTranslationService, options);
			});
		}
	]);
})();
