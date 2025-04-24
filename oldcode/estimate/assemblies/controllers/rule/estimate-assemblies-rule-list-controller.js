/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.assemblies';


	angular.module(moduleName).controller('estimateAssembliesRuleListController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateRuleValidationService','estimateAssembliesRuleClipboardService',
			'estimateRuleScriptDataService','estimateAssembliesRuleService','estimateAssembliesRuleConfigrationService',
			function ($scope, $injector, platformGridAPI, platformGridControllerService, estimateRuleValidationService, estimateAssembliesRuleClipboardService,
				estimateRuleScriptDataService,estimateAssembliesRuleService,estimateAssembliesRuleConfigrationService) {

				let gridConfig = {
					parentProp: 'EstRuleFk',
					childProp: 'EstRules',
					childSort: true,
					type: 'estRuleAssemblyItems',
					dragDropService: estimateAssembliesRuleClipboardService
				};
				estimateAssembliesRuleService.setIsForEstimate(true);
				platformGridControllerService.initListController($scope, estimateAssembliesRuleConfigrationService, estimateAssembliesRuleService, estimateRuleValidationService, gridConfig);

				// remove create , delete and deepcopy buttons.
				_.remove($scope.tools.items, function (item) {
					return item.id === 'create' || item.id === 'delete' || item.id === 'createChild' || item.id === 'createDeepCopy';
				});
			}
		]);
})();
