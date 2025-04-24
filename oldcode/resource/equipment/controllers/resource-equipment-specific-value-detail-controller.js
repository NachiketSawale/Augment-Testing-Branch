/**
 * Created by Nikhil on 07.08.2023
 */

(function (angular) {

	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentSpecificValueDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment specificValue entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentSpecificValueDetailController', ResourceEquipmentSpecificValueDetailController);

	ResourceEquipmentSpecificValueDetailController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentConstantValues'];

	function ResourceEquipmentSpecificValueDetailController($scope, platformContainerControllerService, resourceEquipmentConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourceEquipmentConstantValues.uuid.container.specificValuesDetails);
	}

})(angular);