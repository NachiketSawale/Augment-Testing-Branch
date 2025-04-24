/**
 * Created by lav on 8/9/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.ppsmaterial';

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

	angular.module(moduleName).value('ppsCadToMaterialLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('ppsCadToMaterialLayout', ppsCadToMaterialLayout);

	function ppsCadToMaterialLayout() {
		return {
			'fid': 'productionplanning.ppsmaterial.ppsCadToMaterialLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: [
						'cadproducttype', 'mdcmaterialfk', 'cadaddspecifier', 'commenttxt'
					]
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				'mdcmaterialfk': {
					navigator: {
						moduleName: 'basics.material'
					},
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCommodity',
							displayMember: 'Code'
						},
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-material-material-lookup'
						},
						width: 100
					},
					detail: {
						type: 'directive',
						directive: 'basics-material-material-lookup',
						options: {
							lookupDirective: 'basics-material-material-lookup',
							descriptionMember: 'DescriptionInfo.Translated'
						}
					}
				},
				'cadaddspecifier': {
					detail: {
						maxLength: 16
					},
					grid: {
						maxLength: 16
					}
				}
			}
		};
	}

})(angular);