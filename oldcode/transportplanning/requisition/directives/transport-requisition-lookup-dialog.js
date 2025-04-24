/**
 * Created by anl on 2/18/2020.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';
	angular.module(moduleName).directive('transportplanningRequisitionLookupDialog', TrsRequisitionLookupDialog);

	TrsRequisitionLookupDialog.$inject = [
		'LookupFilterDialogDefinition',
		'transportplanningRequisitionLookupDialogService'];

	function TrsRequisitionLookupDialog(LookupFilterDialogDefinition,
									   trsRequisitionLookupDialogService) {

		var lookupOptions = trsRequisitionLookupDialogService.getLookupOptions();

		return new LookupFilterDialogDefinition(lookupOptions, 'transportplanningRequisitionLookupDataService', lookupOptions.detailConfig, lookupOptions.gridSettings);

	}
})(angular);