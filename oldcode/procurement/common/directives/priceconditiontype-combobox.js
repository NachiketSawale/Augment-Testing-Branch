(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcPriceConditionType = function prcPriceConditionType() {
		return {
			lookupOptions: {
				lookupType: 'prcpriceconditiontype',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementCommonConfigurationCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementCommonPriceConditionTypeLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcPriceConditionType().lookupOptions);
		}]);

})(angular, globals);