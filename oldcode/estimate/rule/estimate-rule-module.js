/**
 * Created by joshi on 25.11.2015.
 */

(function () {
	'use strict';
	/* global globals, _ */

	let moduleName = 'estimate.rule';
	angular.module(moduleName, ['ui.router', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap', 'platform']);
	globals.modules.push(moduleName);

	/**
	 * @ngdoc module
	 * @name estimate.rule
	 * @description
	 * Module definition of the estimate module
	 **/
	angular.module(moduleName).config(['mainViewServiceProvider',
		function (mainViewServiceProvider) {
			let options = {
				'moduleName': moduleName,
				'resolve': {
					'loadDomains': ['platformSchemaService', function (platformSchemaService) {

						platformSchemaService.initialize();

						return platformSchemaService.getSchemas([
							{typeName: 'PrjEstRuleDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstRuleDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstRuleParamDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstRuleScriptDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'PrjEstRuleScriptDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'PrjEstRuleParamDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'EstRuleParamValueDto', moduleSubModule: 'Estimate.Rule'},
							{typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'}
						]);
					}],
					'loadLookup': ['basicsLookupdataLookupDefinitionService', function (basicsLookupdataLookupDefinitionService) {
						return basicsLookupdataLookupDefinitionService.load([
							'estimateRuleSequenceLookup'
						]);
					}],
					'loadSequenceLookupData': ['estimateRuleSequenceLookupService', function (estimateRuleSequenceLookupService) {
						return estimateRuleSequenceLookupService.getListAsync();
					}]
				}
			};

			mainViewServiceProvider.registerModule(options);
		}
	]).run(['$injector', 'platformModuleNavigationService', '$timeout',
		function ($injector, platformModuleNavigationService, $timeout) {
			platformModuleNavigationService.registerNavigationEndpoint(
				{
					moduleName: moduleName + '-script',
					navFunc: function (item, triggerField) {
						let ruleService = $injector.get('estimateRuleService');
						let estimateCommonNavigationService = $injector.get('estimateCommonNavigationService');
						let rules = ruleService.getList();
						if (_.isEmpty(rules)) {
							ruleService.load().then(navToRule);
						} else {
							navToRule(item, triggerField);
						}

						function navToRule() {
							let ruleViews = ['1', '5'];
							let ruleSelected = _.find(rules, {Code: triggerField.Code});
							if (ruleSelected) {
								ruleService.setSelected(ruleSelected);
								if (ruleService.isSelection(ruleSelected)) {
									estimateCommonNavigationService.navToRuleScript(ruleSelected, 1377, '1', ruleViews, 'estimate.rule.script');
								}
							} else {
								// not found nav rule in the current page(the first pageNumber rules or the rules cache without unknown pageNumber)
								// this navigator rule maybe in other page number rules
								ruleService.setInitReadData(triggerField.Code);
								ruleService.load().then(function () {
									ruleService.removeInitReadData();

									// if nav from estimate.main module
									let ruleToSelect = _.find(rules, {Code: triggerField.Code});
									ruleService.setSelected(ruleToSelect);
									$timeout(function () {
										estimateCommonNavigationService.navToRuleScript(ruleSelected, 1377, '1', ruleViews, 'estimate.rule.script');
									}, 251);
								});
							}
						}
					}
				}
			);
		}]);
})();
