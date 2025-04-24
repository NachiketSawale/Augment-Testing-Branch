(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).directive('procurementContractLookupViewDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.contractLookupView($injector).lookupOptions);
		}
	]);

})(angular, globals);