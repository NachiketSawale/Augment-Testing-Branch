/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'estimate.main';
	/**
	 * @ngdoc controller
	 * @name
	 * * estimateMainRuleScriptController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in the Estimate rules script
	 **/
	angular.module(moduleName).controller('estimateMainRuleScriptController', [
		'$scope', 'estimateMainRuleScriptDataService', 'basicsCommonScriptControllerService', 'estimateRuleScriptArgService',
		function ($scope, estimateMainRuleScriptDataService, basicsCommonScriptControllerService, estimateRuleScriptArgService) {

			// Define standard toolbar Icons and their function on the scope
			let options = {
				scriptId: 'estimate.main.rule.script',
				apiId: 'Estimate.Rule',
				argService: estimateRuleScriptArgService
			};

			$scope.service = estimateMainRuleScriptDataService;

			estimateRuleScriptArgService.setScriptId(options.scriptId);

			basicsCommonScriptControllerService.initController($scope, options);
		}
	]);
})(angular);