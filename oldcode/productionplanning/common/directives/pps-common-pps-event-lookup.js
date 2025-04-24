(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('ppsCommonPpsEventLookup', Lookup);

	Lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataLookupDataService'];

	function Lookup(BasicsLookupdataLookupDirectiveDefinition,
		lookupDataService) {

		var defaults = {
			lookupType: 'PpsEvent',
			valueMember: 'Id',
			displayMember: 'DisplayTxt',
			uuid: '1f9f5c1debb249068b43712a3d8f3bbb',
			columns: [
				{
					id: 'EventCode',
					field: 'EventCode',
					name: 'EventCode',
					name$tr$: 'cloud.common.event.eventCode',
					width: 100
				},
				{
					id: 'EventType',
					field: 'EventTypeFk',
					name: 'EventType',
					name$tr$: 'cloud.common.event.eventTypeFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'EventType',
						displayMember: 'DescriptionInfo.Translated',
						version: 3
					}
				}
			],
			pageOptions: {
				enabled: true
			},
			width: 500,
			height: 200,
			version: 3
		};

		var defaultDataProvider = lookupDataService.registerDataProviderByType(defaults.lookupType);

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults, {
			dataProvider: {
				getSearchList: function (searchRequest, options, curScope) {
					searchRequest.AdditionalParameters = {ItemFk: curScope.entity.PpsItemFk};
					return defaultDataProvider.getSearchList(searchRequest, options, curScope);
				},
				getItemByKey: function (value) {
					return defaultDataProvider.getItemByKey(value);
				}
			}
		});
	}
})(angular);