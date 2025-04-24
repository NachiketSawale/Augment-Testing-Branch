/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainConfidenceCheckController
	 * @function
	 *
	 * @description
	 * Controller for the Confidence Check for Estimate.
	 **/

	angular.module(moduleName).controller('estimateMainConfidenceCheckController',
		['_','$rootScope','$scope', '$timeout', '$injector', 'platformGridAPI', 'platformGridControllerService', 'estimateMainCommonUIService',
			'estimateMainConfidenceCheckService','estimateDefaultGridConfig','reportingPrintService','platformGenericStructureService','estimateMainFilterService','estimateMainService','estimateCommonControllerFeaturesServiceProvider',

			function (_,$rootScope,$scope, $timeout, $injector, platformGridAPI, platformGridControllerService, estimateMainCommonUIService,
				estimateMainConfidenceCheckService,estimateDefaultGridConfig,reportingPrintService,platformGenericStructureService,estimateMainFilterService,estimateMainService,estimateCommonControllerFeaturesServiceProvider) {

				$scope.options = {
					gridData: {
						'state': $scope.getContainerUUID()
					},
					marker: {
						multiSelect: platformGenericStructureService.getMarkerState()
					},
					isGenericGroup: platformGenericStructureService.isGenericGroup
				};

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					version: 0,
					items: [
						{
							id: 't111',
							sort: 112,
							caption: 'cloud.common.gridlayout',
							iconClass: 'tlb-icons ico-settings',
							type: 'item',
							fn: function () {
								platformGridAPI.configuration.openConfigDialog($scope.getContainerUUID());
							},
							disabled: function () {
								return $scope.showInfoOverlay;
							}
						},
						{
							id: 't1',
							sort: 110,
							caption: 'cloud.common.taskBarSearch',
							type: 'check',
							value: false,
							iconClass: 'tlb-icons ico-search',
							fn: function () {
								platformGridAPI.filters.showSearch($scope.getContainerUUID(), this.value);
							},
							disabled: function () {
								return $scope.showInfoOverlay;
							}
						},
						{
							id: 't109',
							sort: 111,
							caption: 'cloud.common.print',
							iconClass: 'tlb-icons ico-print-preview',
							type: 'item',
							fn: function () {
								reportingPrintService.printGrid($scope.getContainerUUID());
							},
							disabled: function () {
								return $scope.showInfoOverlay;
							}
						},
						{
							id: 'd1',
							sort: 55,
							type: 'divider'
						},
						{
							id: 't7',
							sort: 60,
							caption: 'cloud.common.toolbarCollapse',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function collapseSelected() {
								platformGridAPI.rows.collapseNextNode($scope.getContainerUUID());
							}
						},
						{
							id: 't8',
							sort: 70,
							caption: 'cloud.common.toolbarExpand',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function expandSelected() {
								platformGridAPI.rows.expandNextNode($scope.getContainerUUID());
							}
						},
						{
							id: 't9',
							sort: 80,
							caption: 'cloud.common.toolbarCollapseAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function collapseAll() {
								platformGridAPI.rows.collapseAllSubNodes($scope.getContainerUUID());
							}
						},
						{
							id: 't10',
							sort: 90,
							caption: 'cloud.common.toolbarExpandAll',
							type: 'item',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function expandAll() {
								platformGridAPI.rows.expandAllSubNodes($scope.getContainerUUID());
							}
						},
						{
							id: 'd2',
							sort: 100,
							type: 'divider'
						},
						{
							id: 't11',
							sort: 200,
							caption: 'cloud.common.toolbarRefresh',
							type: 'item',
							iconClass: 'tlb-icons ico-refresh',
							fn: function refresh() {
								estimateMainConfidenceCheckService.refresh();
							}
						},
						{
							id: 't11',
							sort: 110,
							caption: 'cloud.common.toolbarFilter',
							type: 'item',
							iconClass: 'tlb-icons ico-filter-off',
							disabled: () => !platformGenericStructureService.isFilterEnabled(),
							fn: function filterOff() {
								platformGenericStructureService.removeMarkers();
								platformGridAPI.grids.refresh($scope.getContainerUUID());
								platformGenericStructureService.clearFilteredItems();
								platformGenericStructureService.enableFilter(false);
								$rootScope.$emit('filterIsActive', false);
								$scope.tools.update();
								platformGenericStructureService.dataService.refresh(); // ALM # 93005 force refresh after filter is switch off rei@4.10.19
							}
						},
						{
							id: 'd3',
							sort: 100,
							type: 'divider'
						},
						{
							id: 't12',
							sort: 120,
							caption: 'cloud.common.toolbarSelectionMode',
							type: 'check',
							value: $scope.options.marker.multiSelect,
							iconClass: 'tlb-icons ico-selection-multi',
							fn: function toogleSelectionMode() {
								if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
									// get marker/filter column def ...
									let cols = platformGridAPI.columns.configuration($scope.getContainerUUID());
									let filterCol = _.find(cols.current, {id: 'marker'});
									if (filterCol && filterCol.editorOptions) {
										// ... switch multiselect and save
										filterCol.editorOptions.multiSelect = !filterCol.editorOptions.multiSelect;
										$scope.options.marker.multiSelect = !$scope.options.marker.multiSelect;
										platformGenericStructureService.postProcessColumns($scope.getContainerUUID(), 'current');
										platformGridAPI.columns.configuration($scope.getContainerUUID(), cols.current);
										platformGenericStructureService.removeMarkers();
										platformGridAPI.grids.refresh($scope.getContainerUUID());
										platformGenericStructureService.clearFilteredItems();
										$rootScope.$emit('filterIsActive', false);
										platformGenericStructureService.enableFilter(false);
										$scope.tools.update();
									}
								}
							}
						}
					],
					update: function () {
						++$scope.tools.version;
					}
				});

				// state of grouping configuration
				$scope.state = [];

				let gridConfig = angular.extend({
						marker : {
							filterService: estimateMainFilterService,
							filterId: 'estimateMainConfidenceCheckController',
							dataService: estimateMainConfidenceCheckService,
							serviceName: 'estimateMainConfidenceCheckService'
						},
						parentProp: 'EstConfidenceParentFk',
						childProp: 'EstConfidenceCheckChildrens',
						propagateCheckboxSelection: true,
						type: 'estConfidenceCheck'
					}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['DescriptionInfo','Count'],
						{
							serviceName: 'estimateMainConfidenceCheckService',
							itemName :'EstConfidenceCheck',
							RootServices : ['estimateMainBoqService', 'estimateMainRootService', 'estimateMainConfidenceCheckService']
						}
					);

				platformGridControllerService.initListController($scope, uiService, estimateMainConfidenceCheckService, estimateMainConfidenceCheckService, gridConfig);

				estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

				let toolsIds = ['d0', 'create', 'd0', 'createChild', 'delete', 'd1','treeGridAccordion','gridSearchAll','gridSearchColumn','t199','t13'];
				let bulkEditortool = [140,10];

				$scope.tools.items  = $scope.tools.items.filter(item => !toolsIds.includes(item.id));

				$scope.tools.items  = $scope.tools.items.filter(item => !bulkEditortool.includes(item.sort));

				estimateMainConfidenceCheckService.setShowHeaderAfterSelectionChanged(function (lineItemEntity /* , data */) {
					estimateMainService.updateModuleHeaderInfo(lineItemEntity);
				});
				estimateMainService.updateModuleHeaderInfo(estimateMainService.getSelected());
				estimateMainService.setIsEstimate(true);

				estimateMainService.onContextUpdated.register(estimateMainConfidenceCheckService.loadConfidenceCheck);
				estimateMainConfidenceCheckService.loadConfidenceCheck(); // load default data when open the container

				$scope.$on('$destroy', function () {
					estimateMainConfidenceCheckService.unregisterSelectionChanged(estimateMainConfidenceCheckService.clear());
					estimateMainService.onContextUpdated.unregister(estimateMainConfidenceCheckService.loadConfidenceCheck);
				});

			}]);

})(angular);