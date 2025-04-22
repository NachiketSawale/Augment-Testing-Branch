/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.common';

	globals.lookups.salesDateType = function salesDateType() {
		return {
			lookupOptions: {
				lookupType: 'SalesDateType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};
	angular.module(moduleName).directive('salesCommonSalesDateTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.salesDateType().lookupOptions);
		}]);
})();
