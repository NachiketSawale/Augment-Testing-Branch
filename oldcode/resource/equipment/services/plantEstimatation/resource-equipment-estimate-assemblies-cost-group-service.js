/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.equipment';

	angular.module(moduleName).factory('resourceEquipmentEstimateAssembliesCostGroupService', ['$injector', '$q', 'resourceEquipmentPlantEstimationLineItemDataService',
		function ($injector, $q, resourceEquipmentPlantEstimationLineItemDataService) {

			let createOptions = {
				dataLookupType: 'Assembly2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Assembly', resourceEquipmentPlantEstimationLineItemDataService, createOptions);
		}]);
})(angular);
