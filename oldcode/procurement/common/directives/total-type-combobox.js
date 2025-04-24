(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'procurement.common';

	globals.lookups.prcTotalType = function prcTotalType() {
		return {
			lookupOptions: {
				lookupType: 'PrcTotalType',
				valueMember: 'Id',
				displayMember: 'Code'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.common.directive:procurementCommonTotalTypeCombobox
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 *a combobox directive for Total Type.
	 *
	 */
	angular.module(moduleName).directive('procurementCommonTotalTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcTotalType().lookupOptions);
		}
	]);

})(angular, globals);