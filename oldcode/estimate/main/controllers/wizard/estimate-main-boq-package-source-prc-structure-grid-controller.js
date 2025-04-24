(function () {
	'use strict';
	/* global _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainBoqPackageSourcePrcStructureGridController', ['$scope', '$injector', 'platformGridAPI', 'platformTranslateService', 'basicsLookupdataLookupControllerFactory',
		'_', 'platformRuntimeDataService', 'estimateMainCreatePackageWizardSelectionPageCommonService',
		function ($scope, $injector, platformGridAPI, platformTranslateService, basicsLookupdataLookupControllerFactory,
				  _, platformRuntimeDataService, estimateMainCreatePackageWizardSelectionPageCommonService) {

			let gridId = '84C6496230BE48348541DAEACB2D8440';
			$scope.gridData = {
				state: gridId
			};
			$scope.gridId = gridId;

			let columns = [
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					name$tr$: 'cloud.common.entityCode',
					width: 200
				}, {
					id: 'description',
					field: 'DescriptionInfo',
					name: 'Description',
					toolTip: 'Description',
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription',
					width: 270
				}, {
					id: 'prcStructureTypeFk',
					field: 'PrcStructureTypeFk',
					name: 'Type',
					name$tr$: 'cloud.common.entityType',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PrcStructureType',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'basicsProcurementStructureImageProcessor'
					},
					width: 155
				}];

			estimateMainCreatePackageWizardSelectionPageCommonService.init($scope, {
				gridId: gridId,
				parentProp: 'PrcStructureFk',
				childProp: 'ChildItems',
				additionalCols: columns
			});

			const gridConfig = $scope.getGridConfig();
			$scope.tools = null;
			if (platformGridAPI.grids.exist(gridId)) {
				$scope.unregisterHeaderCheckBoxChanged(gridId);
				platformGridAPI.grids.unregister(gridId);
			}
			basicsLookupdataLookupControllerFactory.create({
				grid: true,
				dialog: true,
				search: false
			}, $scope, gridConfig);
			$scope.registerHeaderCheckBoxChanged(gridId);

			let toolItems = [];
			toolItems.push(
				{
					id: 't7',
					sort: 60,
					caption: 'cloud.common.toolbarCollapse',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse',
					fn: function collapseSelected() {
						platformGridAPI.rows.collapseNode($scope.gridId);
					}
				},
				{
					id: 't8',
					sort: 70,
					caption: 'cloud.common.toolbarExpand',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand',
					fn: function expandSelected() {
						platformGridAPI.rows.expandNode($scope.gridId);
					}
				},
				{
					id: 't9',
					sort: 80,
					caption: 'cloud.common.toolbarCollapseAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse-all',
					fn: function collapseAll() {
						platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
					}
				},
				{
					id: 't10',
					sort: 90,
					caption: 'cloud.common.toolbarExpandAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: function expandAll() {
						platformGridAPI.rows.expandAllSubNodes($scope.gridId);
					}
				});

			$scope.tools.items = toolItems.concat($scope.tools.items);
			$scope.tools.items = _.filter($scope.tools.items, function (d) {
				return d.id !== 't12';
			});
		}
	]);
})();
