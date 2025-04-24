(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

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

	//eventtype2restype Layout Config
	angModule.value('productionplanningConfigurationLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//eventtype2restype Layout
	angModule.factory('productionplanningConfigurationLayout', Layout);
	Layout.$inject = ['basicsLookupdataConfigGenerator'];

	function Layout(basicsLookupdataConfigGenerator) {
		return {
			fid: 'productionplanning.configuration.detialForm',
			version: '1.0.0',
			showGrouping: true,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'basicConfiguration',
					attributes: [
						'code', 'descriptioninfo', 'isdefault', 'islive', 'sorting', 'ishide'
					]
				},
				{
					gid: 'advancedConfiguration',
					attributes: [
						'rubricfk', 'rubriccategoryfk', 'ppsentityfk', 'issystemevent', 'isproductiondate',
						'isforsequence'
					]
				},
				{
					gid: 'defaultValue',
					attributes: [
						'plannedstart', 'plannedduration', 'earlieststart', 'lateststart', 'earliestfinish',
						'latestfinish', 'dateshiftmode'
					]
				},
				{
					gid: 'userDefTextGroup',
					isUserDefText: true,
					attCount: 5,
					attName: 'userdefined',
					noInfix: true
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			overloads: {
				ppsentityfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'productionplanningConfigurationPpsentityLookupDataService',
					cacheEnable: true,
					filterKey: 'productionplanning-configuration-eventtype-ppsentityfk-filter'
				}),
				rubricfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.lookup.rubric'),
				rubriccategoryfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig(
					'basics.customize.rubriccategory',
					'Description',
					{
						required: true,
						field: 'RubricFk',
						filterKey: 'productionplanning-configuration-eventtype-rubric-category-by-rubric-filter',
						customIntegerProperty: 'BAS_RUBRIC_FK'
					}),
				issystemevent: {
					readonly: true
				},
				dateshiftmode: {
					grid: {
						formatter: 'select',
						formatterOptions: {
							serviceName : 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'select',
						editorOptions: {
							serviceName : 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					},
					detail: {
						type: 'select',
						required: false,
						options: {
							serviceName : 'productionplanningCommonDateShiftModeService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				}
			}
		};
	}

})(angular);
