/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';
	/**
     * @ngdoc service
     * @name resourceEquipmentGroupDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * This is the config service for plant group assembly dynamic user defined column
     */
	angular.module(moduleName).factory('resourceEquipmentGroupDynamicUserDefinedColumnService', ['estimateAssembliesDynamicUserDefinedColumnServiceFactory',
		function (estimateAssembliesDynamicUserDefinedColumnServiceFactory) {
			let options = {isPlantAssembly : true,
				configurationExtendService : 'resourceEquipmentGroupConfigurationExtendService',
				dataService : 'resourceEquipmentGroupPlantEstimationLineItemDataService',
				assemblyResourceDynamicUserDefinedColumnService : 'resourceEquipmentGroupResourceDynamicUserDefinedColumnService'
			};

			return estimateAssembliesDynamicUserDefinedColumnServiceFactory.initService(false, options);
		}
	]);
})(angular);
