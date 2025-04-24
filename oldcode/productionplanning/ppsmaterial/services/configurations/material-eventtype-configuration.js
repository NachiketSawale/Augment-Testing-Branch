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

	angular.module(moduleName).value('productionplanningPpsMaterialEventTypeLayoutConfig', {
		'addition': {
			'grid': extendGrouping([])
		}
	});

	//master Layout
	angular.module(moduleName).factory('productionplanningPpsMaterialEventTypeLayout', ppsMaterialEventTypeLayout);
	ppsMaterialEventTypeLayout.$inject = ['basicsLookupdataConfigGenerator', 'productionplanningCommonLayoutHelperService'];
	function ppsMaterialEventTypeLayout(basicsLookupdataConfigGenerator, ppsCommonLayoutHelperService) {
		return {
			'fid': 'productionplanning.ppsmaterial.ppsMaterialEventTypeLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'eventDefinition',
					attributes: [
						'ppseventtypefk', 'varduration', 'sorting', 'sitefk', 'restypefk', 'islive'
					]
				},
				{
					gid: 'defaultCalculation',
					attributes: [
						'lagtime', 'ppseventtypebasefk'
					]
				},
				{
					gid: 'documentation',
					attributes: [
						'commenttext'
					]
				}
			],
			'overloads': {
				eventfor: {
					detail: {
						'type': 'directive',
						'directive': 'productionplanning-pps-material-event-for-combo-box',
						'options': {
							'eagerLoad': true
						}
					},
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'productionplanning-pps-material-event-for-combo-box'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'eventFor',
							displayMember: 'Code'
						}
					}
				},
				ppseventtypefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload('productionplanning-ppsmaterial-ppseventtype-filter'),
				ppseventtypebasefk: ppsCommonLayoutHelperService.provideEventTypeLookupOverload(),
				restypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceTypeLookupDataService'
				}),
				sitefk: {
					grid: {
						editor: 'lookup',
						editorOptions: {
							lookupOptions: {showClearButton: true},
							directive: 'basics-site-site-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'Code',
							version: 3
						},
						width: 70
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupOptions: {showClearButton: true},
							lookupDirective: 'basics-site-site-lookup',
							descriptionMember: 'DescriptionInfo.Description'
						}
					}
				}
			}
		};
	}

})(angular);