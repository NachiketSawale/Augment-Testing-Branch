/**
 * Created by zos on 9/6/2015.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.lineItemContext = function lineItemContext() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'lineitemcontext',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module('procurement.package').directive('mdcLineItemContextCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.lineItemContext().lookupOptions);
		}]);

})(angular, globals);