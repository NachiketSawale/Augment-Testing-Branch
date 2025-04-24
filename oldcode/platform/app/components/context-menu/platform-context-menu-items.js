(() => {
	'use strict';

	angular.module('platform').factory('platformContextMenuItems', platformContextMenuItems);

	platformContextMenuItems.$inject = ['_', 'platformGridAPI', 'platformContextMenuTypes', 'platformGridDomainService', 'cloudDesktopDesktopLayoutSettingsService'];

	function platformContextMenuItems(_, platformGridAPI, platformContextMenuTypes, platformGridDomainService, cloudDesktopDesktopLayoutSettingsService) {
		let moduleItems;

		function getModuleItems() {
			if(!moduleItems) {
				moduleItems = _.flattenDeep(_.map(cloudDesktopDesktopLayoutSettingsService.getRibGroups(), 'tiles'));
			}

			return moduleItems;
		}

		function changeGoToDescription(goToItems, duplicateValues) {
			for(let item of goToItems) {
				if(duplicateValues.includes(item.id.replace('n_', ''))) {
					item.caption = `${item.caption}  (${item.info.columnName})`;
				}
			}
			return goToItems;
		}

		function checkMultipleModuleNames(goToItems) {
			let objectModuleNames = goToItems.map(x => x.id.replace('n_', ''));
			let duplicateValues = findDuplicates(objectModuleNames);

			if(duplicateValues.length > 0) {
				goToItems = changeGoToDescription(goToItems, duplicateValues);
			}

			return _.sortBy(goToItems, 'caption');
		}

		function getNavigationBtnObject(goToItems) {
			goToItems = checkMultipleModuleNames(goToItems);

			if (goToItems.length > 1) {
				return [{
					id: 'contextMenuNaviBtn',
					caption: 'cloud.common.Navigator.goTo',
					cssClass: 'tlb-icons ico-goto',
					type: 'dropdown-btn',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					list: {
						cssClass: 'dropdown-menu-right',
						showImages: false,
						items: goToItems
					},
					contextGroup: 1
				}];
			} else {
				goToItems[0].contextGroup = 1;
				return goToItems;
			}
		}

		function isSortingAllowed(contextMenuObject) {
			if(contextMenuObject) {
				let grid = platformGridAPI.grids.element('id', contextMenuObject.gridId);
				let column = contextMenuObject.headerElem.data('column');
				if (column) {
					return !isSortable(column, grid);
				}
				return false;
			} else {
				return false;
			}
		}

		function isSortable(column, grid) {
			return column.sortable && (grid.options && grid.options.enableColumnSort);
		}

		function sortingGridHeader(item, ascending, type) {
			let grid = platformGridAPI.grids.element('id', item.contextMenu.gridId);
			let column = item.contextMenu.headerElem.data('column');
			column.ascending = ascending;
			if(type !== 3) {
				grid.instance.setSortColumn(column.id, column.ascending);
			} else {
				grid.instance.setSortColumns([]);
			}
			platformGridAPI.items.sort(grid.id, column.field, column.ascending ? 'sort-asc' : 'sort-desc');
		}

		function getGridCopyPasteItems(grid) {
			let saveConfiguration = platformGridAPI.grids.getSaveConfiguration(grid.id);
			return [
				{
					id: 'gridExportCopy',
					caption: 'cloud.common.exportCopy',
					tooltip: 'cloud.common.exportCopyTooltip',
					type: 'item',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 4,
					fn: function (id, item) {
						platformGridAPI.grids.copySelection(item.contextMenu.gridId);
					}
				},
				{
					id: 'gridCopyCellRange',
					type: 'item',
					caption: 'cloud.common.exportArea',
					tooltip: 'cloud.common.exportAreaTooltip',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 4,
					fn: function (id, item) {
						if (platformGridAPI.grids.setAllowCopySelection(item.contextMenu.gridId, true)) {
							grid.scope.$parent.getUiAddOns().disableToolbar(null);
							grid.scope.$parent.inCopyMode = true;
						}
					}
				},

				{
					id: 'gridExportPaste',
					caption: 'cloud.common.exportPaste',
					tooltip: 'cloud.common.exportPasteTooltip',
					type: 'item',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 4,
					fn: function (id, item) {
						platformGridAPI.grids.pasteSelection(item.contextMenu.gridId);
					}
				},
				{
					id: 'gridExportWithHeader',
					caption: 'cloud.common.exportWithHeader',
					tooltip: 'cloud.common.exportWithHeaderTooltip',
					type: 'check',
					contextAreas: [platformContextMenuTypes.gridRow.type],
					contextGroup: 4,
					value: saveConfiguration && saveConfiguration.copyWithHeader ? saveConfiguration.copyWithHeader : false,
					fn: function (id, item) {
						platformGridAPI.grids.setCopyWithHeader( item.contextMenu.gridId, !this.value, true);
					}
				}
			];
		}

		function getItemsForGridHeader() {
			return [
				{
					id: 'gridColumnResize',
					caption: 'cloud.common.contextMenu.gridColumnResize',
					type: 'item',
					iconClass: 'tlb-icons ico-column-width-optimal',
					fn: function (id, item) {
						let gridInstance = platformGridAPI.grids.element('id', item.contextMenu.gridId).instance;
						gridInstance.getPluginByName('AutoColumnSize').resizeColumn(item.contextMenu.headerElem);
					},
					isOnlyContext: true,
					contextAreas: [platformContextMenuTypes.gridColumnHeader.type]
				},
				{
					id: 'gridMinimumWidth',
					caption: 'cloud.common.contextMenu.gridMinimumWidth',
					type: 'item',
					iconClass: 'tlb-icons ico-column-width-optimal',
					fn: function (id, item) {
						let gridInstance = platformGridAPI.grids.element('id', item.contextMenu.gridId).instance;
						gridInstance.getPluginByName('AutoColumnSize').resizeColumnToHeader(item.contextMenu.headerElem);
					},
					isOnlyContext: true,
					contextAreas: [platformContextMenuTypes.gridColumnHeader.type]
				},
				{
					id: 'gridColumnSortAscending',
					caption: 'cloud.common.contextMenu.gridColumnSortAscending',
					type: 'item',
					iconClass: 'tlb-icons ico-sorting-ascending',
					disabled: function () {
						return isSortingAllowed(this.contextMenu);
					},
					fn: function (id, item) {
						sortingGridHeader(item, true, 1);
					},
					isOnlyContext: true,
					contextAreas: [platformContextMenuTypes.gridColumnHeader.type]
				},
				{
					id: 'gridColumnSortDescending',
					caption: 'cloud.common.contextMenu.gridColumnSortDescending',
					type: 'item',
					iconClass: 'tlb-icons ico-sorting-descending',
					disabled: function () {
						return isSortingAllowed(this.contextMenu);
					},
					fn: function (id, item) {
						sortingGridHeader(item, false, 2);
					},
					isOnlyContext: true,
					contextAreas: [platformContextMenuTypes.gridColumnHeader.type]
				},
				{
					id: 'gridColumnRemoveSort',
					caption: 'cloud.common.contextMenu.gridColumnRemoveSort',
					type: 'item',
					iconClass: 'tlb-icons ico-sorting-remove',
					disabled: function () {
						return isSortingAllowed(this.contextMenu);
					},
					fn: function (id, item) {
						sortingGridHeader(item, false, 3);
					},
					isOnlyContext: true,
					contextAreas: [platformContextMenuTypes.gridColumnHeader.type]
				}
			];
		}

		function findDuplicates(_Array) {
			let duplicates = [];
			let uniqueValues = {};
			for (let i = 0; i < _Array.length; i++) {
				let value = _Array[i];
				if (uniqueValues[value]) {
					if (duplicates.indexOf(value) === -1) {
						duplicates.push(value);
					}
				} else {
					uniqueValues[value] = true;
				}
			}
			return duplicates;
		}

		function setGridRowGoToObject(grid) {
			let goToItems = [];

			if(grid) {
				let goToColumns = _.filter(grid.columns.visible, function(column) {
					return platformGridDomainService.getConditionForNaviBtn(column);
				});

				if(goToColumns && goToColumns.length > 0) {
					let selectedRows = grid.instance.getSelectedRows();
					let entity = grid.instance.getDataItem(selectedRows[0]);
					angular.forEach(goToColumns, function(column) {
						let _Object = platformGridDomainService.getConfigObjectNavigator(column, entity);

						if(_Object.showNavigator) {
							goToItems.push({
								id: 'n_' + _Object.moduleName,
								caption: _Object.description,
								type: 'item',
								iconClass: 'app-small-icons ' + getNavigatorIconClass(_Object.moduleName),
								cssClass: 'context-menu-item',
								contextAreas: [platformContextMenuTypes.gridRow.type],
								info: {
									columnName: column.displayName
								},
								fn: function (item, object, info) {
									platformGridDomainService.navigatorCallFunction(column, entity, info.e);
								}
							});
						}
					});
				}
			}

			return goToItems.length > 0 ? getNavigationBtnObject(goToItems) : [];
		}

		function getNavigatorIconClass(moduleName) {
			let item = _.find(getModuleItems(), {'id': moduleName});
			return item ? item.iconClass : 'ico-goto';
		}

		function getItemForContextMenu(toolbarItems) {
			let lastItem;
			/*
			Here is a general items for the context menu.
			Because some toolbar functions can also be initialized in different modules.
			*/
			const toolbarIconsList = [{
				cssClass: 'tlb-icons ico-new',
				contextGroup: 2
			}, {
				cssClass: 'tlb-icons ico-rec-new',
				contextGroup: 2
			}, {
				cssClass: 'tlb-icons ico-fld-ins-below',
				contextGroup: 2
			}, {
				cssClass: 'tlb-icons ico-copy-paste-deep',
				contextGroup: 2
			}, {
				cssClass: 'tlb-icons ico-sub-fld-new',
				contextGroup: 2
			}];

			let newByContextItem = _.filter(toolbarIconsList, function(tItems) {
				let item = toolbarItems.find(e => e.iconClass === tItems.cssClass);
				if(item) {
					item.contextAreas = [platformContextMenuTypes.gridRow.type];
					item.contextGroup = tItems.contextGroup || 99;
					lastItem = item;
				}
				return item;
			});

			if(lastItem) {
				let index = toolbarItems.findIndex(e => e.id === lastItem.id);
				toolbarItems.splice(index + 1, 0, {
					id: 'dividerNews',
					hideItem: false,
					contextAreas: [platformContextMenuTypes.gridRow.type],
					isOnlyContext: true,
					type: 'divider',
					contextGroup: lastItem.contextGroup
				});
			}

			return toolbarItems;
		}


		function setItemsForContextMenu(toolbarItems) {
			let endResult = [];
			toolbarItems = _.sortBy(toolbarItems, 'contextGroup');
			const result = Object.groupBy(toolbarItems, ({ contextGroup }) => contextGroup);

			_.forEach(result, function(group, key) {
				group.push({
					id: 'divider_' + key,
					hideItem: false,
					contextAreas: [platformContextMenuTypes.gridRow.type],
					type: 'divider',
					contextGroup: key
				});

				endResult = endResult.concat(group);
			});

			return endResult;
		}

		function setContextGroupNew() {
			return {
				contextAreas: [platformContextMenuTypes.gridRow.type],
				contextGroup: 2
			};
		}

		return {
			getGridCopyPasteItems: getGridCopyPasteItems,
			getItemsForGridHeader: getItemsForGridHeader,
			setGridRowGoToObject: setGridRowGoToObject,
			setItemsForContextMenu: setItemsForContextMenu,
			setContextGroupNew: setContextGroupNew
		};
	}
})();