(function (angular, globals) {
	'use strict';

	globals.lookups.prcStructureType = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcStructureType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).directive('basicsProcurementstructurePrcstructureTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcStructureType().lookupOptions);
		}
	]);
})(angular, globals);