/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeDefaultListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping employee default entities.
	 **/

	angular.module(moduleName).controller('timekeepingEmployeeDefaultListController', TimekeepingEmployeeDefaultListController);

	TimekeepingEmployeeDefaultListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCostGroupAssignmentService',
		'timekeepingEmployeeDefaultDataService', 'timekeepingEmployeeDefaultValidationService', 'timekeepingEmployeeDefaultLayoutService'];

	function TimekeepingEmployeeDefaultListController($scope, platformContainerControllerService, basicsCostGroupAssignmentService, timekeepingEmployeeDefaultDataService, timekeepingEmployeeDefaultValidationService, timekeepingEmployeeDefaultLayoutService) {
		platformContainerControllerService.initController($scope, moduleName, 'e5a38b354fe84b39b6d541ec661acb7e');

		timekeepingEmployeeDefaultDataService.costGroupService.registerCellChangedEvent($scope.gridId);

		function costGroupLoaded(costGroupCatalogs){
			basicsCostGroupAssignmentService.addCostGroupColumns($scope.gridId, timekeepingEmployeeDefaultLayoutService, costGroupCatalogs, timekeepingEmployeeDefaultDataService, timekeepingEmployeeDefaultValidationService);
		}

		timekeepingEmployeeDefaultDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('$destroy', function () {
			timekeepingEmployeeDefaultDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			timekeepingEmployeeDefaultDataService.costGroupService.unregisterCellChangedEvent($scope.gridId);
		});
	}
})(angular);