/**
 * $Id: resource-equipment-plant-estimation-line-item-list-controller.js 21615 2021-12-08 15:47:48Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateLineItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Estimate Assemblies in a plant
	 **/
	angular.module(moduleName).controller('resourcePlantEstimateLineItemListController', ResourcePlantEstimateLineItemListController);

	ResourcePlantEstimateLineItemListController.$inject = ['$scope', 'platformContainerControllerService','resourcePlantestimateContainerInformationService',
		'resourcePlantEstimateLineItemContainerService', 'estimateAssembliesAssembliesListControllerFactory', 'resourcePlantEstimateLineItemDataService', 'resourcePlantEstimateAssemblyValidationService', 'resourcePlantEstimateResourceDataService'];

	function ResourcePlantEstimateLineItemListController($scope, platformContainerControllerService, resourcePlantestimateContainerInformationService, resourcePlantEstimateLineItemContainerService, estimateAssembliesAssembliesListControllerFactory,
		resourcePlantEstimateLineItemDataService, resourcePlantEstimateAssemblyValidationService, resourcePlantEstimateResourceDataService) {
		let containerUid = $scope.getContentValue('uuid');

		resourcePlantEstimateLineItemContainerService.prepareGridConfig(containerUid, $scope, resourcePlantestimateContainerInformationService);

		let isPrjAssembly = false,
			options = {isPlantAssembly : true,
				assembliesConfigurationExtendServiceName: 'resourcePlantEstimateConfigurationExtendService',
				assembliesCostGroupServiceName: 'resourcePlantEstimateAssemblyCostGroupService',
				assembliesDynamicUserDefinedColumnServiceName: 'resourcePlantEstimateDynamicUserDefinedColumnService'};

		estimateAssembliesAssembliesListControllerFactory.initAssembliesListController($scope, moduleName, resourcePlantEstimateLineItemDataService, resourcePlantEstimateAssemblyValidationService, resourcePlantEstimateResourceDataService,
			null, '02580d5adb6b48429302166d9e9ac8c6', isPrjAssembly, options);
	}
})();
