/**
 * Created by baf on 07.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingEmployeeDefaultDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping employee default entities.
	 **/
	angular.module(moduleName).controller('timekeepingEmployeeDefaultDetailController', TimekeepingEmployeeDefaultDetailController);

	TimekeepingEmployeeDefaultDetailController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCostGroupAssignmentService',
		'timekeepingEmployeeDefaultDataService', 'timekeepingEmployeeDefaultValidationService', 'timekeepingEmployeeDefaultLayoutService'];

	function TimekeepingEmployeeDefaultDetailController($scope, platformContainerControllerService, basicsCostGroupAssignmentService, timekeepingEmployeeDefaultDataService, timekeepingEmployeeDefaultValidationService, timekeepingEmployeeDefaultLayoutService) {
		platformContainerControllerService.initController($scope, moduleName, '5c0b3429333b401a90057101a209c85c');

		$scope.formOptions.configure.dirty = function dirty(entity, field, options) {
			if (timekeepingEmployeeDefaultDataService.costGroupService) {
				timekeepingEmployeeDefaultDataService.costGroupService.createCostGroup2Save(entity, {
					costGroupCatId: options.costGroupCatId, field: options.model
				});
			}
		};

		function costGroupLoaded(costGroupCatalogs) {
			basicsCostGroupAssignmentService.refreshDetailForm(costGroupCatalogs, {
				scope: $scope,
				dataService: timekeepingEmployeeDefaultDataService,
				validationService: timekeepingEmployeeDefaultValidationService,
				formConfiguration: timekeepingEmployeeDefaultLayoutService,
				costGroupName: 'referenceGroup'
			}
			);
		}

		timekeepingEmployeeDefaultDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('destroy', function () {
			timekeepingEmployeeDefaultDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
		});
	}
})(angular);
