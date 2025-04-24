/**
 * Created by anl on 5/6/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonProductLookupNew', PpsCommonProductLookupNew);

	PpsCommonProductLookupNew.$inject = [
		'LookupFilterDialogDefinition',
		'productionplanningCommonProductLookupNewDataService',
		'productionPlanningCommonProductLookupNewService'];

	function PpsCommonProductLookupNew(LookupFilterDialogDefinition,
									   productionplanningCommonProductLookupNewDataService,
									   productionPlanningCommonProductLookupNewService) {

		var lookupOptions = productionPlanningCommonProductLookupNewService.getLookupOptions();

		return new LookupFilterDialogDefinition(lookupOptions, 'productionplanningCommonProductLookupNewDataService', lookupOptions.detailConfig, lookupOptions.gridSettings);


	}
})(angular);