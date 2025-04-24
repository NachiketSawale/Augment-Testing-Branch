(function (angular, globals) {
	'use strict';

	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).directive('basicsProcurementstructureStructureDialog', ['basicsProcurementStructureImageProcessor',
		'BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (imageProcess, BasicsLookupdataLookupDirectiveDefinition, $injector) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.prcStructure($injector).lookupOptions, imageProcess);
		}
	]);
})(angular, globals);