/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.project';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateProjectEstRuleScriptController', [
		'$scope', 'estimateProjectEstRuleScriptService', 'basicsCommonScriptControllerService', 'estimateRuleScriptArgService',
		function ($scope, estimateProjectEstRuleScriptService, basicsCommonScriptControllerService, estimateRuleScriptArgService) {

			// Define standard toolbar Icons and their function on the scope
			let options = {
				scriptId: 'project.main.script',
				apiId: 'Estimate.Rule',
				argService: estimateRuleScriptArgService
			};

			$scope.service = estimateProjectEstRuleScriptService;

			estimateRuleScriptArgService.setScriptId('project.main.script');

			basicsCommonScriptControllerService.initController($scope, options);

		}
	]);

})(angular);
