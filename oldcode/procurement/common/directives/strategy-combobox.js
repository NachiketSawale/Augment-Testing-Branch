(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcConfig2Strategy = function prcConfig2Strategy() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'prcconfig2strategy',
				valueMember: 'Id',
				displayMember: 'Description',
				filterKey: 'prc-con-strategy-filter'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementCommonStrategyCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementCommonStrategyCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcConfig2Strategy().lookupOptions);
		}]);

})(angular, globals);