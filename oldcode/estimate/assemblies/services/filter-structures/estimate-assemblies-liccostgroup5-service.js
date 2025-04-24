/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('estimate.assemblies').factory('estimateAssembliesLiccostgroup5Service', ['estimateMainLiccostgroupsService', 'estimateAssembliesCreationService', 'estimateAssembliesFilterService',
		function (estimateMainLiccostgroupsService, estimateAssembliesCreationService, estimateAssembliesFilterService) {
			let costgroupService = estimateMainLiccostgroupsService.createCostGroupsDataService('costgroups5');
			estimateMainLiccostgroupsService.extendByFilter(costgroupService, 'estimateAssembliesLicCostgroup5ListController', estimateAssembliesCreationService, estimateAssembliesFilterService, 5);

			return costgroupService;
		}]);
})();
