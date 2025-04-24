/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job  entities.
	 **/

	angular.module(moduleName).controller('logisticJobEquipmentCatPriceListController', LogisticJobEquipmentCatPriceListController);

	LogisticJobEquipmentCatPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobEquipmentCatPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '361273dab16942fa97c7c51b43b9d361');
	}
})(angular);