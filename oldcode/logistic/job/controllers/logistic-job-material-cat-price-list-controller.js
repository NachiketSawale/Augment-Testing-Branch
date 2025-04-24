/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobMaterialCatPriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job  entities.
	 **/

	angular.module(moduleName).controller('logisticJobMaterialCatPriceListController', LogisticJobMaterialCatPriceListController);

	LogisticJobMaterialCatPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobMaterialCatPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '01f5e790a9e9416da8f7c4171e9ece5d');
	}
})(angular);