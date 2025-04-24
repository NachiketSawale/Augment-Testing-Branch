(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).directive('transportplanningTransportWaypointDefaultsrcdstLookup', DefaultSrcDstLookup);

	DefaultSrcDstLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'transportplanningTransportWaypointDefaultSrcDstService'];

	function DefaultSrcDstLookup(LookupDirectiveDefinition, defaultSrcDstService) {
		var options = {
			valueMemeber: 'Id',
			displayMember: 'Name'
		};

		var customConfiguration = {
			dataProvider: {
				getItemByKey: function (key) {
					return defaultSrcDstService.getItemById(key);
				}
			}
		};

		return new LookupDirectiveDefinition('combobox-edit', options, customConfiguration);
	}
})(angular);
