/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('estimate.assemblies').factory('estimateAssembliesLiccostgroup1Service', ['estimateMainLiccostgroupsService', 'estimateAssembliesCreationService', 'estimateAssembliesFilterService',
		function (estimateMainLiccostgroupsService, estimateAssembliesCreationService, estimateAssembliesFilterService) {
			let costgroupService = estimateMainLiccostgroupsService.createCostGroupsDataService('costgroups1');
			estimateMainLiccostgroupsService.extendByFilter(costgroupService, 'estimateAssembliesLicCostgroup1ListController', estimateAssembliesCreationService, estimateAssembliesFilterService, 1);

			return costgroupService;
		}]);
})();
