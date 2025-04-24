/**
 * Created by shen on 11/22/2021
 */

(function (angular) {

	'use strict';
	let moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticPoolJobPlantAllocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job pool job plant entities.
	 **/
	angular.module(moduleName).controller('logisticPoolJobPlantAllocationDetailController', LogisticPoolJobPlantAllocationDetailController);

	LogisticPoolJobPlantAllocationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPoolJobPlantAllocationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0e60d9f3a3944796b3f4b3ba342c8002');
	}

})(angular);
