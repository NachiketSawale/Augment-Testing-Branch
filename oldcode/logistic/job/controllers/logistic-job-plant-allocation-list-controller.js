/**
 * Created by baf on 31.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantAllocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job plantAllocation entities.
	 **/

	angular.module(moduleName).controller('logisticJobPlantAllocationListController', LogisticJobPlantAllocationListController);

	LogisticJobPlantAllocationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPlantAllocationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '432068179c654b419d3d42d7153d10f8');
	}
})(angular);