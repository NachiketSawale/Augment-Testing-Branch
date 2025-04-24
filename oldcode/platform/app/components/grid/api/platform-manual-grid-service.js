/* globals angular */

(function (angular) {
	'use strict';

	function platformManualGridService(_, platformGridAPI) {

		return {
			addNewRowInGrid: addNewRowInGrid,
			updateGridData: updateGridData,
			moveSelectedRows: moveSelectedRows,
			moveRowInGrid: moveRowInGrid,
			isMoveBtnDisabled: isMoveBtnDisabled,
			deleteSelectedRow: deleteSelectedRows,
			deleteRows: deleteRows,
			isDeleteBtnDisabled: isDeleteBtnDisabled,
			isRowSelected: isRowSelected,
			selectRowByIndex: function (gridId, index) {
				var data = platformGridAPI.items.data(gridId);
				selectRowByIndex(gridId, data, index);
			},
			selectRowById: selectRowById,
			resizeGridContainer: resizeGridContainer
		};

		/**
		 * @ngdoc function
		 * @name addNewRowInGrid
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Add a new row in grid and select it
		 * @param {( int )} gridId The ID of the grid.
		 * @param {( object )} rowItem The item which should be added to the grid.
		 */
		function addNewRowInGrid(gridId, rowItem) {
			if (platformGridAPI) {
				platformGridAPI.rows.add({gridId: gridId, item: rowItem});
				platformGridAPI.rows.scrollIntoViewByItem(gridId, rowItem);
			}
		}

		/**
		 * @ngdoc function
		 * @name updateGridData
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Set a new grid data object and select a row.
		 * @param {( int )} gridId The ID of the grid.
		 * @param {( object )} itemsData The grid items data object
		 * @param {{ object }} selectedItem The item that should be selected
		 */
		function updateGridData(gridId, itemsData, selectedItem) {
			platformGridAPI.items.data(gridId, itemsData);
			selectGridRowByItems(gridId, selectedItem);
		}

		function selectGridRowByItems(gridId, items) {
			if (items && (platformGridAPI.rows.selection({gridId: gridId}) !== items)) {
				platformGridAPI.rows.selection({
					gridId: gridId,
					rows: _.isArray(items) ? items : [items]
				});
			}
		}

		function selectRowByIndex(gridId, gridItems, index) {
			var item;
			if (gridItems && gridItems.length) {
				item = gridItems[index];
				selectGridRowByItems(gridId, item);
			}
		}

		/**
		 * @ngdoc function
		 * @name selectRowById
		 * @function
		 * @methodOf platformManualGridService
		 * @description
		 * @param { string } gridId The id of the grid
		 * @param { string } id The value of the id to search for
		 * @param { string } idMember Optional name of the property which contains the id. If nothing passed, 'id' will be used.
		 * @returns { object } Grid row object
		 */
		function selectRowById(gridId, id, idMember) {
			var prop = idMember || 'id';
			var data = platformGridAPI.items.data(gridId);
			var item = _.find(data, function (item) {
				return item[prop] === id;
			});

			if (item) {
				selectGridRowByItems(gridId, item);
			}
		}

		function prepareGridForChanges(gridId) {
			// first commit the editors
			platformGridAPI.grids.commitEdit(gridId);
		}

		function getSelectedRows(gridId, sortedBy) {
			var prop, selectedItems;

			selectedItems = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
			if (angular.isDefined(selectedItems) && angular.isArray(selectedItems) && selectedItems.length > 1) {
				prop = sortedBy || 'id';
				selectedItems = selectedItems.sort(function (a, b) {
					return a[prop] - b[prop];
				});
			}

			return selectedItems;
		}

		function moveRowInGrid(gridId, direction) {
			moveSelectedRows(gridId, direction);
		}

		/**
		 * @ngdoc function
		 * @name moveSelectedRows
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Move one or more rows within the grid
		 * @param {( int )} gridId The ID of the grid.
		 * @param {( string )} direction Specifies the direction of the movement. Possible values are 'up', 'down', 'top' and 'bottom'.
		 */
		function moveSelectedRows(gridId, direction) {
			var selectedItems, gridItems, i, index;
			var lastIndex = -1;

			if (platformGridAPI) {
				selectedItems = getSelectedRows(gridId);

				if (selectedItems && selectedItems.length > 0) {
					prepareGridForChanges(gridId);
					gridItems = platformGridAPI.items.data(gridId);

					switch (direction) {
						case 'up':
							for (i = 0; (i < selectedItems.length); i++) {
								index = _.findIndex(gridItems, selectedItems[i]);
								if (index > 0 && ((index - 1) !== lastIndex)) {
									gridItems.move(index, --index);
								}
							}

							updateGridData(gridId, gridItems, selectedItems);
							break;
						case 'top':
							for (i = selectedItems.length - 1; i >= 0; i--) {
								index = _.findIndex(gridItems, selectedItems[i]);
								gridItems.move(index, 0);
							}
							updateGridData(gridId, gridItems, selectedItems);
							break;
						case 'down':
							for (i = selectedItems.length - 1; i >= 0; i--) {
								index = _.findIndex(gridItems, selectedItems[i]);
								if (index < gridItems.length - 1 && ((index + 1) !== lastIndex)) {
									gridItems.move(index, ++index);
								}
								lastIndex = index;
							}
							updateGridData(gridId, gridItems, selectedItems);
							break;
						case 'bottom':
							for (i = 0; (i < selectedItems.length); i++) {
								index = _.findIndex(gridItems, selectedItems[i]);
								gridItems.move(index, gridItems.length - 1);
							}
							updateGridData(gridId, gridItems, selectedItems);
							break;
					}
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name isMoveBtnDisabled
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Gets a value indicating whether the button is enabled for move operation in desired direction for the currently selected row.
		 * @param {( int )} gridId The ID of the grid.
		 * @param {( string )} direction Specifies the direction of the movement. Possible value are 'up', 'down', 'top' and 'bottom'.
		 * @returns { bool } True when button is enabled
		 */
		function isMoveBtnDisabled(gridId, direction) {
			var i, index, selectedItems;
			var lastIndex = -1;

			if (platformGridAPI) {
				selectedItems = getSelectedRows(gridId);

				if (angular.isDefined(selectedItems) && selectedItems.length > 0) {

					var gridItems = platformGridAPI.items.data(gridId);

					switch (direction) {
						case 'up':
							for (i = 0; i < selectedItems.length; i++) {
								index = _.findIndex(gridItems, selectedItems[i]);
								if (index > 0 && ((index - 1) !== lastIndex)) {
									return false;
								}
								lastIndex = index;
							}

							return true;
						case 'top':
							for (i = 0; i < selectedItems.length; i++) {
								if (_.findIndex(gridItems, selectedItems[i]) > 0) {
									return false;
								}
							}

							return true;
						case 'down':
							for (i = 0; i < selectedItems.length; i++) {
								index = _.findIndex(gridItems, selectedItems[i]);
								if (index < gridItems.length - 1 && ((index + 1) !== lastIndex)) {
									return false;
								}
								lastIndex = index;
							}

							return true;

						case 'bottom':
							for (i = 0; i < selectedItems.length; i++) {
								if (_.findIndex(gridItems, selectedItems[i]) < gridItems.length - 1) {
									return false;
								}
							}

							return true;
					}
				}
			}

			return true;
		}

		/**
		 * @ngdoc function
		 * @name isDeleteBtnDisabled
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Gets a value indicating whether the button is enabled to delete the currently selected row.
		 * @param {( int )} gridId The ID of the grid.
		 * @returns { bool } True when button is enabled
		 */
		function isDeleteBtnDisabled(gridId, fnc) {
			let selected = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});

			if (angular.isDefined(selected) && selected.length > 0) {
				if (_.isFunction(fnc)) {
					return fnc(selected);
				}

				return false;
			}

			return true;
		}

		/**
		 * @ngdoc function
		 * @name isDeleteBtnDisabled
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Gets a value indicating whether the button is enabled to delete the currently selected row.
		 * @param {( int )} gridId The ID of the grid.
		 * @returns { bool } True when button is enabled
		 */
		function isRowSelected(gridId) {
			var selected = platformGridAPI.rows.selection({gridId: gridId, wantsArray: true});
			return angular.isDefined(selected) && selected.length > 0;
		}

		/**
		 * @ngdoc function
		 * @name deleteSelectedRows
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Delete a grid row.
		 * @param {( int )} gridId The ID of the grid.
		 * @param {( boolean )} autoselectItem Specifies whether the grid select a row automatically after removing.
		 */
		function deleteSelectedRows(gridId, autoselectItem, filterFn) {
			let selItems = getSelectedRows(gridId);

			if (selItems.length) {
				deleteRows(gridId, selItems, autoselectItem, filterFn);
			}

			return selItems;
		}

		/**
		 * @ngdoc function
		 * @name deleteRows
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description Delete a grid row.
		 * @param {( int )} gridId The ID of the grid.
		 * @param {( boolean )} autoselectItem Specifies whether the grid select a row automatically after removing.
		 */
		function deleteRows(gridId, rows, autoselectItem, filterFn) {
			let items = _.isArray(rows) ? rows : [rows];
			let itemsToDelete = _.isFunction(filterFn) ? _.filter(items, filterFn) : items;

			if (itemsToDelete.length) {
				prepareGridForChanges(gridId);

				let gridItems = platformGridAPI.items.data(gridId);
				let index = _.findIndex(gridItems, itemsToDelete[0]);

				platformGridAPI.rows.delete({
					gridId: gridId,
					rows: itemsToDelete
				});

				platformGridAPI.grids.refresh(gridId, true);

				if (autoselectItem) {
					autoSelectRowByLastIndex(gridId, gridItems, index);
				}
			}
		}

		function autoSelectRowByLastIndex(gridId, gridItems, index) {
			if (index === 0) {
				if (gridItems.length > 0) {
					selectRowByIndex(gridId, gridItems, 0);
				}
			} else {
				if ((gridItems.length - 1) >= index) {
					selectRowByIndex(gridId, gridItems, index);
				} else {
					var newIndex = index - 1;

					if (newIndex > -1) {
						selectRowByIndex(gridId, gridItems, newIndex);
					}
				}
			}
		}

		/**
		 * @ngdoc function
		 * @name resizeGridContainer
		 * @methodOf platform.grid.api.platformManualGridService
		 * @description update dimensions of the grid.
		 * @param {( element )} gridContainer The grid-containers.
		 */
		function resizeGridContainer(gridContainer) {
			if(gridContainer.length > 0) {
				angular.forEach(gridContainer, function (item) {
					if (item.id && platformGridAPI.grids.exist(item.id)) {
						platformGridAPI.grids.resize(item.id);
					}
				});
			}
		}
	}

	platformManualGridService.$inject = ['_', 'platformGridAPI'];

	/**
	 * @ngdoc service
	 * @name platformManualGridService
	 * @function
	 * @description
	 * General service for grids that are not bound. The data is managed manually.
	 */
	angular.module('platform').factory('platformManualGridService', platformManualGridService);

})(angular);
