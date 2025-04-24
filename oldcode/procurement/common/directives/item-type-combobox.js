(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcItemType = function prcItemType() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'PrcItemType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module(moduleName).directive('procurementCommonItemTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcItemType().lookupOptions);
		}
	]);

})(angular, globals);