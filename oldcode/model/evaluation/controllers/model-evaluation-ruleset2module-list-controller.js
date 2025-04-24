/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRuleset2ModuleListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model evaluation ruleset-to-module entities.
	 **/

	angular.module(moduleName).controller('modelEvaluationRuleset2ModuleListController', ModelEvaluationRuleset2ModuleListController);

	ModelEvaluationRuleset2ModuleListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelEvaluationRuleset2ModuleListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f1be1ca07e074f74a92e5bdde74af0b1');
	}
})(angular);