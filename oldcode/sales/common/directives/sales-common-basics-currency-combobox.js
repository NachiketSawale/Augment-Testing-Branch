(function (angular) {
	'use strict';
	/* global globals */
	var moduleName = 'sales.common';

	globals.lookups.basCurrency = function basCurrency() {
		return {
			lookupOptions: {
				version: 2,
				lookupType: 'basCurrency',
				valueMember: 'Id',
				displayMember: 'Currency'
			}
		};
	};

	angular.module(moduleName).directive('salesCommonBasicsCurrencyCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.basCurrency().lookupOptions);
		}]);

})(angular);