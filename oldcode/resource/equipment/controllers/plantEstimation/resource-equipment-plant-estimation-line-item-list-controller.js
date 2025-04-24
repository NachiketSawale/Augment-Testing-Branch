/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantEstimationLineItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Estimate Assemblies in a plant
	 **/
	angular.module(moduleName).controller('resourceEquipmentPlantEstimationLineItemListController', ResourceEquipmentPlantEstimationLineItemListController);

	ResourceEquipmentPlantEstimationLineItemListController.$inject = ['$scope', 'platformContainerControllerService','resourceEquipmentContainerInformationService',
		'resourceEquipmentPlantEstimationLineItemContainerService', 'estimateAssembliesAssembliesListControllerFactory', 'resourceEquipmentPlantEstimationLineItemDataService', 'resourceEquipmentEstimateAssemblyValidationService', 'resourceEquipmentPlantEstimationResourceDataService'];

	function ResourceEquipmentPlantEstimationLineItemListController($scope, platformContainerControllerService, resourceEquipmentContainerInformationService, resourceEquipmentPlantEstimationLineItemContainerService, estimateAssembliesAssembliesListControllerFactory,
		resourceEquipmentPlantEstimationLineItemDataService, resourceEquipmentEstimateAssemblyValidationService, resourceEquipmentPlantEstimationResourceDataService) {
		let containerUid = $scope.getContentValue('uuid');

		resourceEquipmentPlantEstimationLineItemContainerService.prepareGridConfig(containerUid, $scope, resourceEquipmentContainerInformationService);

		let isPrjAssembly = false,
			options = {isPlantAssembly : true,
				assembliesConfigurationExtendServiceName: 'resourceEquipmentConfigurationExtendService',
				assembliesCostGroupServiceName: 'resourceEquipmentEstimateAssembliesCostGroupService',
				assembliesDynamicUserDefinedColumnServiceName: 'resourceEquipmentDynamicUserDefinedColumnService'};

		estimateAssembliesAssembliesListControllerFactory.initAssembliesListController($scope, moduleName, resourceEquipmentPlantEstimationLineItemDataService, resourceEquipmentEstimateAssemblyValidationService, resourceEquipmentPlantEstimationResourceDataService,
			null, '02580d5adb6b48429302166d9e9ac8c6', isPrjAssembly, options);
	}
})();
