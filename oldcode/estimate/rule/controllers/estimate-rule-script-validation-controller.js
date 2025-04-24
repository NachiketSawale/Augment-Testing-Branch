/**
 * Created by wui on 2/3/2016.
 */

/**
 * Created by wui on 12/15/2015.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateRuleScriptValidationController', [
		'$scope', 'estimateRuleScriptDataService',
		function ($scope, estimateRuleScriptDataService) {

			// Define standard toolbar Icons and their function on the scope
			let toolbarItems = [];
			let scriptId = 'estimate.rule.validation';

			$scope.service = estimateRuleScriptDataService;

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems
			});

			$scope.options = {
				scriptId: scriptId,
				apiId: 'Estimate.Rule.Validate'
			};
		}
	]);

})(angular);
