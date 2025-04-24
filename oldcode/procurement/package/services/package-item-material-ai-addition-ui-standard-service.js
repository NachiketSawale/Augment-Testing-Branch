/**
 * Created by gaz on 04/05/2018.
 */

(function () {
	'use strict';
	var modName = 'procurement.package';

	angular.module(modName).value('procurementPackageItemMaterialAiAdditionLayout', {
		'fid': 'basics.PackageItemMaterialAiAlternatives.dialog',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['ischeckai', 'itemno', 'originalmaterialcode', 'orignalmaterialdescription', 'suggestedmaterialcode', 'suggestedmaterialdescription', 'top']
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				IsCheckAi: {location: modName, identifier: 'isCheckAi', initial: 'Check Suggested'},
				SuggestedMaterialCode: {location: modName, identifier: 'aiItemsAddition.suggestedMaterialCode', initial: 'AI Recommend Alternative Material No.'},
				SuggestedMaterialDescription: {location: modName, identifier: 'aiItemsAddition.suggestedMaterialDescription', initial: 'AI Recommend Alternative Material Description'},

				ItemNo: {location: modName, identifier: 'aiItemsAddition.itemNo', initial: 'Base Item No.'},
				OriginalMaterialCode: {location: modName, identifier: 'aiItemsAddition.originalMaterialCode', initial: 'Base Material No.'},
				OrignalMaterialDescription: {location: modName, identifier: 'aiItemsAddition.orignalMaterialDescription', initial: 'Base Material Description'},
				Top: {location: modName, identifier: 'aiItemsAddition.top', initial: 'Rank'},
			}
		},
		'overloads': {
			'ischeckai': {
				headerChkbox: true,
				width: 100,
				editor: 'boolean',
				formatter: 'boolean',
				cssClass: 'cell-center'
			},
			'itemno': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					width: 50
				}
			},
			'suggestedmaterialcode': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					'sortable': false,
					width: 70
				}
			},
			'suggestedmaterialdescription': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					'sortable': false,
					width: 240
				}
			},
			'originalmaterialcode': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					'sortable': false,
					width: 70
				}
			},
			'orignalmaterialdescription': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					'sortable': false,
					width: 240
				}
			},
			'top': {
				'mandatory': true,
				'readonly': true,
				'grid': {
					'sortable': false,
					width: 120
				}
			}
		}
	});

	angular.module(modName).factory('procurementPackageItemMaterialAiAdditionUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageItemMaterialAiAdditionTranslationService',
			'procurementPackageItemMaterialAiAdditionLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'AIUpdateMaterialDto',
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
