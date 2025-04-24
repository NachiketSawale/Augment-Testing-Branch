(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.pesStatus = function pesStatus() {
		return {
			lookupOptions: {
				lookupType: 'PesStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.pes.directive:procurementPesHeaderStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementPesHeaderStatusCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.pesStatus().lookupOptions);
		}]);

})(angular, globals);