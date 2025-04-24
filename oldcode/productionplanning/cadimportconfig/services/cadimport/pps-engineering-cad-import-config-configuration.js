/**
 * Created by lav on 7/24/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.cadimportconfig';

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

	angular.module(moduleName).value('ppsEngineeringCadImportConfigLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('ppsEngineeringCadImportConfigLayout', Layout);

	Layout.$inject = ['basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'productionplanningDrawingtypeLookupOverloadProvider'];

	function Layout(basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, drawingtypeLookupOverloadProvider) {
		var filters = [{
			key: 'pps-engineering-cad-import-matchpattern-filter',
			fn: function (item) {
				return item.Id === 1 || item.Id === 2;
			}
		}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		return {
			'fid': 'productionplanning.engineering.ppsEngineeringCadImportConfigLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'basicData',
					attributes: [
						'description', 'engdrawingtypefk', 'importerkind', 'basedirectory', 'matchpatterntype', 'matchpattern', 'islive'
					]
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				engdrawingtypefk: drawingtypeLookupOverloadProvider.provideDrawingtypeLookupOverload(true),
				importerkind: {
					detail: {
						type: 'select',
						options: {
							serviceName: 'ppsEngineeringCadFormatService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					},
					grid: {
						formatter: 'select',
						formatterOptions: {
							serviceName: 'ppsEngineeringCadFormatService',
							valueMember: 'Id',
							displayMember: 'Description'
						},
						editor: 'select',
						editorOptions: {
							serviceName: 'ppsEngineeringCadFormatService',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}
				},
				matchpatterntype: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringaccountingruletype', null, {
					showIcon: true,
					filterKey: 'pps-engineering-cad-import-matchpattern-filter'
				})
			}
		};
	}

})(angular);
