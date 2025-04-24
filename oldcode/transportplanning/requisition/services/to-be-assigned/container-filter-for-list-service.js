(function () {
	'use strict';

	/* globals angular, _ */

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).factory('transportplanningRequisitionContainerFilterForListService', [
		'transportplanningRequisitionContainerFilterService',
		function (transportplanningRequisitionContainerFilterService) {
			return transportplanningRequisitionContainerFilterService.createFilterService(false);
		}
	]);
})();
