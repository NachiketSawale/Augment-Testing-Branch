/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('estimate.assemblies').factory('estimateAssembliesLiccostgroup2Service', ['estimateMainLiccostgroupsService', 'estimateAssembliesCreationService', 'estimateAssembliesFilterService',
		function (estimateMainLiccostgroupsService, estimateAssembliesCreationService, estimateAssembliesFilterService) {
			let costgroupService = estimateMainLiccostgroupsService.createCostGroupsDataService('costgroups2');
			estimateMainLiccostgroupsService.extendByFilter(costgroupService, 'estimateAssembliesLicCostgroup2ListController', estimateAssembliesCreationService, estimateAssembliesFilterService, 2);

			return costgroupService;
		}]);
})();
