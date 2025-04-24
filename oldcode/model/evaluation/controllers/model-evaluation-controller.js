/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	
	const moduleName = 'model.evaluation';

	angular.module(moduleName).controller('modelEvaluationController',
		ModelEvaluationController);

	ModelEvaluationController.$inject = ['$scope', 'platformMainControllerService',
		'modelEvaluationRulesetDataService', 'modelEvaluationTranslationService'];

	function ModelEvaluationController($scope, platformMainControllerService,
		modelEvaluationRulesetDataService, modelEvaluationTranslationService) {

		$scope.path = globals.appBaseUrl;
		const opt = {search: true, reports: true};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelEvaluationRulesetDataService, mc, modelEvaluationTranslationService, moduleName, opt);

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(modelEvaluationRulesetDataService, sidebarReports, modelEvaluationTranslationService, opt);
		});
	}
})(angular);
