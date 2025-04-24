/**
 * $Id: resource-equipment-plant-estimation-resource-list-controller.js 21615 2021-12-08 15:47:48Z joshi $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimationResourceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Estimate Assembly's Resources in a plant
	 **/
	angular.module(moduleName).controller('resourcePlantEstimateResourceListController', ResourcePlantEstimateResourceListController);

	ResourcePlantEstimateResourceListController.$inject = ['$scope', 'platformContainerControllerService','resourcePlantestimateContainerInformationService',
		'resourcePlantEstimateResourceContainerService', 'estimateAssembliesResourcesTreeControllerFactory', 'resourcePlantEstimateResourceDataService', 'resourcePlantEstimateResourceDynamicConfigurationService'];

	function ResourcePlantEstimateResourceListController($scope, platformContainerControllerService, resourcePlantestimateContainerInformationService, resourcePlantEstimateResourceContainerService, estimateAssembliesResourcesTreeControllerFactory, resourcePlantEstimateResourceDataService, resourcePlantEstimateResourceDynamicConfigurationService) {
		let containerUid = $scope.getContentValue('uuid');

		resourcePlantEstimateResourceContainerService.prepareGridConfig(containerUid, $scope, resourcePlantestimateContainerInformationService);

		let isPrjAssembly = false,
			options = {isPlantAssembly : true,
				resourcesDynamicUserDefinedColumnServiceName: 'resourcePlantEstimateResourceDynamicUserDefinedColumnService'};

		estimateAssembliesResourcesTreeControllerFactory.initAssembliesResourceController($scope, moduleName, resourcePlantEstimateResourceDataService, resourcePlantEstimateResourceDynamicConfigurationService, 'eaa7ef996ed54b3b80f5535354ed1081', isPrjAssembly, options);
	}
})();
