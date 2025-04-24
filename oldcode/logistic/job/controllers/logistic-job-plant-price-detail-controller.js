/**
 * Created by leo on 12.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job  entities.
	 **/
	angular.module(moduleName).controller('logisticJobPlantPriceDetailController', LogisticJobPlantPriceDetailController);

	LogisticJobPlantPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPlantPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4c30f0a003a047eea2528d8c44eddbde', 'logisticJobTranslationService');
	}

})(angular);