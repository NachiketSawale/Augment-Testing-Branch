/**
 * Created by cakiral on 04.11.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActionListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of project main action entities.
	 **/

	angular.module(moduleName).controller('projectMainActionListController', ProjectMainActionListController);

	ProjectMainActionListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCostGroupAssignmentService', 'projectMainActionDataService',
		'platformValidationServiceFactory', 'projectMainActionLayoutService'];

	function ProjectMainActionListController($scope, platformContainerControllerService,  basicsCostGroupAssignmentService, projectMainActionDataService,
	                                         platformValidationServiceFactory, projectMainActionLayoutService) {
		platformContainerControllerService.initController($scope, moduleName, '67d04e0fce4442519adf8fb786749bbf');
		projectMainActionDataService.costGroupService.registerCellChangedEvent($scope.gridId);

		function costGroupLoaded(costGroupCatalogs){
			basicsCostGroupAssignmentService.addCostGroupColumns($scope.gridId, projectMainActionLayoutService, costGroupCatalogs, projectMainActionDataService, platformValidationServiceFactory);
		}

		projectMainActionDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('$destroy', function () {
			projectMainActionDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			projectMainActionDataService.costGroupService.unregisterCellChangedEvent($scope.gridId);
		});
	}
})(angular);