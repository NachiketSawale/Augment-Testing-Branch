/**
 * Created by cakiral on 30.07.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.project';

	/**
	 * @ngdoc controller
	 * @name resourceProjectPlantCostCodeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource project plantCostCode entities.
	 **/

	angular.module(moduleName).controller('resourceProjectPlantCostCodeListController', ResourceProjectPlantCostCodeListController);

	ResourceProjectPlantCostCodeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceProjectPlantCostCodeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f11be052b2c711e9a2a32a2ae2dbcce4');
	}
})(angular);