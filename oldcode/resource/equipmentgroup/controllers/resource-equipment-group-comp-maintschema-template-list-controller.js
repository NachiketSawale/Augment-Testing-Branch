/**
 * Created by shen on 09.01.2025
 */

(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupCompMaintSchemaTemplateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment group CompMaintSchemaTemplate entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentGroupCompMaintSchemaTemplateListController', ResourceEquipmentGroupCompMaintSchemaTemplateListController);

	ResourceEquipmentGroupCompMaintSchemaTemplateListController.$inject = ['$scope', 'platformContainerControllerService', 'resourceEquipmentConstantValues'];

	function ResourceEquipmentGroupCompMaintSchemaTemplateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f05293aece8811ef9cd20242ac120002');
	}
})(angular);