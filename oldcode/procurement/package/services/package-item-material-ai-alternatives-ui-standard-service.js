/**
 * Created by gaz on 04/05/2018.
 */

(function () {
	'use strict';
	var modName = 'procurement.package';

	angular.module(modName).value('procurementPackageItemMaterialAiAlternativesLayout', {
		'fid': 'basics.PackageItemMaterialAiAlternatives.dialog',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['itemno', 'ischeckai', 'mdcmaterialfk', 'description1', 'suggestedtotalcurrency', 'totalcurrency']
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				Itemno: {location: modName, identifier: 'itemNo', initial: 'Item No.'},
				IsCheckAi: {location: modName, identifier: 'isCheckAi', initial: 'Check Suggested'},
				MdcMaterialFk: {location: modName, identifier: 'suggestedMaterialCode', initial: 'Suggested Material No.'},
				Description1: {location: modName, identifier: 'originalItemDescription', initial: 'Original Item Description'},
				SuggestedTotalCurrency: {location: modName, identifier: 'suggestedTotalCurrency', initial: 'Suggested Total (Currency)'},
				TotalCurrency: {location: modName, identifier: 'originalTotalCurrency', initial: 'Original Total (Currency)'}
			}
		},
		'overloads': {
			'itemno': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					'options': {
						validKeys: {
							regular: '^[1-9]{1}[0-9]{0,7}$'
						},
						isCodeProperty: true
					}
				}
			},
			'suggestedtotalcurrency': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					width: 170
				}
			},
			'description1': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					width: 170
				}
			},
			'totalcurrency': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					width: 170
				}
			},
			'mdcmaterialfk': {
				'grid': {
					editor: 'lookup',
					'validator': 'validateMdcMaterialFk',
					editorOptions: {
						lookupOptions: {
							showClearButton: true
						},
						lookupDirective: 'procurement-package-item-material-ai-alternatives-suggested-material-lookup'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Materials',
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
			}
		},
		'addition': {
			grid: [
				{
					lookupDisplayColumn: true,
					field: 'MdcMaterialFk',
					name$tr$: 'procurement.package.ai.suggestedDescription',
					displayMember: 'DescriptionInfo1.Translated',
					width: 180
				}
			]
		}
	});

	angular.module(modName).factory('procurementPackageItemMaterialAiAlternativesUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageItemMaterialAiAlternativesTranslationService',
			'procurementPackageItemMaterialAiAlternativesLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemAIMappingDto',
					moduleSubModule: 'Procurement.Common'
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
