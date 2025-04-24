/**
 * Created by gaz on 04/05/2018.
 */

(function () {
	'use strict';
	var modName = 'basics.materialcatalog';


	angular.module(modName).factory('materialCatalogGroupAiMappingLayout',
		[function () {
			return {
				'fid': 'basics.aiMaterialCatalog.dialog',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['ischeckai', 'code', 'descriptioninfo', 'prcstructurefk', 'origprcstructurefk']
					}
				],
				'translationInfos': {
					'extraModules': [],
					'extraWords': {
						IsCheckAi: {location: modName, identifier: 'checkSuggested', initial: 'Check Suggested'},
						Code: {location: modName, identifier: 'groupCode', initial: 'Group Code'},
						DescriptionInfo: {location: modName, identifier: 'groupDescription', initial: 'Group Description'},
						PrcStructureFk: {location: modName, identifier: 'suggestedStructureCode', initial: 'Suggested Structure Code'},
						OrigPrcStructureFk: {location: modName, identifier: 'originalStructureCode', initial: 'Original Structure Code'}
					}
				},
				'overloads': {
					'code': {
						'mandatory': true,
						'readonly': true,
						'grid': {
							width: 170
						}
					},
					'prcstructurefk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: true,
									filterKey: 'basics-materialcatalog-procurement-structure-filter'
								},
								lookupDirective: 'basics-material-catalog-group-suggested-prcstructure-lookup',
								displayMember: 'Code'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							},
							validator: 'validatePrcStructureFk'
						}
					},
					'origprcstructurefk': {
						'readonly': true,
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							}
						}
					},
					'ischeckai': {
						headerChkbox: true,
						width: 80,
						editor: 'boolean',
						formatter: 'boolean',
						cssClass: 'cell-center'
					},
					'descriptioninfo': {
						'readonly': true,
						'grid': {
							width: 180
						}
					}
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'PrcStructureFk',
							name$tr$: 'basics.materialcatalog.ai.suggestedStructureDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 180
						},
						{
							lookupDisplayColumn: true,
							field: 'OrigPrcStructureFk',
							name$tr$: 'basics.materialcatalog.ai.originalStructureDescription',
							displayMember: 'DescriptionInfo.Translated',
							width: 180
						}
					]
				}
			};
		}
		]);
	angular.module(modName).factory('basicsMaterialCatalogGroupAiMappingUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialCatalogAiTranslationService',
			'materialCatalogGroupAiMappingLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialGroupAIMappingDto',
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

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})();
