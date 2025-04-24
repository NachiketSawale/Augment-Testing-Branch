/**
 * Created by baf on 17.11.2017
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentMaintenanceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment maintenance entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentMaintenanceDetailController', ResourceEquipmentMaintenanceDetailController);

	ResourceEquipmentMaintenanceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentMaintenanceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '76ea5f472fa14838915bad3b76e64f43', 'resourceEquipmentTranslationService');
	}

})(angular);