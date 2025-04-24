/**
 * Created by baf on 2023-08-11.
 */
(function () {

	'use strict';
	var moduleName = 'resource.plantestimate';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourcePlantEstimatePlantListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant entities.
	 **/
	angModule.controller('resourcePlantEstimatePlantListController', ResourcePlantEstimatePlantListController);

	ResourcePlantEstimatePlantListController.$inject = ['$scope','platformContainerControllerService'];

	function ResourcePlantEstimatePlantListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b71b610f564c40ed81dfe5d853bf5fe8');
	}
})();