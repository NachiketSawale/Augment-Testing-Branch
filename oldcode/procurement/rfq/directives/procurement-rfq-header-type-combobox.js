(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.rfqType = function rfqType() {
		return {
			lookupOptions: {
				lookupType: 'rfqType',
				valueMember: 'Id',
				displayMember: 'Description',
				version:3
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.rfq.directive:procurementRfqHeaderTypeCombobox
	 * @element div
	 * @restrict A
	 * @description
	 *
	 * combox lookup for procurement.rfq header type.
	 */
	angular.module(moduleName).directive('procurementRfqHeaderTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.rfqType().lookupOptions);
		}]);

})(angular, globals);