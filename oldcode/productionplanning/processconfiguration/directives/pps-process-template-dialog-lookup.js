(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.processconfiguration';
	angular.module(moduleName).directive('ppsProcessConfigurationProcessTemplateDialogLookup', Lookup);

	Lookup.$inject = ['LookupFilterDialogDefinition',
		'BasicsLookupdataLookupDirectiveDefinition'];

	function Lookup(LookupFilterDialogDefinition,
		BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'ProcessTemplate',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			version: 3,
			dialogUuid: 'a48fe5d87b514a5a945ba8173fd8a5ff',
			uuid: '98ab0897f4134def9c17ba8641843282',
			columns: [
				{
					id: 'desc',
					field: 'DescriptionInfo.Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			filterOptions: {
				fn: function(item) {
					return item.IsLive;
				},
			},
			disableCache: true,
			width: 500,
			height: 200
		};
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);