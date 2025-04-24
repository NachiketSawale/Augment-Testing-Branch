/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	/* global _ */
	const moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainRuleListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project estimate rule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateMainRuleListController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainRuleDataService', 'estimateMainRuleConfigurationService', 'estimateRuleValidationService','estimateMainClipboardService', 'platformModuleNavigationService', 'estimateMainService',

			function ($scope, $injector, platformGridAPI, platformGridControllerService, ruleDataService, estimateMainRuleConfigurationService, estimateRuleValidationService, estimateMainClipboardService, naviService, estimateMainService) {
				let gridConfig = {
					parentProp : 'CustomEstRuleFk',
					childProp : 'CustomEstRules',
					childSort: true,
					grouping : true,
					type: 'estimateRules',
					dragDropService: estimateMainClipboardService
				};

				platformGridControllerService.initListController($scope, estimateMainRuleConfigurationService, ruleDataService, estimateRuleValidationService, gridConfig);

				let bulkEditorItem = _.find($scope.tools.items, {'id' : 't14'});
				if(bulkEditorItem){
					bulkEditorItem.disabled();
				}

				function navigateToRuleScript() {
					let ruleSelected = ruleDataService.getSelected();
					let navigator = null;
					if (ruleSelected.IsPrjRule){
						navigator = naviService.getNavigator('project.main-estimate-rule-script');
					}else{
						navigator = naviService.getNavigator('estimate.rule-script');
					}
					naviService.navigate(navigator, null, ruleSelected);
				}

				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && item.id !== 't14';
				});

				ruleDataService.init();

				function refresh(){
					ruleDataService.clearCache();
					ruleDataService.init();
				}

				platformGridAPI.events.register($scope.gridId, 'onDblClick', navigateToRuleScript);
				estimateMainService.registerRefreshRequested(refresh);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onDblClick', navigateToRuleScript);
					estimateMainService.unregisterRefreshRequested(refresh);
				
				});
			}
		]);
})();
