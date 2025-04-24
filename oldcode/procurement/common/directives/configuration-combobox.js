(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.prcConfiguration = function prcConfiguration() {
		return {
			lookupOptions: {
				lookupType: 'prcconfiguration',
				valueMember: 'Id',
				displayMember: 'Description'
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
	angular.module(moduleName).directive('procurementCommonConfigurationCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcConfiguration().lookupOptions);
		}]);

})(angular, globals);