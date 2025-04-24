(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';
	angular.module(moduleName).directive('ppsAccountingUpstreamItemTargetLookupCombobox', upstreamItemTargetLookUp);

	upstreamItemTargetLookUp.$inject = ['$q', '$translate','BasicsLookupdataLookupDirectiveDefinition', 'ppsAccountingResultUpstreamTargetDataService'];

	function upstreamItemTargetLookUp($q, $translate, BasicsLookupdataLookupDirectiveDefinition, accResultUpsTargetDataService) {

		var defaults = {
			lookupType: 'UpstreamItemTarget',
			valueMember: 'Id',
			displayMember: 'Code',
			columns: [
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					name$tr$: 'cloud.common.entityCode'
				}
			],
			width: 500,
			height: 200,
			version: 3
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			dataProvider: {
				getList: accResultUpsTargetDataService.getUpstreamItemTarget,
				getItemByKey: accResultUpsTargetDataService.getItemById
			}
		});
	}
})(angular);