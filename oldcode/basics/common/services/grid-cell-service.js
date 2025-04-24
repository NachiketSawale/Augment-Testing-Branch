/**
 * Created by wui on 7/11/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonGridCellService', ['_', 'platformGridAPI',
		function (_, platformGridAPI) {

			return {
				updateColumn: updateColumn,
				updateColumns: updateColumns
			};

			/**
			 * Update column content.
			 * For example, implement progress column which should be updated real-time in grid
			 * @param gridId grid id
			 * @param colId column id
			 */
			function updateColumn(gridId, colId) {
				updateColumns(gridId, [colId]);
			}

			/**
			 * Update multi-columns content
			 * @param gridId
			 * @param colIds
			 */
			function updateColumns(gridId, colIds) { /* jshint -W083 */
				const element = platformGridAPI.grids.element('id', gridId);

				if (!element || !element.instance) {
					return;
				}

				let grid = element.instance,
					columns = grid.getColumns(true),
					dataLength = grid.getDataLength();

				if (dataLength && colIds.length) {
					while (dataLength > 0) {
						dataLength--;
						colIds.forEach(function (colId) {
							const cell = _.findIndex(columns, function (item) {
								return item.id === colId;
							});

							if (cell >= 0) {
								grid.updateCell(dataLength, cell);
							}
						});
					}
				}
			}
		}
	]);

})(angular);