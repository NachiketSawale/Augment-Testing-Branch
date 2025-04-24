/**
 * Created by leo on 09.05.2018
 */

(function (angular) {

	'use strict';
	const moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc controller
	 * @name timekeepingPlannedAbsenceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of timekeeping planned absence entities.
	 **/
	angular.module(moduleName).controller('timekeepingPlannedAbsenceDetailController', TimekeepingPlannedAbsenceDetailController);

	TimekeepingPlannedAbsenceDetailController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCostGroupAssignmentService',
		'timekeepingPlannedAbsenceDataService', 'timekeepingPlannedAbsenceValidationService', 'timekeepingPlannedAbsenceLayoutService'];

	function TimekeepingPlannedAbsenceDetailController($scope, platformContainerControllerService, basicsCostGroupAssignmentService, timekeepingPlannedAbsenceDataService, timekeepingPlannedAbsenceValidationService, timekeepingPlannedAbsenceLayoutService) {
		platformContainerControllerService.initController($scope, moduleName, '4933b71664ea4c4db200937bd6e39cdb', 'timekeepingEmployeeTranslationService');

		$scope.formOptions.configure.dirty= function dirty (entity,field, options) {
			if (timekeepingPlannedAbsenceDataService.costGroupService){
				timekeepingPlannedAbsenceDataService.costGroupService.createCostGroup2Save(entity,{
					costGroupCatId:options.costGroupCatId, field: options.model
				});
			}
		};

		function costGroupLoaded(costGroupCatalogs) {
			basicsCostGroupAssignmentService.refreshDetailForm(costGroupCatalogs,{
				scope: $scope,
				dataService:timekeepingPlannedAbsenceDataService,
				validationService: timekeepingPlannedAbsenceValidationService,
				formConfiguration: timekeepingPlannedAbsenceLayoutService,
				costGroupName:'referenceGroup'
			}
			);
		}

		timekeepingPlannedAbsenceDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('destroy',function () {
			timekeepingPlannedAbsenceDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
		});
	}

})(angular);
