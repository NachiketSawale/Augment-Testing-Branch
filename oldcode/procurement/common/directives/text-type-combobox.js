(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.configuration2TextType = function configuration2TextType() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'Configuration2TextType',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module('procurement.common').directive('procurementTextTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.configuration2TextType().lookupOptions);
		}]);

})(angular, globals);