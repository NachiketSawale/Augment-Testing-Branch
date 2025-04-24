/**
 * Created by baf on 20.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentMeterReadingListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource equipment meterReading entities.
	 **/

	angular.module(moduleName).controller('resourceEquipmentMeterReadingListController', ResourceEquipmentMeterReadingListController);

	ResourceEquipmentMeterReadingListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentMeterReadingListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0c898f4872c244e599379151ebd8830f');
	}
})(angular);