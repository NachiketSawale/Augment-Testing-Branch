(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.rfqRejectionReason = function rfqRejectionReason() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'RfqRejectionReason',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module(moduleName).directive('procurementRfqRejectionReasonCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.rfqRejectionReason().lookupOptions);
		}]);

})(angular, globals);