/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.maintenance';

	/**
	 * @ngdoc controller
	 * @name resourceMaintenanceSchemaRecordListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of resource maintenance schemaRecord entities.
	 **/

	angular.module(moduleName).controller('resourceMaintenanceSchemaRecordListController', ResourceMaintenanceSchemaRecordListController);

	ResourceMaintenanceSchemaRecordListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ResourceMaintenanceSchemaRecordListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1dad2033d1b24f4bac55849d549b9c52');
	}
})(angular);