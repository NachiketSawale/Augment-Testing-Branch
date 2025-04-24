(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.rfqStatus = function rfqStatus() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'rfqStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementRfqHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * rfq header status combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementRfqHeaderStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.rfqStatus().lookupOptions);
		}]);

})(angular, globals);
