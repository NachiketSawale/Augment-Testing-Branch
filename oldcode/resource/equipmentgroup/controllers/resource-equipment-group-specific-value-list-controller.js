/**
 * Created by baf on 20.07.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupSpecificValueListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipmentGroup specificValue entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupSpecificValueListController', ResourceEquipmentGroupSpecificValueListController);

	ResourceEquipmentGroupSpecificValueListController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentGroupConstantValues'];

	function ResourceEquipmentGroupSpecificValueListController($scope, platformContainerControllerService, resourceEquipmentGroupConstantValues) {
		platformContainerControllerService.initController($scope, moduleName, resourceEquipmentGroupConstantValues.uuid.container.specificValueList);
	}
})(angular);