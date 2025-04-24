/**
 * Created by baf on 29.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment location entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentLocationListController', ResourceEquipmentLocationListController);

	ResourceEquipmentLocationListController.$inject = ['$scope', 'platformContainerControllerService',
		'resourceCommonPlantJobLocationToolService', 'resourceEquipmentPlantLocationDataService'];

	function ResourceEquipmentLocationListController($scope, platformContainerControllerService,
	  resourceCommonPlantJobLocationToolService, resourceEquipmentPlantLocationDataService) {

		platformContainerControllerService.initController($scope, moduleName, '7e44180e839c44fa98189a3481bb8087');

		var filterConfig = resourceEquipmentPlantLocationDataService.getConfiguration();

		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			items: [
				resourceCommonPlantJobLocationToolService.getFilterConfig(filterConfig)
			]
		});
	}
})(angular);