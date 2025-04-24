/**
 * Created by cakiral on 04.11.2020
 */

(function (angular) {

	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc controller
	 * @name projectMainActionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of project main action entities.
	 **/
	angular.module(moduleName).controller('projectMainActionDetailController', ProjectMainActionDetailController);

	ProjectMainActionDetailController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCostGroupAssignmentService', 'projectMainActionDataService',
		'platformValidationServiceFactory', 'projectMainActionLayoutService'];

	function ProjectMainActionDetailController($scope, platformContainerControllerService, basicsCostGroupAssignmentService, projectMainActionDataService,
	                                           platformValidationServiceFactory, projectMainActionLayoutService) {
		platformContainerControllerService.initController($scope, moduleName, 'a9c6b70e70be4043b540e2aa69a4b5c2');
		$scope.formOptions.configure.dirty= function dirty (entity,field, options) {
			if (projectMainActionDataService.costGroupService){
				projectMainActionDataService.costGroupService.createCostGroup2Save(entity,{
					costGroupCatId:options.costGroupCatId, field: options.model
				});
			}
		};

		function costGroupLoaded(costGroupCatalogs) {
			basicsCostGroupAssignmentService.refreshDetailForm(costGroupCatalogs,{
				scope: $scope,
				dataService:projectMainActionDataService,
				validationService: platformValidationServiceFactory,
				formConfiguration:projectMainActionLayoutService,
				costGroupName:'referenceGroup'
			}
			);
		}

		projectMainActionDataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

		$scope.$on('destroy',function () {
			projectMainActionDataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
		});

	}

})(angular);