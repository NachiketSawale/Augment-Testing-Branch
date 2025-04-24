/**
 * Created by lav on 8/27/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.site';
	angular.module(moduleName).directive('basicsSiteSiteXLookup', basicsSiteSiteLookup);

	basicsSiteSiteLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsSiteImageProcessor', 'basicsSiteSelectableProcessor'];

	function basicsSiteSiteLookup(BasicsLookupdataLookupDirectiveDefinition, basicsSiteImageProcessor, basicsSiteSelectableProcessor) {

		var defaults = {
			lookupType: 'SiteNew',
			valueMember: 'Id',
			displayMember: 'Code',
			dialogUuid: '6686c0013f8a49babeafcf79e4a782d9',
			uuid: '1f9f5c1deaa249068b43712a3d8f3fff',
			columns: [
				{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'Description',
					field: 'DescriptionInfo.Description',
					name: '*Description',
					name$tr$: 'cloud.common.entityDescription'
				},
				{id: 'Selectable', field: 'Selectable', name: 'Selectable', name$tr$: 'basics.site.Selectable'}
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
			/* jshint -W098 */
			selectableCallback: function (dataItem, entity, settings) {
				return dataItem.Selectable;
			},
			version: 3
		};

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			processData: function (dataList, options) {
				dataList = basicsSiteImageProcessor.processData(dataList);
				if (options.processDataKey) {
					dataList = basicsSiteSelectableProcessor.processData(dataList, options.processDataKey);
				}
				return dataList;
			}
		});
	}
})(angular);