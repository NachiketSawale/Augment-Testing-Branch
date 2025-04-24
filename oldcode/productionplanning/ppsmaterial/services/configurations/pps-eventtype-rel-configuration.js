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

	angular.module(moduleName).value('productionplanningPpsEventTypeRelationLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('productionplanningPpsEventTypeRelationLayout', ppsMaterialEventTypeLayout);
	ppsMaterialEventTypeLayout.$inject = ['basicsLookupdataConfigGenerator', 'productionplanningCommonLayoutHelperService'];
	function ppsMaterialEventTypeLayout(basicsLookupdataConfigGenerator, ppsCommonLayoutHelperService) {
		return {
			'fid': 'productionplanning.ppsmaterial.ppsEventTypeRelationLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicConfiguration',
					attributes: [
						'ppseventtypeparentfk', 'ppseventtypechildfk', 'relationkindfk', 'commenttext', 'fixlagtime', 'fixduration'
					]
				}

			],
			'overloads': {
				relationkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.relationkind', 'Description'),
				ppseventtypeparentfk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(),
				ppseventtypechildfk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(),
				fixlagtime: {
					disallowNegative: true
				},
				fixduration: {
					disallowNegative: true
				}
			}
		};
	}

})(angular);