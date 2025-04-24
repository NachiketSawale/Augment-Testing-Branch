(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.rfqBusinessPartnerStatus = function rfqBusinessPartnerStatus() {
		return {
			lookupOptions: {
				lookupType: 'RfqBusinessPartnerStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				version:3
			}
		};
	};

	angular.module(moduleName).directive('procurementRfqBusinessPartnerStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.rfqBusinessPartnerStatus().lookupOptions);
		}]);

})(angular, globals);