/**
 * Created by baf on 20.05.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentMeterReadingDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment meterReading entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentMeterReadingDetailController', ResourceEquipmentMeterReadingDetailController);

	ResourceEquipmentMeterReadingDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentMeterReadingDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4e5a48e1ff614608841430ce1a19101c');
	}

})(angular);