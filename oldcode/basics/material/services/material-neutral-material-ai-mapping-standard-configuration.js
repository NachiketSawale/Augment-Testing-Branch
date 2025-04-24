/**
 * Created by gvj on 08.10.2018.
 */

(function () {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).value('materialNeutralMaterialAiMappingLayout', {
		fid: 'basics.aiMaterial.dialog',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['materialcatalogfk','materialgroupfk','ischeckai','isneutral','code', 'descriptioninfo1', 'mdcmaterialfk','origmdcmaterialfk']
			}
		],
		translationInfos: {
			'extraModules': [moduleName],
			'extraWords': {
				IsCheckAi:{location: moduleName, identifier: 'AI.CheckSuggested', initial: 'Check Suggested'},
				Code: {location: moduleName, identifier: 'AI.RecordCode', initial: 'Record Code'},
				DescriptionInfo1: {location: moduleName, identifier: 'AI.RecordDescription', initial: 'Record Description'},
				IsNeutral: {location: moduleName, identifier: 'AI.IsNeutral', initial: 'Is Neutral'},
				MdcMaterialFk: {location: moduleName, identifier: 'AI.SuggestedRecordCode', initial: 'Suggested Record Code'},
				OrigMdcMaterialFk: {location: moduleName, identifier: 'AI.OriginalRecordCode', initial: 'Original Record Code'},
				MaterialCatalogFk: {location: moduleName, identifier: 'AI.MaterialCatalogCode', initial: 'Material Catalog Code'},
				MaterialGroupFk: {location: moduleName, identifier: 'AI.MaterialGroupCode', initial: 'Material Record Code'}
			}
		},
		'overloads': {
			'code': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					width: 80
				}
			},
			'mdcmaterialfk': {
				'grid': {
					width:150 ,
					editor: 'lookup',
					editorOptions: {
						lookupOptions: {
							showClearButton: true
						},
						lookupDirective: 'basics-material-neutral-material-ai-mapping-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialRecord',
						displayMember: 'Code'
					},
					validator: 'validateMdcMaterialFk'
				}
			},
			'ischeckai': {
				headerChkbox: true,
				width: 80,
				editor: 'boolean',
				formatter: 'boolean',
				cssClass: 'cell-center'
			},
			'isneutral':{
				headerChkbox: false,
				readonly: true,
				width: 80,
				editor: 'boolean',
				formatter: 'boolean',
				cssClass: 'cell-center'
			},
			'descriptioninfo1': {
				'readonly': true,
				'grid': {width: 180}
			},

			'origmdcmaterialfk': {
				'readonly': true,
				'grid': {
					width: 150,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialRecord',
						displayMember: 'Code'
					}
				}
			},
			'materialcatalogfk':{
				'readonly': true,
				'grid':{
					width: 100,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialCatalog',
						displayMember: 'Code'
					}
				}
			},
			'materialgroupfk':{
				'readonly': true,
				'grid':{
					width: 100,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'MaterialGroup',
						displayMember: 'Code'
					}
				}
			}
		},
		'addition': {
			grid: [
				{
					lookupDisplayColumn: true,
					field: 'MdcMaterialFk',
					name$tr$: 'basics.material.AI.SuggestedRecordDescription',
					displayMember: 'DescriptionInfo.Translated',
					width: 180
				},
				{
					lookupDisplayColumn: true,
					field: 'OrigMdcMaterialFk',
					name$tr$: 'basics.material.AI.OriginalRecordDescription',
					displayMember: 'DescriptionInfo.Translated',
					width: 180
				}
			]
		}

	});

	angular.module(moduleName).factory('basicsMaterialNeutralMaterialAiMappingStandardConfiguration',
		['platformUIStandardConfigService', 'basicsMaterialNeutralMaterialAiTranslationService',
			'materialNeutralMaterialAiMappingLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialAINeutralMappingDto',
					moduleSubModule: 'Basics.Material'
				});
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;
				 var service = new BaseService(layout, domainSchema.properties, translationService);

				 platformUIStandardExtentService.extend(service, layout.addition, domainSchema.properties);

				 return service;
			}
		]);
})();

