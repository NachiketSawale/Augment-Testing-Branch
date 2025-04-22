/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';

	var salesWipModule = 'sales.wip';

	/***
	 * Lookup for sales wip accrual modes (used e.g. in create accruals wizard in wip)
	 */
	angular.module(salesWipModule).directive('salesWipAccrualModeCombobox',
		['BasicsLookupdataLookupDirectiveDefinition',
			function (BasicsLookupdataLookupDirectiveDefinition) {
				var lookupOptions = {
					lookupType: 'WipAccrualMode',
					valueMember: 'Id',
					displayMember: 'DescriptionInfo.Translated'
				};
				return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', lookupOptions);
			}]);
})();