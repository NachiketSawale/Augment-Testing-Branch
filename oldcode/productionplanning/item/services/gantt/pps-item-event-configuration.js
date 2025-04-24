/**
 * Created by mik on 14/08/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	function extendGrouping(gridColumns) {
		angular.forEach(gridColumns, function (column) {
			angular.extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true
				}
			});
		});
		return gridColumns;
	}

	angular.module(moduleName).value('productionplanningItemEventLayoutConfig', {
		addition: {
			grid: extendGrouping([
				// {
				// 	afterId: 'plannedstart',
				// 	id: 'dateOnly',
				// 	field: 'PlannedStart',
				// 	name: 'DateOnly',
				// 	name$tr$: 'productionplanning.item.dateOnly',
				// 	sortable: true,
				// 	formatter: 'dateutc',
				// 	grouping: {
				// 		title: 'productionplanning.item.dateOnly',
				// 		getter: 'Date',
				// 		aggregators: [],
				// 		aggregateCollapsed: true
				// 	}
				// }
			])
		}
	});

	angular.module(moduleName).factory('productionplanningItemEventLayout', PPSItemEventLayout);

	function PPSItemEventLayout() {

		return {
			'fid': 'productionplanning.item.ppsItemEventLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['code', 'descriptioninfo', 'plannedstart', 'plannedfinish', 'drawing.code']
				}
			],
			'overloads': {
				'code': {
					readonly: true
				},
				'descriptioninfo': {
					readonly: true
				},
				'drawing.code': {
					readonly: true,
					name: '*Drawing Code',
					name$tr$: 'productionplanning.item.drawingcode'
				}
			}
		};
	}

})(angular);