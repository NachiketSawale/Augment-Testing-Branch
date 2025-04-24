/**
 * Created by baf on 12.04.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupAccountDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipmentGroup account entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentGroupAccountDetailController', ResourceEquipmentGroupAccountDetailController);

	ResourceEquipmentGroupAccountDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupAccountDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e3cb4d24a11f4cdfbebd9e9c77ba9978');
	}

})(angular);