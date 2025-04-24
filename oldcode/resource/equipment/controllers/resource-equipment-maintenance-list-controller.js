/**
 * Created by baf on 17.11.2017
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentMaintenanceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment maintenance entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentMaintenanceListController', ResourceEquipmentMaintenanceListController);

	ResourceEquipmentMaintenanceListController.$inject = ['$scope', 'platformContainerControllerService','resourceEquipmentMaintenanceDataService'];

	function ResourceEquipmentMaintenanceListController($scope, platformContainerControllerService, resourceEquipmentMaintenanceDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'af1dcf780b1b49c48857b990b455ac3c');

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 't11',
					caption: 'cloud.common.toolbarNewByContext',
					type: 'item',
					iconClass: 'tlb-icons ico-new',
					fn: function () { resourceEquipmentMaintenanceDataService.createByContext(); },
					disabled: function () {
						if (resourceEquipmentMaintenanceDataService.getSelectedEntities().length !== 1) { return true; }
						else {return false;}

					}
				}
			]
		});
	}
})(angular);