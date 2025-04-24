
(function (angular) {
	'use strict';
	var modulename = 'constructionsystem.master';
	angular.module(modulename).directive('constructionSystemMasterGlobalParamGroupLookup',
		['$q', 'BasicsLookupdataLookupDirectiveDefinition',
			function ($q, BasicsLookupdataLookupDirectiveDefinition) {
				var defaults = {
					lookupType: 'CosMasterGlobalParamGroup',
					valueMember: 'Id',
					displayMember: 'Code',
					uuid: '8718b4eb615c49399d04a95c93ef57cc',
					columns: [
						{
							id: 'code',
							field: 'Code',
							name: 'Code',
							name$tr$: 'cloud.common.entityCode',
							width: 100
						},
						{
							id: 'description',
							field: 'DescriptionInfo.Translated',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							width: 100
						}
					],
					buildSearchString: function (searchValue) {
						if (!searchValue) {
							return '';
						}
						var searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
						return searchString.replace(/%SEARCH%/g, searchValue);
					},
					selectableCallback: function (dataItem) {
						if (dataItem.Sorting === 0) {
							return false;
						}
						return dataItem.IsLive;
					},
					treeOptions: {
						parentProp: 'CosGlobalParamGroupParent',
						childProp: 'CosGlobalParamGroupChildren',
						initialState: 'expanded',
						inlineFilters: true,
						hierarchyEnabled: true
					},
				};
				return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
			}]);
})(angular);