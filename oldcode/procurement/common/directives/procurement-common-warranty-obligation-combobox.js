/**
 * Created by yew on 11/07/2019.
 */
(function (angular, globals) { // jshint ignore:line
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.common';

	globals.lookups.warrantyObligation = function warrantyObligation() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'WarrantyObligation',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module(moduleName).directive('procurementCommonWarrantyObligationCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.warrantyObligation().lookupOptions);
		}]);

})(angular, globals);