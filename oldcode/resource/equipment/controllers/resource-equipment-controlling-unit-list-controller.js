/**
 * Created by baf on 03.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentControllingUnitListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment controllingUnit entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentControllingUnitListController', ResourceEquipmentControllingUnitListController);

	ResourceEquipmentControllingUnitListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentControllingUnitListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1ae4a9f6b86b4b3f964dab760767219f');
	}
})(angular);