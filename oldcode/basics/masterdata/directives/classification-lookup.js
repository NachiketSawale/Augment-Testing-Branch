( function (angular) {
	'use strict';

	angular.module( 'basics.masterdata' ).directive( 'basicsMasterDataContextClassificationLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'Classification',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '5f6d74e7725246c08a2edadc4793c028',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription' }
				],
				treeOptions: {
					parentProp: 'WorkCategoryParentFk',
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