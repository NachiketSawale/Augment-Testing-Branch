(function (angular) {
	'use strict';
	var moduleName = 'basics.costgroups';

	angular.module(moduleName).directive('basicsCostGroup4Dialog',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'basicscostgroup4',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: '4d4b984415bc4f9d85d75ac728f7ea78',
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
					title: { name: 'Cost Group4', name$tr$: 'basics.costgroups.tabs.tabTitle4' },
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