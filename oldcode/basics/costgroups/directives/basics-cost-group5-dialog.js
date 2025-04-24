(function (angular) {
	'use strict';
	var moduleName = 'basics.costgroups';

	angular.module(moduleName).directive('basicsCostGroup5Dialog',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'basicscostgroup5',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: '2d8bef6f47aa41d1aa5370ea61cd504f',
					columns: [
						{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
						{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation', name$tr$: 'cloud.common.entityDescription' }
					],
					width: 660,
					height: 200,
					treeOptions: {
						parentProp: 'LicCostGroupFk',
						childProp: 'ChildItems',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true
					},
					title: { name: 'Cost Group5', name$tr$: 'basics.costgroups.tabs.tabTitle5' },
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