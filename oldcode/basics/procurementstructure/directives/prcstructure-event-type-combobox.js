( function (angular, globals) {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	globals.lookups.prcEventType = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcEventType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module(moduleName).directive('basicsProcurementStructureEventTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcEventType().lookupOptions);
		}]);
})(angular, globals);