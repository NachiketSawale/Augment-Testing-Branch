/**
 * Created by baf on 29.05.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentLocationDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource equipment location entities.
	 **/
	angular.module(moduleName).controller('resourceEquipmentLocationDetailController', ResourceEquipmentLocationDetailController);

	ResourceEquipmentLocationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceEquipmentLocationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ca37d6c1dadb4c0387c94a86070e36ad');
	}


})(angular);