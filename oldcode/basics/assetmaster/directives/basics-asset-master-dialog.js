(function config(angular, globals) {
	'use strict';

	globals.lookups.AssertMaster = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'AssertMaster',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'a2f4ff8fb2dd47dab5fc2df16a00aed3',
				title: {
					name: 'Assign Asset Master',
					name$tr$: 'basics.assetmaster.assetMasterTitle'
				},
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						formatter: 'code',
						searchable: true
					},
					{
						id: 'desc',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						searchable: true
					}
				],
				treeOptions: {
					parentProp: 'AssetMasterParentFk',
					childProp: 'AssetMasterChildren',
					inlineFilters: true,
					hierarchyEnabled: true,
					lazyLoad: true
				},
				selectableCallback: function (dataItem) {
					// only dataItem.AllowAssignment can be assigned.
					return dataItem.IsLive && dataItem.AllowAssignment;
				}
			}
		};
	};

	angular.module('basics.assetmaster').directive('basicsAssetMasterDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function basicsAssetMasterDialog(
			BasicsLookupdataLookupDirectiveDefinition) {

			var providerInfo = globals.lookups.AssertMaster();

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
		}
	]);
})(angular, globals);