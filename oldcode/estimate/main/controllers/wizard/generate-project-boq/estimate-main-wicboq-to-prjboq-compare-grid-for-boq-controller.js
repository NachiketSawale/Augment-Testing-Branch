/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	/**
     * @ngdoc controller
     * @name estimateMainWicboqToPrjboqCompareGridForBoqController
     * @requires $scope
     * @description
     */
	angular.module(moduleName).controller('estimateMainWicboqToPrjboqCompareGridForBoqController', ['$scope', '$timeout', 'platformCreateUuid', 'platformGridAPI', 'platformGridControllerService',
		'estimateMainWicboqToPrjboqCompareUiForBoqService',
		'estimateMainWicboqToPrjboqCompareDataForBoqService',
		'estimateMainGeneratePrjboqClipboardService',
		function ($scope, $timeout, platformCreateUuid, platformGridAPI, platformGridControllerService,
			gridUIConfigService,
			gridDataService,
			estimateMainGeneratePrjboqClipboardService) {
			let parentScope = $scope.$parent;
			let myGridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'BoqItemFk',
				childProp: 'BoqItems',
				type: 'boqitem',
				property: 'Reference',
				collapsed: false,
				enableDraggableGroupBy: false,
				skipPermissionCheck: true,
				multiSelect: false,
				dragDropService: estimateMainGeneratePrjboqClipboardService
			};


			$scope.gridId = '1570d6ae23b24e218f8770c4afd04220';

			$scope.getContainerUUID = function () {
				return $scope.gridId;
			};

			$scope.setTools = function () {};

			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'collapse',
						sort: 20,
						caption: 'cloud.common.toolbarCollapse',
						type: 'item',
						iconClass: ' tlb-icons ico-tree-collapse-all',
						fn: function () { platformGridAPI.rows.collapseAllSubNodes($scope.gridId);},
						disabled: false
					},
					{
						id: 'expand',
						sort: 21,
						caption: 'cloud.common.toolbarExpand',
						type: 'item',
						iconClass: ' tlb-icons ico-tree-expand-all',
						fn: function () { platformGridAPI.rows.expandAllSubNodes($scope.gridId);},
						disabled: false
					}
				],
				update: function () {
				}
			};

			function init() {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, myGridConfig);

				if(!parentScope.entity.loadedPrjBoq){
					gridDataService.loadData().then(function () {
						parentScope.isReady = true;
						parentScope.entity.loadedPrjBoq = true;
					});
				}
				else{
					parentScope.isReady = true;
				}

				parentScope.$watch('isCatLoading', function(isLoading){
					$scope.isLoading = isLoading;
				});

				gridDataService.setScope($scope);
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			init();
		}]);
})();
