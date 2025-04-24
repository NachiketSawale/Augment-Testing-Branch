/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('estimate.assemblies').factory('estimateAssembliesLiccostgroup3Service', ['estimateMainLiccostgroupsService', 'estimateAssembliesCreationService', 'estimateAssembliesFilterService',
		function (estimateMainLiccostgroupsService, estimateAssembliesCreationService, estimateAssembliesFilterService) {
			let costgroupService = estimateMainLiccostgroupsService.createCostGroupsDataService('costgroups3');
			estimateMainLiccostgroupsService.extendByFilter(costgroupService, 'estimateAssembliesLicCostgroup3ListController', estimateAssembliesCreationService, estimateAssembliesFilterService, 3);

			return costgroupService;
		}]);
})();
