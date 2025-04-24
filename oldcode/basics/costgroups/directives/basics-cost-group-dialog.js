/**
 * Created by wui on 6/25/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).directive('basicsCostGroupDialog', ['BasicsLookupdataLookupDirectiveDefinition','basicsLookupdataLookupDataService',
		function (BasicsLookupdataLookupDirectiveDefinition,basicsLookupdataLookupDataService) {
			var defaults = {
				version: 3,
				lookupType: 'CostGroup',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogUuid: '968e5382110b4e20afd65731515986ee',
				uuid: 'bbe20e06f1649e0a93cec6cfd1d2d7e2',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						width: 180,
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 300,
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'qty',
						field: 'Quantity',
						name: 'Quantity',
						width: 120,
						toolTip: 'Quantity',
						formatter: 'quantity',
						name$tr$: 'cloud.common.entityQuantity'
					},
					{
						id: 'UomFk',
						field: 'UomFk',
						name: 'Uom',
						width: 50,
						name$tr$: 'basics.costcodes.uoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}
				],
				width: 660,
				height: 200,
				treeOptions: {
					parentProp: 'CostGroupFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				title: {name: 'Cost Group', name$tr$: 'basics.costgroups.costGroup'},
				// todo : DEV-4617 - Assignment of CostGroup Elements only on last level possible.
				// selectableCallback : function selectableCallback(selectedItem) {
				// if ($rootScope.currentModule === 'estimate.main') {
				// return !selectedItem.HasChildren;
				// } else {
				// return true;
				// }
				// }
			};
			var providerInfo = defaults;
			let lookupService = basicsLookupdataLookupDataService.registerDataProviderByType('basicscostgrouplookup');
			lookupService.resolveStringValue = function (value, formatterOptions){
				let filterParams = null;
				if (formatterOptions.filterKey) {
					const filter = lookupFilterService.getFilterByKey(formatterOptions.filterKey);
					if (filter && filter.serverSide) {
						filterParams = filter.fn(estimateMainService.getSelected());
					}
				}
				return lookupService.getSearchList({
					SearchFields: ['Code'],
					SearchText: value,
					FilterKey: formatterOptions.filterKey,
					AdditionalParameters: filterParams,
					TreeState: {
						StartId: null,
						Depth: null
					},
					RequirePaging: false
				})
					.then((result) => {
						if (result && result.items && result.items.length) {
							return {
								apply: true,
								valid: true,
								value: result.items[0].Id
							};
						}

						return {
							apply: true,
							valid: false,
							value: value,
							error: 'not found!'
						};
					});
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})(angular);