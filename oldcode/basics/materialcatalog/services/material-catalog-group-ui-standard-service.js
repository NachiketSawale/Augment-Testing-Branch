(function () {
	'use strict';
	var modName = 'basics.materialcatalog',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).value('basicsMaterialGroupLayout', {
		'fid': 'basics.materialCatalog.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'descriptioninfo', 'prcstructurefk']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [],
			'extraWords': {
				PrcStructureFk: { location: cloudCommonModule, identifier: 'entityStructureCode', initial: 'entityStructureCode' },
				Code: { location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' }
			}
		},
		'overloads': {
			'code': {
				'mandatory': true
			},
			'prcstructurefk': {
				navigator : {
					moduleName : 'basics.procurementstructure'
				},
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'basics-procurementstructure-structure-dialog',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							showClearButton: true,
							filterKey: 'basics-materialcatalog-procurement-structure-filter'
						}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true,
							filterKey: 'basics-materialcatalog-procurement-structure-filter'
						},
						directive: 'basics-procurementstructure-structure-dialog'
					},
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Prcstructure',
						displayMember: 'Code'
					}
				}
			}

		},
		'addition':{
			grid: [
				{
					lookupDisplayColumn: true,
					field: 'PrcStructureFk',
					name$tr$: 'cloud.common.entityStructureDescription',
					displayMember: 'DescriptionInfo.Translated',
					width: 145
				}
			]
		}
	});

	angular.module(modName).factory('basicsMaterialCatalogGroupUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialcatalogTranslationService',
			'basicsMaterialGroupLayout', 'platformSchemaService','platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialGroupDto',
					moduleSubModule: 'Basics.MaterialCatalog'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service,layout.addition, domainSchema);

				return service;
			}
		]);
})();
