/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';
	var moduleName = 'sales.billing';
	var salesBillingModule = angular.module(moduleName);

	/***
	 * Lookup for sales billing accrual modes (used e.g. in create accruals wizard in sales billing)
	 */
	salesBillingModule.directive('salesBillingAccrualModeCombobox',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var lookupOptions = {
					lookupType: 'BillAccrualMode',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated'
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', lookupOptions);
			}]);
})();