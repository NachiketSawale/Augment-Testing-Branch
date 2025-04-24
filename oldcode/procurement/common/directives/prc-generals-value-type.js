( function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.generalsValueType = function generalsValueType() {
		return {
			lookupOptions: {
				lookupType: 'generalsvaluetype',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module(moduleName).directive('procurementCommonGeneralsValueTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.generalsValueType().lookupOptions);
		}]);
})(angular, globals);