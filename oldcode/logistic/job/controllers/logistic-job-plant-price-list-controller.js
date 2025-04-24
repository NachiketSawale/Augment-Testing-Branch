/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantPriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job plant price entities.
	 **/

	angular.module(moduleName).controller('logisticJobPlantPriceListController', LogisticJobPlantPriceListController);

	LogisticJobPlantPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobPlantPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e8ceec4dc6d54974a27159588c65962d');
	}
})(angular);