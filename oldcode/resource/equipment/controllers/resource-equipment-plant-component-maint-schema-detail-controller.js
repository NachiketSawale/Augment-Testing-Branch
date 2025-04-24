/**
 * Created by cakiral on 08.04.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantComponentMaintSchemaDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment component Maint Schema Detail entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentPlantComponentMaintSchemaDetailController', ResourceEquipmentPlantComponentMaintSchemaDetailController);

	ResourceEquipmentPlantComponentMaintSchemaDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentPlantComponentMaintSchemaDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'adacbb70781511eabc550242ac130003');
	}

})(angular);