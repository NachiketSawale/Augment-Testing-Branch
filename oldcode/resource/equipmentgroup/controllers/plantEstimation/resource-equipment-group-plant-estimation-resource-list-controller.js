/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantEstimationResourceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a plant group
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupPlantEstimationResourceListController', ResourceEquipmentGroupPlantEstimationResourceListController);

	ResourceEquipmentGroupPlantEstimationResourceListController.$inject = ['$scope', 'platformContainerControllerService','resourceEquipmentgroupContainerInformationService',
		'resourceEquipmentGroupPlantEstimationResourceContainerService', 'estimateAssembliesResourcesTreeControllerFactory', 'resourceEquipmentGroupPlantEstimationResourceDataService', 'resourceEquipmentGroupResourceDynamicConfigurationService'];

	function ResourceEquipmentGroupPlantEstimationResourceListController($scope, platformContainerControllerService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupPlantEstimationResourceContainerService, estimateAssembliesResourcesTreeControllerFactory, resourceEquipmentGroupPlantEstimationResourceDataService, resourceEquipmentGroupResourceDynamicConfigurationService) {
		let containerUid = $scope.getContentValue('uuid');

		resourceEquipmentGroupPlantEstimationResourceContainerService.prepareGridConfig(containerUid, $scope, resourceEquipmentgroupContainerInformationService);

		let isPrjAssembly = false,
			options = {isPlantAssembly : true,
				resourcesDynamicUserDefinedColumnServiceName: 'resourceEquipmentGroupResourceDynamicUserDefinedColumnService'};

		estimateAssembliesResourcesTreeControllerFactory.initAssembliesResourceController($scope, moduleName, resourceEquipmentGroupPlantEstimationResourceDataService, resourceEquipmentGroupResourceDynamicConfigurationService, 'eaa7ef996ed54b3b80f5535354ed1081', isPrjAssembly, options);
	}
})();
