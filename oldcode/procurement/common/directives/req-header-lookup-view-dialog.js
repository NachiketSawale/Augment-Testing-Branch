(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(moduleName).directive('procurementCommonReqHeaderLookupViewDialog', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.reqHeaderLookupView($injector).lookupOptions);
		}
	]);

})(angular, globals);