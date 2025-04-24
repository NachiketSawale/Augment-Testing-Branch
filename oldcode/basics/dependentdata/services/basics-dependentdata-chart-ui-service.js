(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';
	angular.module(moduleName).factory('basicsDependentDataChartLayoutService',['basicsLookupdataConfigGenerator','basicsDependentDataColumnLookupService',function(basicsLookupdataConfigGenerator,basicsDependentDataColumnLookupService){


		function LinkParameterFormatter(row, cell, value) {

			if (value) {
				var item = basicsDependentDataColumnLookupService.getItemByKey(value);
				if (item) {
					return item.DatabaseColumn;
				}
			}
			return value;
		}

		return {
			'fid': 'basics.dependentdata.dependentdatachart.layout',
			'version': '1.0.0',
			'showGrouping': true,
			'addValidationAutomatically': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['charttypefk','titleinfo','dependentdatacolumnxfk','dependentdatacolumnyfk','dependentdatacolumngrp1fk', 'dependentdatacolumngrp2fk']
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
					'TitleInfo':{location: 'basics.dependentdata', identifier: 'entityTitleInfo', initial: 'Title'},
					'DependentdatacolumnXFk':{location: 'basics.dependentdata', identifier: 'entityXDependentdatacolumn', initial: 'X Dependentdata column'},
					'DependentdatacolumnYFk':{location: 'basics.dependentdata', identifier: 'entityYDependentdatacolumn', initial: 'Y Dependentdata column'},
					'DependentdatacolumnGrp1Fk':{location: 'basics.dependentdata', identifier: 'entityGroup1Depdatacolumn', initial: 'Group1 Dependentdata column'},
					'DependentdatacolumnGrp2Fk':{location: 'basics.dependentdata', identifier: 'entityGroup2Depdatacolumn', initial: 'Group2 Dependentdata column'}
				}
			},
			'overloads': {
				'titleinfo': {
					detail: {
						maxLength: 2000
					},
					grid: {
						maxLength:2000
					}
				},
				'charttypefk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.dependentdata.charttype'),
				'dependentdatacolumnxfk':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-column-lookup'
					},
					'grid': {
						'formatter': LinkParameterFormatter,
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
						'formatter': LinkParameterFormatter,
						editor: 'lookup',
						'editorOptions': {
							'directive': 'basics-dependent-data-column-lookup',
							'lookupOptions':{
								'valueMember': 'Id'
							}
						}
					}
				},
				'dependentdatacolumngrp1fk':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-column-lookup'
					},
					'grid': {
						'formatter': LinkParameterFormatter,
						editor: 'lookup',
						'editorOptions': {
							'directive': 'basics-dependent-data-column-lookup',
							'lookupOptions':{
								'valueMember': 'Id'
							}
						}
					}
				},
				'dependentdatacolumngrp2fk':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-dependent-data-column-lookup'
					},
					'grid': {
						'formatter': LinkParameterFormatter,
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

	angular.module(moduleName).factory('basicsDependentDataChartUIService', ['platformUIStandardConfigService', 'basicsDependentDataTranslationService', 'basicsDependentDataChartLayoutService', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsDependentDataTranslationService, basicsDependentDataChartLayout, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;
			var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'UserChartDto', moduleSubModule: 'Basics.DependentData'} );

			function UserformUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UserformUIStandardService.prototype = Object.create(BaseService.prototype);
			UserformUIStandardService.prototype.constructor = UserformUIStandardService;

			return new BaseService(basicsDependentDataChartLayout, domainSchema.properties, basicsDependentDataTranslationService);
		}
	]);

})();
