/**
 * $Id: resource-equipment-estimate-assemblies-cost-group-service.js 21615 2021-12-08 15:47:48Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.plantestimate';

	angular.module(moduleName).factory('resourcePlantEstimateAssemblyCostGroupService', ['$injector', '$q', 'resourcePlantEstimateLineItemDataService',
		function ($injector, $q, resourcePlantEstimateLineItemDataService) {

			let createOptions = {
				dataLookupType: 'Assembly2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Assembly', resourcePlantEstimateLineItemDataService, createOptions);
		}]);
})(angular);
