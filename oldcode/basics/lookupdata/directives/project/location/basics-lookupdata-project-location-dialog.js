(function (angular) {
	'use strict';
	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataPrjLocationDialog',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'ProjectLocation',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: '597a6f03fa8d4f4786fba7fe7ff515e3',
					columns: [
						{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
						{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation', name$tr$: 'cloud.common.entityDescription' },
						{ id: 'qty', field: 'Quantity', name: 'Quantity', width: 120, toolTip: 'Quantity', formatter: 'number', name$tr$: 'cloud.common.entityQuantity', searchable:false}
					],
					width: 660,
					height: 200,
					treeOptions: {
						parentProp: 'LocationParentFk',
						childProp: 'Locations',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true
					},
					title: { name: 'Project Location', name$tr$: 'estimate.main.locationContainer' },
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