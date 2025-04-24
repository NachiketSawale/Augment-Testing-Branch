(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataPrjCostGroup5Dialog',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'ProjectCostGroup5',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: '192f43750ffe4aeeb00929e22cd098d3',
					columns: [
						{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
						{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation', name$tr$: 'cloud.common.entityDescription' },
						{ id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'number', name$tr$: 'cloud.common.entityQuantity'},
						{ id: 'qtyuom', field: 'UoMFk', name: 'UomFk', width: 120, toolTip: 'QuantityUoM', name$tr$: 'cloud.common.entityUoM', formatter: 'lookup',
							formatterOptions: {lookupType: 'uom', displayMember: 'Unit'	}}
					],
					width: 660,
					height: 200,
					treeOptions: {
						parentProp: 'CostGroupParentFk',
						childProp: 'SubGroups',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true
					},
					title: { name: 'Project Cost Group5', name$tr$: 'cloud.common.dialogTitlePrjCostGroup5' },
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						var searchString = '(Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%"))';
						return searchString.replace(/%SEARCH%/g, searchValue);
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
			}
		]);
})(angular);