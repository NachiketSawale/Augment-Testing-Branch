/**
 * Created by joshi on 25.11.2015.
 */

(function () {

	'use strict';
	/* global _ */
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc controller
	 * @name estimateRuleComboListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of project estimate rule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateRuleComboListController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateRuleComboService', 'estimateRuleComboConfigurationService', 'estimateRuleValidationService','estimateMainClipboardService', 'platformModuleNavigationService',

			function ($scope, $injector, platformGridAPI, platformGridControllerService, estimateRuleComboService, estimateRuleComboConfigurationService, estimateRuleValidationService, estimateMainClipboardService, naviService) {

				let gridConfig = {
					parentProp : 'CustomEstRuleFk',
					childProp : 'CustomEstRules',
					childSort: true,
					grouping : true,
					type: 'estimateRules',
					dragDropService: estimateMainClipboardService
				};

				platformGridControllerService.initListController($scope, estimateRuleComboConfigurationService, estimateRuleComboService, estimateRuleValidationService, gridConfig);

				let bulkEditorItem = _.find($scope.tools.items, {'id' : 't14'});
				if(bulkEditorItem){
					bulkEditorItem.disabled();
				}

				let lookupService = $injector.get('estimateRuleComplexLookupService');
				if(lookupService){
					lookupService.loadLookupData().then(function(rules){
						estimateRuleComboService.updateItemList(rules);
					});
				}

				function navigateToRuleScript() {
					let ruleSelected = estimateRuleComboService.getSelected();
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

				platformGridAPI.events.register($scope.gridId, 'onDblClick', navigateToRuleScript);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onDblClick', navigateToRuleScript);
				});
			}
		]);
})();
