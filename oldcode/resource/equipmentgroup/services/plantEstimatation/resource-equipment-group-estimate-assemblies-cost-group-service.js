/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupEstimateAssembliesCostGroupService
	 * @function
	 *
	 * @description
	 * This is the config service for all plant group assembly's cost groups.
	 */
	angular.module(moduleName).factory('resourceEquipmentGroupEstimateAssembliesCostGroupService', ['$injector', '$q', 'resourceEquipmentGroupPlantEstimationLineItemDataService',
		function ($injector, $q, resourceEquipmentGroupPlantEstimationLineItemDataService) {

			let createOptions = {
				dataLookupType: 'Assembly2CostGroups',
				identityGetter: function (entity) {
					return {
						RootItemId: entity.EstHeaderFk,
						MainItemId: entity.Id
					};
				}
			};

			return $injector.get('basicsCostGroupDataServiceFactory').createService('Assembly', resourceEquipmentGroupPlantEstimationLineItemDataService, createOptions);
		}]);
})(angular);
