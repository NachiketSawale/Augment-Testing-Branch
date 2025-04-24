/**
 * Created by janas on 12.11.2014.
 */

(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	/**
	 * @ngdoc controller
	 * @name controllingStructureListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of entity entities.
	 **/
	angular.module(moduleName).controller('controllingStructureGridController',
		['_', '$scope', 'platformContainerControllerService', 'controllingStructureMainService',
			'controllingStructurePlannedAttributesService', 'platformGridAPI', 'basicsWorkflowSidebarRegisterService',
			function (_, $scope, platformContainerControllerService, mainService, plannedAttributesService, platformGridAPI, basicsWorkflowSidebarRegisterService) {

				platformContainerControllerService.initController($scope, moduleName, '011CB0B627E448389850CDF372709F67');

				// updating tools for #100166 (wizard change company, disable delete button if necessary)
				function updateToolbar(canDelete) {
					_.set(_.find($scope.tools.items, {id: 'delete'}), 'disabled', !canDelete);
					$scope.tools.update();
					$scope.tools.refresh();
				}

				if (mainService.onToolsInvalid) {
					mainService.onToolsInvalid.register(updateToolbar);
				}

				if (mainService.onRowExpand) {
					mainService.onRowExpand.register(onRowExpand);
				}

				mainService.registerFilters();
				// unregister subscriptions
				$scope.$on('$destroy', function () {
					mainService.onToolsInvalid.unregister(updateToolbar);
					mainService.onRowExpand.unregister(onRowExpand);
					mainService.unregisterFilters();
				});

				function onRowExpand(parentRoot) {
					if (parentRoot) {
						platformGridAPI.rows.expandAllSubNodes($scope.gridId, parentRoot);// '011cb0b627e448389850cdf372709f67' gridId
					}
				}

				basicsWorkflowSidebarRegisterService.registerEntityForModule('B1C6FCF517F74AC1BE434740EC3E699B',
					moduleName,
					false,
					function () {
						return _.get(mainService.getSelected(), 'Id');
					},
					mainService.getList,
					angular.noop,
					mainService.load,
					function () {
						return _.map(mainService.getSelectedEntities(), 'Id');
					});
			}]);
})();
