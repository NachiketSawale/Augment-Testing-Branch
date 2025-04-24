(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcPriceCondition = function prcPriceCondition() {
		return {
			lookupOptions: {
				lookupType: 'prcpricecondition',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: true
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:prcReqConfigurationCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementCommonPriceConditionLookup', ['platformModalService', 'BasicsLookupdataLookupDirectiveDefinition',
		function (platformModalService, BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcPriceCondition().lookupOptions);
		}]);

})(angular, globals);