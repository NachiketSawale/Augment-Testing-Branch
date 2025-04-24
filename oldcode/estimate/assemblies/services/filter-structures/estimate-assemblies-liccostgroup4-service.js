/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	angular.module('estimate.assemblies').factory('estimateAssembliesLiccostgroup4Service', ['estimateMainLiccostgroupsService', 'estimateAssembliesCreationService', 'estimateAssembliesFilterService',
		function (estimateMainLiccostgroupsService, estimateAssembliesCreationService, estimateAssembliesFilterService) {
			let costgroupService = estimateMainLiccostgroupsService.createCostGroupsDataService('costgroups4');
			estimateMainLiccostgroupsService.extendByFilter(costgroupService, 'estimateAssembliesLicCostgroup4ListController', estimateAssembliesCreationService, estimateAssembliesFilterService, 4);

			return costgroupService;
		}]);
})();
