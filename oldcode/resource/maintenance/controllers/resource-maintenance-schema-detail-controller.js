/**
 * Created by baf on 13.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.maintenance';

	/**
	 * @ngdoc controller
	 * @name resourceMaintenanceSchemaDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource maintenance schema entities.
	 **/
	angular.module(moduleName).controller('resourceMaintenanceSchemaDetailController', ResourceMaintenanceSchemaDetailController);

	ResourceMaintenanceSchemaDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMaintenanceSchemaDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '7f8efe8f35b34937aaf023d76ae30172');
	}

})(angular);