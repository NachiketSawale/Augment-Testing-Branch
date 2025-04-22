/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.common';

	globals.lookups.salesDateKind = function salesDateKind() {
		return {
			lookupOptions: {
				lookupType: 'SalesDateKind',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module(moduleName).directive('salesCommonSalesDateKindCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.salesDateKind().lookupOptions);
		}]);
})();
