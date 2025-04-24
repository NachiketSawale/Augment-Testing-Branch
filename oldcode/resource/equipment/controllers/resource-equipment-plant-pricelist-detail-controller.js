/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantPricelistDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant pricelist entities
	 **/
	angModule.controller('resourceEquipmentPlantPricelistDetailController', ResourceEquipmentPricelistDetailController);

	ResourceEquipmentPricelistDetailController.$inject = ['$scope','platformContainerControllerService'];

	function ResourceEquipmentPricelistDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2d915e6ca9db4c4ba1d03bb09c3aea0e');
	}
})();