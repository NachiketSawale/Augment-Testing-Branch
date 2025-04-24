/**
 * Created by baf on 31.08.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantAllocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job plantAllocation entities.
	 **/
	angular.module(moduleName).controller('logisticJobPlantAllocationDetailController', LogisticJobPlantAllocationDetailController);

	LogisticJobPlantAllocationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPlantAllocationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f683b9900aa54c5db4eb359a1ab85115');
	}

})(angular);