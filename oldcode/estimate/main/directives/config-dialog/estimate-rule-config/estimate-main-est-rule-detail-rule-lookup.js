/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

( function (angular) {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';
	/**
     * @ngdoc service
     * @name estimate-main-est-rule-detail-rule-lookup  estimateRuleEstRuleDetailRuleLookup
     * @function
     *
     * @description
     * lookup to show assigned estimate rules in different estimation structures with two different dropdown popup
     */
	angular.module(moduleName).directive('estimateMainEstRuleDetailRuleLookup', [
		'$injector', 'estimateRuleComplexLookupService', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateRuleComplexLookupCommonService',
		function ($injector, estimateRuleComplexLookupService, BasicsLookupdataLookupDirectiveDefinition, estimateRuleComplexLookupCommonService) {

			let defaults = {
				lookupType: 'estimateRootConfigRuleLookup',

				valueMember: 'Id',
				displayMember: 'Code',

				isClientSearch: true,
				isExactSearch: true,

				uuid: '6b39228371034eacbfa8dc75eac42cb4',
				columns: estimateRuleComplexLookupCommonService.getColumnsReadOnly(),

				isStaticGrid: true,
				treeOptions: {
					parentProp: 'EstRuleFk',
					childProp: 'EstRules',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true,
					idProperty:'Id'
				},
				title: {
					name: 'Rules',
					name$tr$: 'estimate.rule.rules'
				},
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					return searchValue;
				},
				events: [
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let ruleAssignmentParamDataService = $injector.get('estimateMainEstRuleAssignmentParamDataService');

							// clear all params data from rule selected
							let params = _.filter(ruleAssignmentParamDataService.getList(), function(param){
								return param.EstRootAssignmentDetailFk === args.item.Id;
							});
							_.forEach(params, function(param){
								ruleAssignmentParamDataService.deleteItem(param);
							});

							// reload params data from rule selected
							ruleAssignmentParamDataService.getParamsByRuleFk(args.selectedItem.Id).then(function (response) {
								let data = response.data || {};
								ruleAssignmentParamDataService.createItems(data.Main || []);
							});

						}
					}
					// {
					//     name: 'onInitialized',
					//     handler: function (/*e, args*/) {
					//         //Load lookup by lineitem context
					//         $injector.get('estimateMainEstRuleAssignRuleLookupService').reload();
					//     }
					// }
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				dataProvider: 'estimateMainEstRuleAssignRuleLookupService'
			});
		}
	]);
})(angular);
