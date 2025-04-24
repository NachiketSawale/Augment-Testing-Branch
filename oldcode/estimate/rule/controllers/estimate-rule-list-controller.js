/**
 * Created by joshi on 25.11.2015.
 */

(function () {

	'use strict';
	/* global _, $ */
	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc controller
	 * @name estimateRuleListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of estimate rule entities.
	 **/
	angular.module(moduleName).controller('estimateRuleListController',
		['$scope','platformGridControllerService', 'estimateRuleService', 'estimateRuleStandardConfigurationService', 'estimateRuleValidationService', 'estimateRuleClipboardService','estimateRuleScriptDataService',
			function ($scope,platformGridControllerService, estimateRuleService, estimateRuleConfigurationService, estimateRuleValidationService, estimateRuleClipboardService, estimateRuleScriptDataService) {

				let gridConfig = {
					parentProp: 'EstRuleFk',
					childProp: 'EstRules',
					childSort: true,
					type: 'rule',
					dragDropService: estimateRuleClipboardService
				};
				platformGridControllerService.initListController($scope, estimateRuleConfigurationService, estimateRuleService, estimateRuleValidationService, gridConfig);

				function onFocused(cmState) {
					if(cmState && !cmState.focused){
						$('div.selected.indicator').addClass('edit');
					}
					else{
						$('div > .edit').removeClass('edit');
					}
				}

				estimateRuleService.getGridId($scope.gridId);

				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && item.id !== 't14';
				});

				estimateRuleScriptDataService.onFocused.register(onFocused);

				function onMultipleSelectionChangedFn(flag){
					$scope.isLoading = flag;
				}

				estimateRuleService.onMultipleSelectionChanged.register(onMultipleSelectionChangedFn);

				$scope.$on('$destroy', function(){
					estimateRuleScriptDataService.onFocused.unregister(onFocused);
					estimateRuleService.onMultipleSelectionChanged.unregister(onMultipleSelectionChangedFn);
				});
			}
		]);
})();
