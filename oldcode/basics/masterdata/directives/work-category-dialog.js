( function ( angular )
{
	'use strict';

	angular.module( 'basics.masterdata' ).directive( 'basicsMdcWorkCategoryDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition)
		{
			var defaults = {
				version: 2,
				lookupType: 'WorkCategory',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '5cec62ff838a4ac59ea5620f4d71b065',
				columns: [
					{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description', formatter:'translation', name$tr$: 'cloud.common.entityDescription' }
				],
				treeOptions: {
					parentProp: 'WorkCategoryParentFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				title: { name: 'Work Category', name$tr$: 'estimate.main.mdcWorkCategoryFk' },
				buildSearchString: function (searchValue) {
					if (!searchValue) {
						return '';
					}
					var searchString = '(Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%"))';
					return searchString.replace(/%SEARCH%/g, searchValue);
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition( 'dialog-edit', defaults );
		}
	] );
})( angular );