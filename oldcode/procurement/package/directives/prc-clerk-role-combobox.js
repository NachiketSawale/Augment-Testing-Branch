/**
 * Created by alm on 2017/4/5.
 */
(function (angular, globals) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.package';

	globals.lookups.clerkRole = function clerkRole() {
		return {
			lookupOptions: {
				lookupType: 'ClerkRole',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module(moduleName).directive('procurementClerkRoleCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.clerkRole().lookupOptions);
		}]);

})(angular, globals);
