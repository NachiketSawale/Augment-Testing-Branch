(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).directive('ppsItemComplexLookup', ComplexLookup);

	ComplexLookup.$inject = ['LookupFilterDialogDefinition', 'ppsItemLookupService'];

	function ComplexLookup(LookupFilterDialogDefinition, lookupService) {

		var lookupOptions = lookupService.getLookupOptions();

		return new LookupFilterDialogDefinition(lookupOptions, 'ppsItemLookupDataService', lookupOptions.detailConfig, lookupOptions.gridSettings);
	}
})(angular);