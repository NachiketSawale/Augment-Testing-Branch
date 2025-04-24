(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.basCurrency = function basCurrency() {
		return {
			lookupOptions: {
				version: 2,
				lookupType: 'basCurrency',
				valueMember: 'Id',
				displayMember: 'Currency'
			}
		};
	};

	angular.module(moduleName).directive('prcCommonBasicsCurrencyCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.basCurrency().lookupOptions);
		}]);

})(angular, globals);