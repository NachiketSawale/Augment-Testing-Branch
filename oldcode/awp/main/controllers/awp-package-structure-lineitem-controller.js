/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	angular.module('awp.main').controller('awpPackageStructureLineItemController', structureController);

	structureController.$inject = [
		'$scope',
		'$translate',
		'_',
		'$timeout',
		'platformGridAPI',
		'mainViewService',
		'reportingPrintService',
		'platformGridControllerService',
		'awpGroupingItemStructureService',
		'awpPackageStructureLineItemUIService',
		'awpGroupingType',
		'awpPackageStructureLineItemService',
		'controllingProjectcontrolsDashboardControllerExtendService',
		'awpPackageStructureLineItemInfo'
	];

	function structureController($scope, $translate, _, $timeout, platformGridAPI, mainViewService, reportingPrintService, platformGridControllerService,
		groupingItemStructureService, uiConfigurationService, groupingType, dataService, dashboardControllerExtendService, dataInfo) {
		$scope.config = uiConfigurationService.getStandardConfigForListView();
		$scope.scheme = uiConfigurationService.getDtoScheme();
		$scope.groupingColumns = angular.copy(groupingType);

		const projectGridId = 'd5665cb64a6a4d21b6df4b57e1f0d171';

		dashboardControllerExtendService.renameColumns($scope.config.columns);
		const estimateHeader = 'estimate_header';

		let myGridConfig = {
			initCalled: false,
			idProperty: 'Id',
			parentProp: 'ParentFk',
			childProp: 'Children',
			options: {
				tree: true,
				treePrintable: true,
				showDescription: false
			},
			passThrough: {
				treePrintable: true
			},
			columns: []
		};

		platformGridControllerService.initListController($scope, uiConfigurationService, dataService, null, myGridConfig);

		dataService.setGridId($scope.gridId);

		const sb = $scope.getUiAddOns().getStatusBar();

		sb.showFields([
			{align: 'right', id: 'label_estimate', cssClass: 'font-bold', toolTip: '', type: 'text', visible: true, value: $translate.instant('awp.main.estimateHeader') + ': '},
			{
				id: estimateHeader,
				align: 'right',
				type: 'dropdown-btn',
				toolTip:$translate.instant('awp.main.estimateHeader')
			}]);

		sb.setVisible(true);

		function getTranslation(item){
			if(item && item.Code){
				return item.Code;
			}
			return '';
		}

		updateConfigField();

		function updateConfigField(selectedConfig){
			let configItems = _.map(dataInfo.getEstHeaders(), function (item) {
				return {
					id: item.Id,
					caption: getTranslation(item),
					type: 'item',
					fn: function (e, args) {
						dataInfo.setSelectedEstHeaderById(args.id);
						updateConfigFieldInternal(args.caption);
						//refresh the container
						dataService.load();
					}
				};
			});

			function updateConfigFieldInternal(caption) {
				sb.updateFields([{
					id: estimateHeader,
					align: 'right',
					type: 'dropdown-btn',
					toolTip:$translate.instant('awp.main.estimateHeader'),
					value: caption,
					list: {
						items: configItems
					}
				}]);
			}

			updateConfigFieldInternal(selectedConfig || '');
		}

		/******************************************************************************************
		 *  Lifecycle Hooks for generic structure container.
		 ******************************************************************************************/
		dashboardControllerExtendService.extendForGenericStructure($scope, dataService, groupingItemStructureService);

		// toolbar definition
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
					disabled: function () {
						return !dataService.getGroupingstate().length;
					},
					fn: function refresh() {
						dataService.load();
					}
				}
			],
			update: function () {
				++$scope.tools.version;
			}
		});

		function getGroupingColumnsTranslation(groupingColumns) {
			if (groupingColumns) {
				_.forEach(groupingColumns, (item) => {
					item.name = $translate.instant(item.name$tr$);
				});
			}
		}

		getGroupingColumnsTranslation($scope.groupingColumns);

		dataService.forceLoadService();

		function onGridRenderCompleted() {
			platformGridAPI.events.unregister($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);
			if (_.isFunction(dataService.forceReloadAfterFirstInit)) {
				dataService.forceReloadAfterFirstInit();
				dataService.forceReloadAfterFirstInit = null;
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);

		function loadEstHeaderOfProject(){
			const selected = platformGridAPI.rows.selection({gridId: projectGridId});
			if(selected){
				dataInfo.setProjectSelected(selected);
				dataInfo.loadEstHeaders(function(estHeaders){
					if(estHeaders && angular.isArray(estHeaders) && estHeaders.length){
						updateConfigField(estHeaders[0].Code);
						dataInfo.setEstHeaderSelected(estHeaders[0]);
					}
				});
			}
		}

		platformGridAPI.events.register(projectGridId, 'onSelectedRowsChanged', loadEstHeaderOfProject);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister(projectGridId, 'onSelectedRowsChanged', loadEstHeaderOfProject);
		});
	}
})(angular);