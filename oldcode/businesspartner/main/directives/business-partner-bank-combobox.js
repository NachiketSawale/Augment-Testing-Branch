(function (angular, globals) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.main';
	angular.module(moduleName).directive('businessPartnerBankCombobox', businessPartnerBankCombobox);
	businessPartnerBankCombobox.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function businessPartnerBankCombobox(BasicsLookupdataLookupDirectiveDefinition) {

		let options = globals.lookups['businesspartner.main.bank']().lookupOptions;

		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', options);
	}

})(angular, globals);