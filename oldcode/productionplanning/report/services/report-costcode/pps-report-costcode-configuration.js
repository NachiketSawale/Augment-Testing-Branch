/**
 * Created by anl on 1/23/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';

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

	//report2costcode Layout
	angular.module(moduleName).value('productionplanningReoprt2CostCodeLayoutConfig', {
		addition: {
			grid: extendGrouping([{
				afterId: 'costcodefk',
				id: 'costcodeDesc',
				field: 'CostCodeFk',
				name: 'CostCode Description',
				name$tr$: 'resource.master.costCodeDesc',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'CostCode',
					displayMember: 'DescriptionInfo.Translated',
					width: 150,
					version: 3,
				}
			}])
		}
	});

	angular.module(moduleName).factory('productionplanningReoprt2CostCodeLayout', Reoprt2ProductLayout);
	Reoprt2ProductLayout.$inject = ['basicsLookupdataConfigGenerator'];
	function Reoprt2ProductLayout(basicsLookupdataConfigGenerator) {
		return {
			'fid': 'productionplanning.report.report2CostCodeLayout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					gid: 'baseGroup',
					attributes: ['costcodefk', 'quantity', 'uomfk', 'commenttext']
				},
				{
					gid: 'entityHistory',
					isHistory: true
				}
			],
			'overloads': {
				costcodefk: {
					grid: {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CostCode',
							displayMember: 'Code',
							version: 3,
						},
						editor: 'lookup',
						editorOptions: {
							lookupField: 'CostCodeFk',
							lookupOptions: {
								showClearButton: true,
								filterKey: 'productionplanning-report-costcode-filter'
							},
							directive: 'basics-cost-codes-lookup'
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'basics-prc-common-cost-codes-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: 'productionplanning-report-costcode-filter'
							}
						}
					}
				},
				uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService',
					cacheEnable: true
				})
			}
		};
	}

})(angular);