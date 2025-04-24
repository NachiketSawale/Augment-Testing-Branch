(function (angular) {
	'use strict';
	var moduleName = 'basics.costgroups';

	angular.module(moduleName).directive('basicsCostGroup2Dialog',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'basicscostgroup2',
					valueMember: 'Id',
					displayMember: 'Code',
					dialogUuid: '50d8f60b8b334f81805bc03a82070d59',
					uuid: '8ea2a20dbb0340d1afc4e4e40dbb844c',
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
					title: { name: 'Cost Group2', name$tr$: 'basics.costgroups.tabs.tabTitle2' },
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