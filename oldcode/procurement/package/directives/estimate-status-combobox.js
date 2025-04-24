/**
 * Created by zos on 9/6/2015.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.estStatus = function estStatus() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'eststatus',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module('procurement.package').directive('estimateStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.estStatus().lookupOptions);
		}]);

})(angular, globals);