/**
 * Created by baf on 13.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'resource.maintenance';

	/**
	 * @ngdoc controller
	 * @name resourceMaintenanceSchemaRecordDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of resource maintenance schemaRecord entities.
	 **/
	angular.module(moduleName).controller('resourceMaintenanceSchemaRecordDetailController', ResourceMaintenanceSchemaRecordDetailController);

	ResourceMaintenanceSchemaRecordDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMaintenanceSchemaRecordDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '03987f82b6b141f8b4481c4f52697c83');
	}

})(angular);