
(function () {
	'use strict';

	let moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingStructureProjectController', ['$scope','platformCreateUuid','$injector','platformGridAPI','platformGridControllerService','controllingStructureProjectUiService',
		'controllingStructureProjectDataService','$timeout',
		function ($scope,platformCreateUuid,$injector,platformGridAPI,platformGridControllerService,controllingStructureProjectUiService,controllingStructureProjectDataService,$timeout) {

			let myGridConfig = {
				initCalled: false,
				columns:[],
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				multiSelect: false
			};

			$scope.gridId = 'bee917ce51824a8ab6d2a74aee2b6f1d';

			$scope.gridData = {
				state: $scope.gridId
			};

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};

			$scope.onContentResized = function () {
				resize();
			};

			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

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
							controllingStructureProjectDataService.showCreateDialog();
						},
						disabled: function () {
							return controllingStructureProjectDataService.getIsReadOnly();
						}
					},
					{
						id: 'delete',
						sort: 2,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function onDelete() {
							let selItem = platformGridAPI.rows.selection({gridId: $scope.gridId});

							platformGridAPI.rows.delete({
								gridId: $scope.gridId,
								item: selItem
							});
							// updateTools();
							platformGridAPI.grids.refresh($scope.gridId, true);
						},
						disabled: function () {
							return controllingStructureProjectDataService.getIsReadOnly();
						}
					}
				],
				update: function () {
					return;
				}
			};


			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, controllingStructureProjectUiService, controllingStructureProjectDataService, null, myGridConfig);
			}
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			init();

			$scope.$on('$destroy', function () {
				controllingStructureProjectDataService.refreshData();
			});
		}
	]);
})();