
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').directive('procurementInvoiceContractStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition', 'globals',
		function (BasicsLookupdataLookupDirectiveDefinition, globals) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.conStatus().lookupOptions);
		}]);

})(angular);
