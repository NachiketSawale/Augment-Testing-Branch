/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.maintenance';

	/**
	 * @ngdoc controller
	 * @name resourceMaintenanceSchemaListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource maintenance schema entities.
	 **/

	angular.module(moduleName).controller('resourceMaintenanceSchemaListController', ResourceMaintenanceSchemaListController);

	ResourceMaintenanceSchemaListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMaintenanceSchemaListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3218a6cca2b4415ea455785bbe633285');
	}
})(angular);