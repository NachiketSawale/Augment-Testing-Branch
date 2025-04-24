/**
 * Created by Nikhil on 07.08.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.plantestimate';

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimateEquipmentSpecificValueListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment specificValue entities.
	 **/

	angular.module(moduleName).controller('resourcePlantEstimateEquipmentSpecificValueListController', ResourcePlantEstimateEquipmentSpecificValueListController);

	ResourcePlantEstimateEquipmentSpecificValueListController.$inject = ['$scope', 'platformContainerControllerService', 'resourcePlantEstimateConstantValues'];

	function ResourcePlantEstimateEquipmentSpecificValueListController($scope, platformContainerControllerService, resourcePlantEstimateConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourcePlantEstimateConstantValues.uuid.container.specificValueList);
	}
})(angular);