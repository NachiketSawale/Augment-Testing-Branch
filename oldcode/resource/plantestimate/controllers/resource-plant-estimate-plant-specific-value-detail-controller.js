/**
 * Created by Nikhil on 07.08.2023
 */

(function (angular) {

	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateEquipmentSpecificValueDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment specificValue entities.
	 **/
	angular.module(moduleName).controller('resourcePlantEstimateEquipmentSpecificValueDetailController', ResourcePlantEstimateEquipmentSpecificValueDetailController);

	ResourcePlantEstimateEquipmentSpecificValueDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantEstimateConstantValues'];

	function ResourcePlantEstimateEquipmentSpecificValueDetailController($scope, platformContainerControllerService, resourcePlantEstimateConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantEstimateConstantValues.uuid.container.specificValueDetails);
	}

})(angular);