(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.producttemplate';
	angular.module(moduleName).directive('ppsProductDescriptionComplexLookup', ComplexLookup);

	ComplexLookup.$inject = ['LookupFilterDialogDefinition', 'ppsProductDescriptionLookupService'];

	function ComplexLookup(LookupFilterDialogDefinition, lookupService) {

		var lookupOptions = lookupService.getLookupOptions();

		return new LookupFilterDialogDefinition(lookupOptions, 'ppsProductDescriptionLookupDataService', lookupOptions.detailConfig, lookupOptions.gridSettings);
	}
})(angular);