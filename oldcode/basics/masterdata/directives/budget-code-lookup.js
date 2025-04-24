( function (angular) {
	'use strict';

	angular.module('basics.masterdata').directive('basicsMasterDataContextBudgetCodeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'BudgetCode',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'ef091045edd74d5ebc82f17a71295397',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' }
				],
				treeOptions: {
					parentProp: 'BudgetCodeParentFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular);