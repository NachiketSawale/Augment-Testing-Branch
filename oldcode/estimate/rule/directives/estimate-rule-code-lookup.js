/**
 * Created by joshi on 17.12.2015.
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';

	/**
	 * @ngdoc directive
	 * @name estimateRuleCodeLookup
	 * @requires  estimateRuleCodeLookupService
	 * @description dropdown lookup grid to display the estimate rule
	 */
	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('estimateRuleCodeLookup',['$http', 'basicsCustomizeRuleIconService', 'BasicsLookupdataLookupDirectiveDefinition', 'estimateRuleCodeLookupService','estimateProjectEstimateRulesService',
		function ($http, basicsCustomizeRuleIconService, BasicsLookupdataLookupDirectiveDefinition, estimateRuleCodeLookupService, estimateProjectEstimateRulesService) {
			let defaults = {
				lookupType: 'estruleitems',
				valueMember: 'Code',
				displayMember: 'Code',
				uuid: 'c57ed35ae54f48e695e4772cf9c9c329',
				columns:[
					{ id: 'code', field: 'Code', name: 'Code', width: 70, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode'},
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description',  width: 120, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription' }
				],
				treeOptions: {
					parentProp: 'EstRuleFk',
					childProp: 'EstRules',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				events: [
					{
						name: 'onSelectedItemChanged', // register event and event handler here.
						handler: function (e, args) {
							let item = args.entity;
							let lookupItem = args.selectedItem;
							item.DescriptionInfo = lookupItem.DescriptionInfo;
							item.Icon = lookupItem.Icon;
							item.Comment = lookupItem.Comment;
							estimateProjectEstimateRulesService.markItemAsModified(item);
						}
					}
				]
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
				dataProvider: {
					myUniqueIdentifier: 'EstimateRuleLookupDataHandler',

					processData: function (dataList) {
						// for (let i = 0; i < dataList.length; ++i) {
						// boqMainImageProcessor.processItem(dataList[i]);
						// }
						return dataList;
					},

					getList: function () {
						return estimateRuleCodeLookupService.getListAsync();
					},

					getItemByKey: function (value) {
						return estimateRuleCodeLookupService.getItemByIdAsync(value);
					},

					getDisplayItem: function (value) {
						return estimateRuleCodeLookupService.getItemByIdAsync(value);
					}
				}
			});
		}]);
})(angular);
