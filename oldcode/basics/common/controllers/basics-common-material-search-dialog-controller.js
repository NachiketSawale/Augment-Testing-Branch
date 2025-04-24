(function (angular) {
	'use strict';
	/* global Slick,_ */
	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonMaterialSearchDialogController', ['$scope', '$translate', '$injector', 'platformGridAPI', '$timeout', '$popupInstance',
		'keyCodes', 'platformTranslateService', 'materialCategoriesDropdownService', 'materialSearchOptionFilterService', 'searchFilter',
		function ($scope, $translate, $injector, platformGridAPI, $timeout, $popupInstance,
			keyCodes, platformTranslateService, materialCategoriesDropdownService, searchOptionFilterService, searchFilter) {

			let self = this;

			function updateTools() {
				$scope.tools = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					align: 'right',
					items: [
						{
							id: 'collapse',
							type: 'item',
							caption: 'cloud.common.toolbarCollapse',
							iconClass: 'tlb-icons ico-tree-collapse',
							fn: function () {
								let selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
								platformGridAPI.rows.collapseAllSubNodes($scope.gridId, selected);
							}
						},
						{
							id: 'expand',
							type: 'item',
							caption: 'cloud.common.toolbarExpand',
							iconClass: 'tlb-icons ico-tree-expand',
							fn: function () {
								let selected = platformGridAPI.rows.selection({gridId: $scope.gridId});
								platformGridAPI.rows.expandAllSubNodes($scope.gridId, selected);
							}
						},
						{
							id: 'collapse-all',
							type: 'item',
							caption: 'cloud.common.toolbarCollapseAll',
							iconClass: 'tlb-icons ico-tree-collapse-all',
							fn: function () {
								platformGridAPI.rows.collapseAllNodes($scope.gridId);
							}
						},
						{
							id: 'expand-all',
							type: 'item',
							caption: 'cloud.common.toolbarExpandAll',
							iconClass: 'tlb-icons ico-tree-expand-all',
							fn: function () {
								platformGridAPI.rows.expandAllNodes($scope.gridId);
							}
						}
					]
				};
			}

			function setupGrid() {
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					const resultGridConfig = {
						columns: [],
						data: [],
						id: $scope.gridId,
						options: {
							tree: true,
							indicator: false,
							childProp: 'ChildItems',
							idProperty: 'key',
							hierarchyEnabled: true,
							editorLock: new Slick.EditorLock(),
							initialState: 'collapse',
							treeColumnDescription: ['CodeDescription'],
							treeWidth: 380,
							treeHeaderCaption: $translate.instant('cloud.common.entityStructure')
						}
					};
					platformGridAPI.grids.config(resultGridConfig);
				}
			}

			function getIconClass(hasChildren, level) {
				if (level === 0) {
					return 'ico-folder-doc';
				} else if (level === 1 || hasChildren) {
					return 'ico-rubric-category';
				} else {
					return 'control-icons ico-folder-empty';
				}
			}

			function sortAndSetImagesToTree(items, level) {
				items = _.sortBy(items, ['Code']);
				_.each(items, (item) => {
					let description = item.DescriptionInfo ? item.DescriptionInfo.Translated : item.Description;
					item.CodeDescription = item.Code + ((description && description.length > 0) ? (' ' + description) : '');
					item.image = 'control-icons ' + getIconClass(item.HasChildren, level);
					if (item.ChildItems && item.ChildItems.length > 0) {
						sortAndSetImagesToTree(item.ChildItems, level + 1);
					}
				});

				return items;
			}

			function setCategoryName() {
				let categorySelectDescription = '';
				if ($scope.categorySelect && $scope.categorySelect.entity && $scope.categorySelect.entity.Code) {
					if ($scope.categorySelect.entity.DescriptionInfo && $scope.categorySelect.entity.DescriptionInfo.Translated) {
						categorySelectDescription = $scope.categorySelect.entity.DescriptionInfo.Translated;
					}
					$scope.CategoryName = $scope.categorySelect.entity.Code + ' ' + categorySelectDescription;
				} else {
					$scope.CategoryName = $scope.selectedCategory.Description;
				}
			}

			function initMaterialSearchOption() {
				let materialDefinitions = searchOptionFilterService.getMaterialSearchOption();
				if (materialDefinitions) {
					setMaterialSearchOption(materialDefinitions);
				} else {
					searchOptionFilterService.getMaterialDefinitions().then(function (result) {
						let filterDef = JSON.parse(result.FilterDef);
						$injector.get('basicsLookupdataLookupDescriptorService').updateData('basicsMaterialDefinitions', filterDef);
						filterDef = searchOptionFilterService.materialSearchOptionData(filterDef);
						setMaterialSearchOption(filterDef);
					});
				}
			}

			function setMaterialSearchOption(filterDef) {
				if (!filterDef) {
					return;
				}
				$scope.categorySelect = filterDef.category;
				$scope.selectedCategory = _.find($scope.materialOptionList.items, {Id: filterDef.mainCategoryId});
				angular.forEach($scope.materialOptionList.items, function (cat) {
					cat.active = undefined;
					if (cat.Id === filterDef.mainCategoryId) {
						cat.active = true;
					}
				});
				setCategoryName();
			}

			let estimateProjectRateBookConfigDataService = $injector.get('estimateProjectRateBookConfigDataService');

			function initializeGrid() {
				setupGrid();
				loadData();
			}

			function loadData() {
				let selCategoryId = $scope.selectedCategory ? $scope.selectedCategory.Id : 1;
				if (selCategoryId === 1) {
					$scope.isLoading = true;
					materialCategoriesDropdownService.getMaterialStructureTree(searchFilter?.IsTicketSystem, searchFilter?.IsFilterCompany).then(function (response) {
						let filterIds = estimateProjectRateBookConfigDataService.getFilterIds(4);
						let categories = [];
						if (filterIds && filterIds.length > 0) {
							_.each(response, function (item) {
								if (_.includes(filterIds, item.Id)) {
									categories.push(item);
								}
							});
						} else {
							categories = response;
						}
						assignmentGrid(categories);
						$scope.isLoading = false;
					}, function () {
						$scope.isLoading = false;
						selectionGridRow(null, 800);
					});
				} else if (selCategoryId === 2) {
					$scope.isLoading = true;
					materialCategoriesDropdownService.getStructureTree().then(function (response) {
						let structures = _.sortBy(response, 'Code');
						assignmentGrid(structures);
						$scope.isLoading = false;
					}, function () {
						$scope.isLoading = false;
						selectionGridRow(null, 800);
					});
				}
			}

			function iterateItem(list, childMember, handler) {
				list.forEach(item => {
					handler.call(item, item);

					const children = _.get(item, childMember);

					if (children) {
						iterateItem(children, childMember, handler);
					}
				});
			}

			/**
			 * #144476 - fix duplicated id issue when display catalog and group in one grid.
			 * @param data
			 */
			function generateKey(data) {
				iterateItem(data, 'ChildItems', function (item) {
					if (item.IsMaterialCatalog) {
						item.key = 'c' + item.Id;
					} else if (item.IsMaterialGroup) {
						item.key = 'g' + item.Id;
					} else {
						item.key = item.Id.toString();
					}
				});
			}

			function assignmentGrid(data) {
				data = sortAndSetImagesToTree(data, 0);
				self.currentTreeData = data;
				generateKey(data);
				updateGrid(data);
				selectionGridRow(data, 100);
			}

			function selectionGridRow(data, time) {
				$timeout(function () {
					if (!data) {
						data = self.currentTreeData;
					}
					if (!data) {
						data = platformGridAPI.items.data($scope.gridId);
					}
					platformGridAPI.rows.collapseAllNodes($scope.gridId);
					let findItem = [];
					if ($scope.categorySelect && $scope.categorySelect.entity && $scope.categorySelect.entity.Id
						&& platformGridAPI.items.data($scope.gridId)) {
						let key = $scope.categorySelect.entity.Id.toString();

						if($scope.categorySelect.type === 'material_cat') {
							key = 'c' + $scope.categorySelect.entity.Id;
						}
						if($scope.categorySelect.type === 'material_group') {
							key = 'g' + $scope.categorySelect.entity.Id;
						}

						if (findGridId(data, key, findItem)) {
							setSelectInGrid(findItem);
						}
					}
					$timeout(function () {
						let selectedRow = platformGridAPI.rows.selection({gridId: $scope.gridId});
						platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, selectedRow);
					}, 300);
				}, time);
			}

			function setSelectInGrid(items) {
				if (items && items.length > 0) {
					let itemId = _.map(items, 'key');
					let grid = platformGridAPI.grids.element('id', $scope.gridId);
					let rows = grid.dataView.mapIdsToRows([items[items.length - 1].key]);
					grid.instance.setSelectedRows(rows, true);
					if (itemId.length > 1) {
						let rowData = grid.dataView.getRows();
						$timeout(function () {
							expandChildItemNode(rowData, itemId);
							let rows = grid.dataView.mapIdsToRows([items[0].key]);
							grid.instance.setSelectedRows(rows, true);
						});
					}
				}
			}
			function expandChildItemNode(itemData, itemIds) {
				let findRow = _.find(itemData, {key: itemIds[itemIds.length - 1]});
				if (findRow) {
					platformGridAPI.rows.expandNode($scope.gridId, findRow);
					if (findRow.ChildItems && findRow.ChildItems.length > 0) {
						itemIds.length = itemIds.length - 1;
						expandChildItemNode(findRow.ChildItems, itemIds);
					}
				}
			}

			function findGridId(data, id, findItem) {
				if (_.find(data, {key: id})) {
					findItem.push(_.find(data, {key: id}));
					return true;
				}
				let isFind = false;
				_.forEach(data, function (item) {
					if (item.ChildItems && item.ChildItems.length > 0) {
						let hasItem = findGridId(item.ChildItems, id, findItem);
						if (hasItem) {
							findItem.push(item);
							isFind = true;
						}
					}
				});
				return isFind;
			}

			function updateGrid(resultGridData) {
				platformGridAPI.grids.invalidate($scope.gridId);
				platformGridAPI.items.data($scope.gridId, resultGridData);
			}

			function initializeVars() {
				$scope.gridId = '68022ffcb18246828e42482720951989';
				$scope.isLoading = false;
				$scope.loadingMessage = '';
				$scope.gridData = {
					state: $scope.gridId
				};
				initMaterialSearchOption();
			}

			const rowSelected = function () {
				let selectedRow = platformGridAPI.rows.selection({gridId: $scope.gridId});
				if (!selectedRow) {
					return;
				}
				if (selectedRow) {
					$scope.isBtnDisabled = false;
				}
			};

			const rowDoubleClick = function () {
				if(!$scope.categorySelect) {
					$scope.categorySelect = {};
				}

				$scope.categorySelect.entity = platformGridAPI.rows.selection({gridId: $scope.gridId});

				let materialDefinitions = searchOptionFilterService.getMaterialSearchOption() || {};

				if ($scope.categorySelect && $scope.categorySelect.entity) {
					$scope.categorySelect.type = getFlagForStructureType();
					materialDefinitions.category = $scope.categorySelect;
					materialDefinitions.mainCategoryId = $scope.selectedCategory.Id;
					$injector.get('basicsLookupdataLookupDescriptorService').updateData('basicsMaterialDefinitions', materialDefinitions);
					setCategoryName();
					let currentClose = $scope.$close;
					$timeout(function () {
						currentClose({
							isOk: true,
							categorySelect: $scope.categorySelect,
							mainCategoryId: $scope.selectedCategory.Id,
							categoryName: $scope.CategoryName
						});
					}, 100);
				} else {
					materialDefinitions.mainCategoryId = null;
					$injector.get('basicsLookupdataLookupDescriptorService').updateData('basicsMaterialDefinitions', materialDefinitions);
					$scope.$close({});
				}
			};

			function getFlagForStructureType() {
				let toReturn = 'prc_structure';
				if (angular.isUndefined($scope.categorySelect.entity.IsMaterialCatalog) && angular.isUndefined($scope.categorySelect.entity.IsMaterialGroup) && angular.isUndefined($scope.categorySelect.entity.IsLive)) {
					toReturn = $scope.categorySelect.type;
				} else if ($scope.categorySelect.entity.IsMaterialCatalog) {
					toReturn = 'material_cat';
				} else if ($scope.categorySelect.entity.IsMaterialGroup) {
					toReturn = 'material_group';
				}
				return toReturn;
			}

			function searchDataCount(data) {
				let count = 0;
				_.forEach(data, function (item) {
					count ++;
					if (item.ChildItems && item.ChildItems.length > 0) {
						count = count + searchDataCount(item.ChildItems);
					}
				});
				return count;
			}
			function searchCurrentData() {
				let filterData = forEachSearchData(self.currentTreeData, $scope.searchText);
				updateGrid(filterData);
				if (searchDataCount(filterData) < 1000 && $scope.searchText && $scope.searchText.length > 0) {
					platformGridAPI.rows.expandAllNodes($scope.gridId);
				} else if ($scope.searchText && $scope.searchText.length === 0) {
					platformGridAPI.rows.collapseAllNodes($scope.gridId);
				}
			}

			function forEachSearchData(items, value) {
				if (!value || value.length === 0) {
					return items;
				}
				let data = [];
				let searchKey = value.toString().toLowerCase();
				_.forEach(items, function (item) {
					if (item.Code.toLowerCase().indexOf(searchKey) > -1 || item.CodeDescription.toLowerCase().indexOf(searchKey) > -1) {
						let newItem = angular.copy(item);
						if (item.ChildItems && item.ChildItems.length > 0) {
							newItem.ChildItems = forEachSearchData(item.ChildItems, searchKey);
							newItem.HasChildren = newItem.ChildItems && newItem.ChildItems.length > 0;
						}
						data.push(newItem);
					} else {
						let newItem = angular.copy(item);
						if (item.ChildItems && item.ChildItems.length > 0) {
							newItem.ChildItems = forEachSearchData(item.ChildItems, searchKey);
							if (newItem.ChildItems && newItem.ChildItems.length > 0) {
								newItem.HasChildren = true;
								data.push(newItem);
							}
						}
					}
				});
				return data;
			}

			$scope.searchTextChange = function () {
				searchCurrentData();
			};

			$scope.htmlTranslate = {
				keyWord: $translate.instant('platform.searchPanelPlaceholder'),
			};

			$scope.materialOptionList = {
				displayMember: 'Description',
				valueMember: 'Id',
				items: [{
					Id: 1,
					Description: $translate.instant('basics.material.materialCatalog')
				}, {
					Id: 2,
					Description: $translate.instant('basics.common.entityPrcStructureFk')
				}]
			};
			$scope.selectedCategory = angular.copy($scope.materialOptionList.items[0]);
			$scope.CategoryName = $scope.selectedCategory.Description;

			$scope.materialOptionChange = function () {
				angular.forEach($scope.materialOptionList.items, function (cat) {
					cat.active = undefined;
					if (cat.Id === $scope.selectedCategory.Id) {
						cat.active = true;
					}
				});
				loadData();
			};

			$scope.onOK = rowDoubleClick;

			$scope.onCancel = function () {
				platformGridAPI.rows.collapseAllNodes($scope.gridId);
				$scope.$close({});
			};

			initializeVars();
			initializeGrid();
			updateTools();

			$popupInstance.onResizeStop.register(function () {
				platformGridAPI.grids.resize($scope.gridId);
			});
			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', rowSelected);
			platformGridAPI.events.register($scope.gridId, 'onDblClick', $scope.onOK);

			$scope.$on('$destroy', function () {
				platformGridAPI.rows.collapseAllNodes($scope.gridId);
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', rowSelected);
				platformGridAPI.events.unregister($scope.gridId, 'onDblClick', $scope.onOK);
				if ($scope.$close) {
					$scope.$close({});
				}
			});

		}
	]);
})(angular);