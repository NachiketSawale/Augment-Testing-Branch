
(function () {
	/* global */
	'use strict';
	let moduleName = 'controlling.configuration';

	angular.module(moduleName).factory('controllingConfigurationUIConfigurationService', ['basicsLookupdataConfigGenerator','$translate', 'formulaAggregateType',
		function (basicsLookupdataConfigGenerator, $translate, formulaAggregateType) {

			let chartTypeOpton = [
				{
					id: 1,
					name: $translate.instant('basics.common.chartType.lineChart')
				},
				{
					id: 2,
					name: $translate.instant('basics.common.chartType.barChart')
				}
			];

			let aggregateTypeOpton = [
				{
					id: 1,
					aggregate: formulaAggregateType.SUM,
					description: $translate.instant('controlling.configuration.aggregations.sum')
				},
				{
					id: 2,
					aggregate: formulaAggregateType.CAL,
					description: $translate.instant('controlling.configuration.aggregations.calculated')
				}
			];

			let aggregateTypeLayout = {
				width: 150,
				grid: {
					formatter: 'select',
					formatterOptions: {
						items: aggregateTypeOpton,
						valueMember: 'aggregate',
						displayMember: 'description'
					},
					editor: 'select',
					editorOptions: {
						items: aggregateTypeOpton,
						valueMember: 'aggregate',
						displayMember: 'description'
					}
				}
			};

			return {
				getColumnDefinitionDetailLayout: function () {
					return {
						fid: 'controlling.configuration.ConfColumnDefinitionTitle',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code', 'description', 'aggregates']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'code': {
								searchable:true,
								readonly: true
							},
							'description': {
								searchable:true,
								readonly: true
							},
							'aggregates': aggregateTypeLayout
						}
					};
				},
				getFormulaDefinitionDetailLayout: function () {
					return {
						fid: 'controlling.configuration.ConfFormulaDefinitionTitle',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['code','bascontrcolumntypefk', 'descriptioninfo', 'formula', 'iseditable','isdefault','isvisible','aggregates']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'code': {
								searchable:true,
								// readonly: true
							},
							'bascontrcolumntypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.controllingcolumntype', null, {
								filterKey: 'bas-controlling-formula-column-type'
							}),
							'formula': {
								'detail': {
									'type': 'directive',
									'directive': 'formula-text-input',
									'options': {
										paramDataService: 'controllingConfigurationFormulaDefinitionDataService',
										paramDataServiceFunc: 'getParameters'
									}
								},
								'grid': {
									editor: 'directive',
									editorOptions: {
										'directive': 'formula-text-input',
										paramDataService: 'controllingConfigurationFormulaDefinitionDataService',
										paramDataServiceFunc: 'getParameters'
									},
									formatter: 'description'
								}
							},
							'aggregates': aggregateTypeLayout
						}
					};
				},
				getColumnChartConfigDetailLayout: function () {
					return {
						fid: 'controlling.configuration.chartConfigContainerTitle',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['action', 'description', 'bascharttypefk', 'isdefault1','isdefault2']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'bascharttypefk': {
								grid: {
									formatter: 'select',
									formatterOptions: {
										items: chartTypeOpton,
										valueMember: 'id',
										displayMember: 'name'
									},
									editor: 'select',
									editorOptions: {
										items: chartTypeOpton,
										valueMember: 'id',
										displayMember: 'name'
									}
								}
							}
						}
					};
				},
				getVersionCompareConfDetailLayout: function () {
					return {
						fid: 'controlling.configuration.versionCompareTitle',
						version: '1.0.0',
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['action', 'descriptioninfo',  'isdefault', 'isvisible']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						]
					};
				}
			};
		}
	]);
})();
