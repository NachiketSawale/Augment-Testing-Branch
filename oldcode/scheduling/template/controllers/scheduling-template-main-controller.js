/**
 * Created by leo on 17.11.2014.
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateMainController
	 * @function
	 *
	 * @description
	 * Main controller for the scheduling.template module
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateController',
		['$scope', 'schedulingTemplateActivityTemplateService', 'platformNavBarService', 'schedulingTemplateTranslationService',
			'platformMainControllerService', 'schedulingTemplateActivityCriteriaCostGroupService',
			function ($scope, schedulingTemplateActivityTemplateService, platformNavBarService, schedulingTemplateTranslationService, platformMainControllerService, schedulingTemplateActivityCriteriaCostGroupService) {

				$scope.path = globals.appBaseUrl;

				var options = {search: true, reports: false};
				var configObject = {};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, schedulingTemplateActivityTemplateService, configObject, schedulingTemplateTranslationService, globals.appBaseUrl + moduleName, options);

				schedulingTemplateActivityCriteriaCostGroupService.init();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					schedulingTemplateTranslationService.unregisterUpdates();
					platformNavBarService.clearActions();
					platformMainControllerService.unregisterCompletely(schedulingTemplateActivityTemplateService, sidebarReports, schedulingTemplateTranslationService, options);
				});
			}
		]);

})();
