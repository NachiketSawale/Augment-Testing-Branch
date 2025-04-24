(function (angular, globals) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).directive('basicsProcurementstructurePrcGeneralsTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.prcGeneralsType().lookupOptions);
		}
	]);

})(angular, globals);