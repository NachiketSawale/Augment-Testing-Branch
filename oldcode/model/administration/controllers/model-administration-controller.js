/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.administration';

	angular.module(moduleName).controller('modelAdministrationController',
		modelAdministrationController);

	modelAdministrationController.$inject = ['$scope', 'platformMainControllerService',
		'modelAdministrationDataService', 'modelAdministrationTranslationService', 'platformNavBarService'];

	function modelAdministrationController($scope, platformMainControllerService,
		modelAdministrationDataService, modelAdministrationTranslationService, platformNavBarService) {

		$scope.path = globals.appBaseUrl;
		const opt = {search: false, reports: false};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelAdministrationDataService, mc, modelAdministrationTranslationService, moduleName, opt);

		['prev', 'next', 'first', 'last'].forEach(function (actionKey) {
			platformNavBarService.setActionDisabled(actionKey);
			platformNavBarService.setActionInVisible(actionKey);
		});

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(modelAdministrationDataService, sidebarReports, modelAdministrationTranslationService, opt);
		});
	}
})(angular);
