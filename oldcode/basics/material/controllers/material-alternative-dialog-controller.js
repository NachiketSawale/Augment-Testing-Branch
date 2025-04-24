/**
 * Created by alm on 11/12/2020.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc controller
     * @name materialAlternativeDialogController
     * @requires $scope
     * @description
     * #
     * Controller for Alternative dialog
     */
	/* jshint -W072 */
	angular.module('basics.material').controller('materialAlternativeDialogController', [
		'_','$scope','$translate','platformGridAPI',
		function (_,$scope, $translate,platformGridAPI) {
			$scope.options = $scope.$parent.modalOptions;
			var gridId='8A5BC558CAC9437CBFD876B064128AAD';
			$scope.gridData = {
				state: gridId
			};
			function setupGrid(){
				if (!platformGridAPI.grids.exist(gridId)) {
					var columns=[
						{
							id: 'Code',
							field: 'Code',
							name: 'Code',
							name$tr$: 'cloud.common.entityCode',
							formatter: 'Code'
						},
						{
							id: 'Description',
							formatter: 'translation',
							field: 'DescriptionInfo',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription'
						},
						{
							id: 'PriceUnitUomInfo',
							field: 'PriceUnitUomInfo',
							name: 'PriceUnitUomInfo',
							name$tr$: 'cloud.common.entityPriceUnitUoM',
							formatter: 'translation'
						},
						{
							id: 'CatalogCode',
							field: 'CatalogCode',
							name: 'CatalogCode',
							name$tr$: 'basics.material.record.materialCatalog',
							formatter: 'Code'
						},
						{
							id: 'CatalogDescriptionInfo',
							field: 'CatalogDescriptionInfo',
							name: 'CatalogDescriptionInfo',
							name$tr$: 'basics.material.record.materialCatalogDescription',
							formatter: 'translation'
						},
						{
							id: 'Cost',
							field: 'Cost',
							name: 'Cost',
							name$tr$: 'basics.material.record.costPrice',
							formatter: 'decimal'
						},
						{
							id: 'Currency',
							field: 'Currency',
							name: 'Currency',
							name$tr$: 'cloud.common.entityCurrency'
						}
					];
					_.forEach(columns,function(col){
						col.grouping = {
							title: col.name,
							getter: col.field,
							aggregators: [],
							aggregateCollapsed: true
						};
					});
					var gridConfig = {
						columns:columns,
						data: [],
						id: gridId,
						lazyInit: true,
						options: {
							tree: false,
							indicator: false,
							idProperty: 'Id',
							iconClass: '',
							enableDraggableGroupBy: true,
							editorLock: new Slick.EditorLock(),
							enableConfigSave: true
						},
						enableConfigSave: true
					};
					platformGridAPI.grids.config(gridConfig);

				}
			}
			function  setupGridData() {
				var gridData=$scope.options.alternativeList;
				platformGridAPI.items.data(gridId,gridData);
			}
			setupGrid();
			setupGridData();

			function setTools(tools) {
				$scope.tools = tools || {};
				$scope.tools.update = function () {};
			}

			setTools(
				{
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't4',
							caption: 'cloud.common.toolbarSearch',
							type: 'check',
							value: platformGridAPI.filters.showSearch(gridId),
							iconClass: 'tlb-icons ico-search',
							fn: function () {
								platformGridAPI.filters.showSearch(gridId, this.value);
							}
						},
						{
							id: 't16',
							sort: 10,
							caption: 'cloud.common.taskBarGrouping',
							type: 'check',
							iconClass: 'tlb-icons ico-group-columns',
							fn: function () {
								platformGridAPI.grouping.toggleGroupPanel(gridId, this.value);
							},
							value: platformGridAPI.grouping.toggleGroupPanel(gridId),
							disabled: false
						},
						{
							id: 't111',
							sort: 111,
							caption: 'cloud.common.gridlayout',
							iconClass: 'tlb-icons ico-settings',
							type: 'item',
							fn: function () {
								platformGridAPI.configuration.openConfigDialog(gridId);
							}
						}
					]
				});


			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist(gridId)){
					platformGridAPI.grids.unregister(gridId);
				}
			});

		}
	]);
})(angular);