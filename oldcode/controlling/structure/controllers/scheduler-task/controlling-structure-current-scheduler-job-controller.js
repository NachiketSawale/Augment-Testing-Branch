
(function () {
	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingStructureCurrentSchedulerJobController', ['$scope','platformCreateUuid','$injector','platformGridAPI','platformGridControllerService','controllingStructureCurrentSchedulerJobUiService','controllingStructureCurrentSchedulerJobDataService',
		function ($scope,platformCreateUuid,$injector,platformGridAPI,platformGridControllerService,controllingStructureCurrentSchedulerJobUiService,controllingStructureCurrentSchedulerJobDataService) {

			let myGridConfig = {
				initCalled: false,
				columns:[],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				multiSelect: false
			};

			$scope.gridId = platformCreateUuid();

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'create',
						sort: 0,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							controllingStructureCurrentSchedulerJobDataService.createItem();
							controllingStructureCurrentSchedulerJobDataService.setSelectedRow($scope.gridId);
							$injector.get('controllingStructureCostGroupAssignmentDataService').setList();
						},
						disabled: false
					},
					{
						id: 't1',
						caption: 'services.schedulerui.stopJob',
						type: 'item',
						cssClass: 'tlb-icons ico-stop',
						fn: function () {
							controllingStructureCurrentSchedulerJobDataService.stopJob();
						},
						disabled: function () {
							let selected = controllingStructureCurrentSchedulerJobDataService.getSelected();
							return !selected || (selected.JobState !== 2 && selected.JobState !== 5);
						}
					},
				],
				update: function () {
					return;
				}
			};


			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, controllingStructureCurrentSchedulerJobUiService, controllingStructureCurrentSchedulerJobDataService, null, myGridConfig);
			}
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			init();

			$scope.$on('$destroy', function () {
				controllingStructureCurrentSchedulerJobDataService.refreshData();
			});
		}
	]);
})();