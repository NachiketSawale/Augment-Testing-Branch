/**
 * Created by anl on 1/9/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).directive('productionplanningItemItemLookupDialog', ItemLookupDialog);

	ItemLookupDialog.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ItemLookupDialog(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'PPSItem',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: '9f3f15ec583e45c3af5f3ed9907e15ad',
			columns: [
				{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'Description',
					field: 'DescriptionInfo.Translated',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				}

			],
			treeOptions: {
				parentProp: 'PPSItemFk',
				childProp: 'ChildItems',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			},
			width: 500,
			height: 200,
			version: 3
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);