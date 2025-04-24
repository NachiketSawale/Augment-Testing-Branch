/**
 * Created by shen on 11/22/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticPoolJobPlantAllocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job pool job entities.
	 **/

	angular.module(moduleName).controller('logisticPoolJobPlantAllocationListController', LogisticPoolJobPlantAllocationListController);

	LogisticPoolJobPlantAllocationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPoolJobPlantAllocationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b9f78054eff04353bb9ec9ed464b4c75');
	}
})(angular);
