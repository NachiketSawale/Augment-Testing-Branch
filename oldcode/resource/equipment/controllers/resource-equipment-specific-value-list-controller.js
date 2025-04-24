/**
 * Created by Nikhil on 07.08.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentSpecificValueListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment specificValue entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentSpecificValueListController', ResourceEquipmentSpecificValueListController);

	ResourceEquipmentSpecificValueListController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentConstantValues'];

	function ResourceEquipmentSpecificValueListController($scope, platformContainerControllerService, resourceEquipmentConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourceEquipmentConstantValues.uuid.container.specificValuesList);
	}
})(angular);