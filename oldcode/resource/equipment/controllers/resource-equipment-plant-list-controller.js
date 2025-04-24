/**
 * Created by baf on 2017/08/23.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant entities.
	 **/
	angModule.controller('resourceEquipmentPlantListController', ResourceEquipmentPlantListController);


	ResourceEquipmentPlantListController.$inject = ['$scope','platformContainerControllerService', 'resourceEquipmentGroupSidebarWizardService'];

	function ResourceEquipmentPlantListController($scope, platformContainerControllerService, resourceEquipmentGroupSidebarWizardService) {
		platformContainerControllerService.initController($scope, moduleName, 'b71b610f564c40ed81dfe5d853bf5fe8');

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				{
					id: 't11',
					caption: 'resource.equipment.toolbarNewByPlantGroup',
					type: 'item',
					iconClass: 'tlb-icons ico-new',
					fn: function () {
						resourceEquipmentGroupSidebarWizardService.createPlant(true);
					},
				}
			]
		});
	}
})();