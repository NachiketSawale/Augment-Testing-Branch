(function () {
	/* global globals */
	'use strict';

	var moduleName = 'basics.unit';

	/**
	 * @ngdoc controller
	 * @name basicsUnitMainController
	 * @function
	 *
	 * @description
	 * Main controller for the basics.Unit module
	 **/

	angular.module(moduleName).controller('basicsUnitController', ['$scope', 'basicsUnitMainService', 'basicsUnitTranslationService', 'platformNavBarService', 'platformModalService','platformMainControllerService','basicsUnitSidebarWizardService',

		function ($scope, basicsUnitMainService, basicsUnitTranslationService ,platformNavBarService, platformModalService,platformMainControllerService, basicsUnitSidebarWizardService) {

			$scope.path = globals.appBaseUrl;

			var options = { search: true, reports: true , auditTrail: '07cd3931cf4c49778973ad87a71925d9'};
			var configObject = {};
			var sidebarReports = platformMainControllerService.registerCompletely($scope, basicsUnitMainService, configObject, basicsUnitTranslationService, moduleName, options);

			function doRefresh() {
				if (basicsUnitMainService.isModelChanged()) {
					var modalOptions = {
						headerTextKey: 'platform.refreshConfirmHeader',
						bodyTextKey: 'Save changes before reloading?',
						showYesButton: true,
						showNoButton: true,
						showCancelButton: true,
						iconClass: 'ico-question'
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.yes) {
							basicsUnitMainService.update().then(function () {
								basicsUnitMainService.refresh();
							});
						}
						if (result.no) {
							basicsUnitMainService.refresh();
						}
					});
				}
				else {
					basicsUnitMainService.refresh();
				}
			}

			$scope.translate = {};


			// set nav bar default actions
			platformNavBarService.getActionByKey('prev').fn = basicsUnitMainService.goToPrev;
			platformNavBarService.getActionByKey('next').fn = basicsUnitMainService.goToNext;
			platformNavBarService.getActionByKey('save').fn = basicsUnitMainService.update;
			platformNavBarService.getActionByKey('refresh').fn = doRefresh;

			// loads or updates translated strings
			function loadTranslations() {
				$scope.translate = basicsUnitTranslationService.getTranslate();
			}

			// register wizard
			basicsUnitSidebarWizardService.activate();

			// register translation changed event
			basicsUnitTranslationService.registerUpdates(loadTranslations);

			// trigger preload after sidebar filter request is initialized
			basicsUnitMainService.preloadData();

			// un-register on destroy
			$scope.$on('$destroy', function () {
				basicsUnitTranslationService.unregisterUpdates();
				basicsUnitSidebarWizardService.deactivate();
				platformMainControllerService.unregisterCompletely(basicsUnitMainService, sidebarReports, basicsUnitTranslationService, options);
			});
		}
	]);
})();
