/**
 * Created by wui on 12/15/2015.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateRuleScriptController', [
		'$scope', 'estimateRuleScriptDataService', 'basicsCommonScriptControllerService', 'estimateRuleScriptArgService',
		function ($scope, estimateRuleScriptDataService, basicsCommonScriptControllerService, estimateRuleScriptArgService) {

			let options = {
				scriptId: 'estimate.rule.script',
				apiId: 'Estimate.Rule',
				argService: estimateRuleScriptArgService
			};

			$scope.service = estimateRuleScriptDataService;

			estimateRuleScriptArgService.setScriptId('estimate.main.script');

			basicsCommonScriptControllerService.initController($scope, options);
		}
	]);

})(angular);
