/**
 * Created by baf on 08.02.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobEquipmentCatPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic job  entities.
	 **/
	angular.module(moduleName).controller('logisticJobEquipmentCatPriceDetailController', LogisticJobEquipmentCatPriceDetailController);

	LogisticJobEquipmentCatPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobEquipmentCatPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1f657746606c440fbac058367512dcef', 'logisticJobTranslationService');
	}

})(angular);