/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupPlantEstimationLineItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupPlantEstimationLineItemListController', ResourceEquipmentGroupPlantEstimationLineItemListController);

	ResourceEquipmentGroupPlantEstimationLineItemListController.$inject = ['$scope', 'platformContainerControllerService','resourceEquipmentgroupContainerInformationService',
		'resourceEquipmentGroupPlantEstimationLineItemContainerService', 'resourceEquipmentGroupPlantEstimationLineItemDataService', 'resourceEquipmentGroupEstimateAssemblyValidationService', 'resourceEquipmentGroupPlantEstimationResourceDataService', 'estimateAssembliesAssembliesListControllerFactory'];

	function ResourceEquipmentGroupPlantEstimationLineItemListController($scope, platformContainerControllerService, resourceEquipmentgroupContainerInformationService, resourceEquipmentGroupPlantEstimationLineItemContainerService,
		resourceEquipmentGroupPlantEstimationLineItemDataService, resourceEquipmentGroupEstimateAssemblyValidationService, resourceEquipmentGroupPlantEstimationResourceDataService, estimateAssembliesAssembliesListControllerFactory) {
		let containerUid = $scope.getContentValue('uuid');

		resourceEquipmentGroupPlantEstimationLineItemContainerService.prepareGridConfig(containerUid, $scope, resourceEquipmentgroupContainerInformationService);

		let isPrjAssembly = false,
			options = {isPlantAssembly : true,
				assembliesConfigurationExtendServiceName: 'resourceEquipmentGroupConfigurationExtendService',
				assembliesCostGroupServiceName: 'resourceEquipmentGroupEstimateAssembliesCostGroupService',
				assembliesDynamicUserDefinedColumnServiceName: 'resourceEquipmentGroupDynamicUserDefinedColumnService'};

		estimateAssembliesAssembliesListControllerFactory.initAssembliesListController($scope, moduleName, resourceEquipmentGroupPlantEstimationLineItemDataService, resourceEquipmentGroupEstimateAssemblyValidationService, resourceEquipmentGroupPlantEstimationResourceDataService,
			null, '02580d5adb6b48429302166d9e9ac8c6', isPrjAssembly, options);
	}
})();
