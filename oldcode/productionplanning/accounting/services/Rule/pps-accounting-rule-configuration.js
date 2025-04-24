/**
 * Created by anl on 4/3/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

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

	//Rule additional Layout
	angular.module(moduleName).value('productionplanningAccountingRuleLayoutConfig', {
		addition: {
			grid: extendGrouping([])
		}
	});

	angular.module(moduleName).factory('productionplanningAccountingRuleLayout', RuleLayout);
	RuleLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function RuleLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'productionplanning.accounting.rulelayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['ruletypefk', 'importformatfk', 'matchfieldfk',
						'matchpattern', 'remark', 'islive']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				ruletypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringaccountingruletype', null, {
					showIcon: true
				}),
				importformatfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringaccountingruleimportformat', null, {
					showIcon: true
				}),
				matchfieldfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringaccountingrulematchfield', null, {
					showIcon: true,
					filterKey: 'productionplanning-accounting-rule-matchfield-filter'
				})
			}
		};
	}
})(angular);