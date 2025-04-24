/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainRiskImportFieldsController
	 * @requires $scope
	 * @description Shows grid in dialog
	 */
	angular.module(moduleName).controller('estimateMainRiskImportFieldsController',
		['$scope', '$timeout', 'platformCreateUuid',
			'platformGridAPI', 'platformGridControllerService','basicsRiskRegisterStandardConfigurationService',
			'basicsRiskRegisterDataService', 'basicsCommonHeaderColumnCheckboxControllerService',
			function ($scope, $timeout, platformCreateUuid,
				platformGridAPI, platformGridControllerService, gridUIConfigService,
				gridDataService, basicsCommonHeaderColumnCheckboxControllerService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'RiskRegisterParentFk',
					childProp: 'RiskRegisters',
					collapsed: false,
					enableDraggableGroupBy: false,
					skipPermissionCheck: true,
					multiSelect: true,
					rowChangeCallBack: function () {
					},
					cellChangeCallBack: function () {
					}
				};

				$scope.gridId = 'bc2b5d99cbd84a5f87d885007a4a125d';

				$scope.onContentResized = function () {
					resize();
				};

				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.version += 1;
					};
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
							id: 'Dv0',
							type: 'divider'
						},
						{
							id: 'collapse',
							type: 'item',
							caption: 'cloud.common.toolbarCollapse',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function (){
								let selected = platformGridAPI.rows.selection({gridId:$scope.gridId});
								platformGridAPI.rows.collapseAllSubNodes($scope.gridId,selected);

							}
						},
						{
							id: 'expand',
							type: 'item',
							caption: 'cloud.common.toolbarExpand',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function (){
								let selected = platformGridAPI.rows.selection({gridId:$scope.gridId});
								platformGridAPI.rows.expandAllSubNodes($scope.gridId,selected);

							}
						},
						{
							id: 'collapse-all',
							type: 'item',
							caption: 'cloud.common.toolbarCollapseAll',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function (){
								platformGridAPI.rows.collapseAllNodes($scope.gridId);
							}
						},
						{
							id: 'expand-all',
							type: 'item',
							caption: 'cloud.common.toolbarExpandAll',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function (){
								platformGridAPI.rows.expandAllNodes($scope.gridId);
							}
						}
					],
					update: function () {
						return;
					}
				};

				let isLoaded = false;
				let headerCheckBoxFields = ['isFilter'];
				let headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn:  function (){
						// let risks = gridDataService.getList();
						}
					}
				];

				function init() {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);

					basicsCommonHeaderColumnCheckboxControllerService.init($scope, gridDataService, headerCheckBoxFields, headerCheckBoxEvents);

					if(!isLoaded) {
						gridDataService.load().then(function () {
							gridDataService.getList();
						});
						isLoaded = true;
					}
				}

				$scope.$on('$destroy', function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}
				});

				init();
			}]);
})();
