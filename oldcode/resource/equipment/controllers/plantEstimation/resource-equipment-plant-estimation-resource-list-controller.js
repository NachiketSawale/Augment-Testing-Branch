/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantEstimationResourceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Estimate Assembly's Resources in a plant
	 **/
	angular.module(moduleName).controller('resourceEquipmentPlantEstimationResourceListController', ResourceEquipmentPlantEstimationResourceListController);

	ResourceEquipmentPlantEstimationResourceListController.$inject = ['$scope', 'platformContainerControllerService','resourceEquipmentContainerInformationService',
		'resourceEquipmentPlantEstimationResourceContainerService', 'estimateAssembliesResourcesTreeControllerFactory', 'resourceEquipmentPlantEstimationResourceDataService', 'resourceEquipmentResourceDynamicConfigurationService'];

	function ResourceEquipmentPlantEstimationResourceListController($scope, platformContainerControllerService, resourceEquipmentContainerInformationService, resourceEquipmentPlantEstimationResourceContainerService, estimateAssembliesResourcesTreeControllerFactory, resourceEquipmentPlantEstimationResourceDataService, resourceEquipmentResourceDynamicConfigurationService) {
		let containerUid = $scope.getContentValue('uuid');

		resourceEquipmentPlantEstimationResourceContainerService.prepareGridConfig(containerUid, $scope, resourceEquipmentContainerInformationService);

		let isPrjAssembly = false,
			options = {isPlantAssembly : true,
				resourcesDynamicUserDefinedColumnServiceName: 'resourceEquipmentResourceDynamicUserDefinedColumnService'};

		estimateAssembliesResourcesTreeControllerFactory.initAssembliesResourceController($scope, moduleName, resourceEquipmentPlantEstimationResourceDataService, resourceEquipmentResourceDynamicConfigurationService, 'eaa7ef996ed54b3b80f5535354ed1081', isPrjAssembly, options);
	}
})();
