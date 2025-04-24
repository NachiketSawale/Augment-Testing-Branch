(function () {
	'use strict';

	/* globals angular, _ */

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).factory('transportplanningRequisitionContainerFilterForTreeService', [
		'transportplanningRequisitionContainerFilterService',
		function (transportplanningRequisitionContainerFilterService) {
			return transportplanningRequisitionContainerFilterService.createFilterService(true);
		}
	]);
})();
