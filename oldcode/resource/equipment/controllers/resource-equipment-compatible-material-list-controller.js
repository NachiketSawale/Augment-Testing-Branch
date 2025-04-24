/**
 * Created by baf on 30.01.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentCompatibleMaterialListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment compatibleMaterial entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentCompatibleMaterialListController', ResourceEquipmentCompatibleMaterialListController);

	ResourceEquipmentCompatibleMaterialListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentCompatibleMaterialListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '26b70d12f6134c08af7f3b173dd76c37');
	}
})(angular);