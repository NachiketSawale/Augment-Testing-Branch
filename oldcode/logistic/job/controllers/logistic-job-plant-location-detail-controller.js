/**
 * Created by baf on 14.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantLocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job plantLocation entities.
	 **/
	angular.module(moduleName).controller('logisticJobPlantLocationDetailController', LogisticJobPlantLocationDetailController);

	LogisticJobPlantLocationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPlantLocationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2ffdfe986c504939857e1171b8a10610');
	}

})(angular);