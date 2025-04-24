/**
 * Created by baf on 08.02.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobMaterialCatPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job  entities.
	 **/
	angular.module(moduleName).controller('logisticJobMaterialCatPriceDetailController', LogisticJobMaterialCatPriceDetailController);

	LogisticJobMaterialCatPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobMaterialCatPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2f3c295af8024ecc8f8fd55518417e84', 'logisticJobTranslationService');
	}

})(angular);