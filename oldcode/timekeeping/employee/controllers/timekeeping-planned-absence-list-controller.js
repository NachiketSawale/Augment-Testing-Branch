/**
 * Created by leo on 09.05.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingPlannedAbsenceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of timekeeping planned absence entities.
	 **/

	angular.module(moduleName).controller('timekeepingPlannedAbsenceListController', TimekeepingPlannedAbsenceListController);

	TimekeepingPlannedAbsenceListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCostGroupAssignmentService',
		'timekeepingPlannedAbsenceDataService', 'timekeepingPlannedAbsenceValidationService', 'timekeepingPlannedAbsenceLayoutService'];

	function TimekeepingPlannedAbsenceListController($scope, platformContainerControllerService, basicsCostGroupAssignmentService, timekeepingPlannedAbsenceDataService, timekeepingPlannedAbsenceValidationService, timekeepingPlannedAbsenceLayoutService) {
		platformContainerControllerService.initController($scope, moduleName, 'fdf3f45827f6410f8c89536f03982064');

		timekeepingPlannedAbsenceDataService.costGroupService.registerCellChangedEvent($scope.gridId);

		function costGroupLoaded(costGroupCatalogs){
			basicsCostGroupAssignmentService.addCostGroupColumns($scope.gridId, timekeepingPlannedAbsenceLayoutService, costGroupCatalogs, timekeepingPlannedAbsenceDataService, timekeepingPlannedAbsenceValidationService);
		}

		timekeepingPlannedAbsenceDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('$destroy', function () {
			timekeepingPlannedAbsenceDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			timekeepingPlannedAbsenceDataService.costGroupService.unregisterCellChangedEvent($scope.gridId);
		});
	}
})(angular);