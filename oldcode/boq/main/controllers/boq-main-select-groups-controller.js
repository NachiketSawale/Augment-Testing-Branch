/**
 * Created by reimer on 22.06.2017.
 */

(function () {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name basicsCharacteristicDataController
	 * @function
	 *
	 * @description
	 * controller for a characteristic data grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainSelectGroupsController', [
		'$scope',
		'$timeout',
		'platformGridAPI',
		'platformSchemaService',
		'platformUIConfigInitService',
		'boqMainSelectGroupsLayoutService',
		'boqMainTranslationService',
		'boqMainItemTypes2',
		'boqMainSelectGroupsService',
		function ($scope,
			$timeout,
			platformGridAPI,
			platformSchemaService,
			platformUIConfigInitService,
			layoutService,
			translationService,
			boqMainItemTypes2,
			boqMainSelectGroupsService) {

			var _modifiedItems = [];

			$scope.isBusy = false;
			$scope.busyInfo = '';

			var _params = $scope.$parent.modalOptions.params;
			$scope.selectedItem = null; // selected characteristic data item (needed for watching!)

			$scope.gridId = _params.gridId;

			var domainSchema = platformSchemaService.getSchemaFromCache({typeName: 'BoqItemDto', moduleSubModule: 'Boq.Main'});
			domainSchema.properties._selected = {domain: 'boolean'};  // for checkbox only

			var config = platformUIConfigInitService.provideConfigForListView(layoutService.getLayout(), domainSchema.properties, translationService);

			$scope.gridData = {
				state: $scope.gridId
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: _params.data,
					columns: angular.copy(config.columns),
					id: $scope.gridId,
					options: {
						tree: true,
						parentId: '_BoqItemFk',
						parentProp: '_BoqItemFk',
						childProp: 'BoqItems',
						indicator: true,
						iconClass: '',
						// idProperty: 'ID'
						enableDraggableGroupBy: false
					},
					lazyInit: true,
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
			}

			var refreshGrid = function () {
				platformGridAPI.grids.refresh($scope.gridId, true);
			};

			function onCellModified(e, arg) {

				var baseItem = null;
				var selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
				if (selected) {
					var col = arg.grid.getColumns()[arg.cell].field;
					var rootItem = arg.grid.getData().getItems()[0];
					var modifiedItems = [];

					if (col === 'BasItemType2Fk') {
						modifiedItems = boqMainSelectGroupsService.setItemType(rootItem, selected, selected.BasItemType2Fk);
					}

					if (col === '_selected') {

						if (selected._selected) {
							modifiedItems = boqMainSelectGroupsService.setSelected(rootItem, selected);
						}
						else {
							if      (selected.BasItemType2Fk === boqMainItemTypes2.basePostponed)      { selected.BasItemType2Fk = boqMainItemTypes2.base; }
							else if (selected.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded) { selected.BasItemType2Fk = boqMainItemTypes2.alternative; }
							boqMainSelectGroupsService.add2ModifiedItems(selected, _modifiedItems);

							if (!boqMainSelectGroupsService.hasSelectedItems(rootItem, selected.AGN)) {  // must have a base item!
								baseItem = boqMainSelectGroupsService.getBaseItem(rootItem, selected.AGN);
								if (baseItem) {
									modifiedItems = boqMainSelectGroupsService.setSelected(rootItem, baseItem);
								}
							}
						}
					}

					if (col === 'AAN') {
						if (selected.AAN === 0) {
							modifiedItems = boqMainSelectGroupsService.setSelected(rootItem, selected);
						}
						else {
							if      (selected.BasItemType2Fk === boqMainItemTypes2.basePostponed)      { selected.BasItemType2Fk = boqMainItemTypes2.base; }
							else if (selected.BasItemType2Fk === boqMainItemTypes2.alternativeAwarded) { selected.BasItemType2Fk = boqMainItemTypes2.alternative; }
							selected._selected = false;
							boqMainSelectGroupsService.add2ModifiedItems(selected, _modifiedItems);

							if (!boqMainSelectGroupsService.hasSelectedItems(rootItem, selected.AGN)) {   // must have a base item!
								baseItem = boqMainSelectGroupsService.getBaseItem(rootItem, selected.AGN);
								if (baseItem) {
									modifiedItems = boqMainSelectGroupsService.setSelected(rootItem, baseItem);
								}
							}
						}
					}

					// boqMainSelectGroupsService.ensureAllAANsAreUnique(rootItem, selected.AGN); --> todo

					if (modifiedItems.length > 0) {
						refreshGrid();
						boqMainSelectGroupsService.merge2ModifiedItems(modifiedItems, _modifiedItems);
					}

				}
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);

			$scope.createItem = function () {
			};

			$scope.deleteItem = function () {
			};

			// Define standard toolbar Icons and their function on the scope
			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 'collapse',
						sort: 0,
						caption: 'cloud.common.toolbarCollapse',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse',
						fn: function () {
							platformGridAPI.rows.collapseNextNode($scope.gridId);
						},
						disabled: false
					},
					{
						id: 'expand',
						sort: 10,
						caption: 'cloud.common.toolbarExpand',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand',
						fn: function () {
							platformGridAPI.rows.expandNextNode($scope.gridId);
						},
						disabled: false
					},
					{
						id: 'collapseall',
						sort: 0,
						caption: 'cloud.common.toolbarCollapseAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse-all',
						fn: function () {
							platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
						},
						disabled: false
					},
					{
						id: 'expandall',
						sort: 0,
						caption: 'cloud.common.toolbarExpandAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand-all',
						fn: function () {
							platformGridAPI.rows.expandAllSubNodes($scope.gridId);
						},
						disabled: false
					}
				]
			};

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

			function onSelectedRowsChanged() {

				var selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
				}
			}

			var init = function () {
				angular.noop();
			};
			init();

			$scope.canStart = function () {
				return true;
			};

			$scope.okClicked = function () {
				platformGridAPI.grids.commitAllEdits();
				boqMainSelectGroupsService.saveChangedItems(_modifiedItems).then(function () {
					$timeout(function () {
						_params.boqMainService.load();
						$scope.close(true);
					}, 0);
				}
				);
			};

			$scope.close = function (success) {
				$scope.$parent.$close(success || false);
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellModified);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
			});

		}
	]);
})();
