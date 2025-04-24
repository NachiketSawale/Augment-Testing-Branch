(function (angular, globals) {
	'use strict';

	var moduleName = 'basics.company';
	angular.module(moduleName).directive('basicsCompanyStructureDialog', ['basicsProcurementStructureImageProcessor',
		'BasicsLookupdataLookupDirectiveDefinition',
		function (imageProcess, BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.basCompanyPrcStructure().lookupOptions, imageProcess);
		}
	]);
})(angular, globals);