(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcGeneralsType = function prcGeneralsType() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcGeneralsType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
     * @ngdoc directive
     * @name procurement.requisition.directive:procurementCommonAwardMethodCombobox
     * @element div
     * @restrict A
     * @description
     * Strategy combobox.
     *
     */
	angular.module(moduleName).directive('procurementCommonGeneralsTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcGeneralsType().lookupOptions);
		}]);

})(angular, globals);
