(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';
	angular.module(moduleName).factory('basicsDependentDataChartSeriesLayoutService',['basicsLookupdataConfigGenerator',function(basicsLookupdataConfigGenerator){

		return {
			'fid': 'basics.dependentdata.dependentdatachartseries.layout',
			'version': '1.0.0',
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['charttypefk','labelinfo','filter','sorting','dependentdatacolumnxfk','dependentdatacolumnyfk','dependentdatacolumnrfk']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': ['basics.dependentdata'],
				'extraWords': {
					'ChartTypeFk': {location: 'basics.dependentdata', identifier: 'entityChartType', initial: 'Chart Type'},
					'LabelInfo':{location: 'basics.dependentdata', identifier: 'entityLabelInfo', initial: 'Label'},
					'Filter':{location: 'basics.dependentdata', identifier: 'entityFilter', initial: 'Filter'},
					'Sorting':{location: 'basics.dependentdata', identifier: 'entitySorting', initial: 'Sorting'},
					'DependentdatacolumnXFk':{location: 'basics.dependentdata', identifier: 'entityXDependentdatacolumn', initial: 'X Dependentdata column'},
					'DependentdatacolumnYFk':{location: 'basics.dependentdata', identifier: 'entityYDependentdatacolumn', initial: 'Y Dependentdata column'},
					'DependentdatacolumnRFk':{location: 'basics.dependentdata', identifier: 'entityRDependentdatacolumn', initial: 'R Dependentdata column'}
				}
			},
			'overloads': {
				'charttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.dependentdata.charttype'),
				'dependentdatacolumnxfk':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-column-lookup'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'basicsDependentDataColumn',
							displayMember: 'DatabaseColumn',
							dataServiceName: 'basicsDependentDataColumnLookupService'
						},
						editor: 'lookup',
						'editorOptions': {
							'directive': 'basics-dependent-data-column-lookup',
							'lookupOptions':{
								'valueMember': 'Id'
							}
						}
					}
				},
				'dependentdatacolumnyfk':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-column-lookup'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'basicsDependentDataColumn',
							displayMember: 'DatabaseColumn',
							dataServiceName: 'basicsDependentDataColumnLookupService'
						},
						editor: 'lookup',
						'editorOptions': {
							'directive': 'basics-dependent-data-column-lookup',
							'lookupOptions':{
								'valueMember': 'Id'
							}
						}
					}
				},
				'dependentdatacolumnrfk':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-column-lookup'
					},
					'grid': {
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'basicsDependentDataColumn',
							displayMember: 'DatabaseColumn',
							dataServiceName: 'basicsDependentDataColumnLookupService'
						},
						editor: 'lookup',
						'editorOptions': {
							'directive': 'basics-dependent-data-column-lookup',
							'lookupOptions':{
								'valueMember': 'Id'
							}
						}
					}
				}
			}
		};
	}]);

	angular.module(moduleName).factory('basicsDependentDataChartSeriesUIService', ['platformUIStandardConfigService', 'basicsDependentDataTranslationService', 'basicsDependentDataChartSeriesLayoutService', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsDependentDataTranslationService, basicsDependentDataChartSeriesLayoutService, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'UserChartSeriesDto', moduleSubModule: 'Basics.DependentData'} );

			function UserformUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UserformUIStandardService.prototype = Object.create(BaseService.prototype);
			UserformUIStandardService.prototype.constructor = UserformUIStandardService;

			return new BaseService(basicsDependentDataChartSeriesLayoutService, domainSchema.properties, basicsDependentDataTranslationService);
		}
	]);

})();
