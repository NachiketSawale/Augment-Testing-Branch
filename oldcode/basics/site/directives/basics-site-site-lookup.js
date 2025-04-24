(function (angular) {
	'use strict';

	var moduleName = 'basics.site';
	angular.module(moduleName).directive('basicsSiteSiteLookup', resourceMasterSiteLookup);

	resourceMasterSiteLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsSiteImageProcessor'];

	function resourceMasterSiteLookup(BasicsLookupdataLookupDirectiveDefinition, basicsSiteImageProcessor) {

		var defaults = {
			lookupType: 'SiteNew',
			valueMember: 'Id',
			displayMember: 'Code',
			dialogUuid: '74831a0a17234e7882a1fdfeacd642b0',
			uuid: '1f9f5c1deaa249068b43712a3d8f3eee',
			columns: [
				{ id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'Description', field: 'DescriptionInfo.Description', name: '*Description', name$tr$: 'cloud.common.entityDescription' }
			],
			treeOptions: {
				parentProp: 'SiteFk',
				childProp: 'ChildItems',
				initialState: 'expanded',
				inlineFilters: true,
				hierarchyEnabled: true
			},
			width: 500,
			height: 200,
			version: 3
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			processData: function (dataList) {
				return basicsSiteImageProcessor.processData(dataList);
			}
		});
	}
})(angular);