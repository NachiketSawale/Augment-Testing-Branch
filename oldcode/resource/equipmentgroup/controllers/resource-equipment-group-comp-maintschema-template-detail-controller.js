/**
 * Created by shen on 09.01.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupCompMaintSchemaTemplateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Resource EquipmentGroup CompMaintSchemaTemplate entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupCompMaintSchemaTemplateDetailController', ResourceEquipmentGroupCompMaintSchemaTemplateDetailController);

	ResourceEquipmentGroupCompMaintSchemaTemplateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentGroupCompMaintSchemaTemplateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7de3c969cefe4c5a986e0a809be06d68');
	}
})(angular);