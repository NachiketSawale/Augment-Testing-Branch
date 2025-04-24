(function (angular) {
	'use strict';

	globals.lookups['ControllingUnit'] = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'controllingunit',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'a3d886e6260549979ff4247271d24614',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{id: 'desc',field: 'DescriptionInfo.Translated', name: 'Description', width: 120, name$tr$: 'cloud.common.entityDescription'}
				],
				height: 250,
				treeOptions: {
					parentProp: 'ControllingunitFk',
					childProp: 'ChildItems',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				},
				title: {name: 'cloud.common.controllingCodeTitle'},
				pageOptions: {
					enabled: true,
					size: 10
				},
				buildSearchString:function(searchValue){
					if(!searchValue){
						return '';
					}
					var searchString = 'Code.Contains("%SEARCH%") Or DescriptionInfo.Description.Contains("%SEARCH%")';
					return searchString.replace(/%SEARCH%/g,searchValue);
				}
			}
		};
	};

	angular.module('basics.masterdata').directive('basicsMasterDataContextControllingUnitLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var providerInfo = globals.lookups['ControllingUnit']();
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
		}
	]);
})(angular);