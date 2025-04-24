/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'model.evaluation';

	/**
	 * @ngdoc controller
	 * @name modelEvaluationRuleset2ModuleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model evaluation ruleset-to-module entities.
	 **/
	angular.module(moduleName).controller('modelEvaluationRuleset2ModuleDetailController', ModelEvaluationRuleset2ModuleDetailController);

	ModelEvaluationRuleset2ModuleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelEvaluationRuleset2ModuleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '34a949c6c1b24e8d9e7101e3546abe56');
	}

})(angular);