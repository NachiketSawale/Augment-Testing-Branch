(function () {
	'use strict';
	var modName = 'basics.materialcatalog',
		cloudCommonModule = 'cloud.common';

	angular.module(modName).value('basicsMaterialDiscountGroupLayout', {
		'fid': 'basics.materialCatalog.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'descriptioninfo', 'discounttype', 'discount']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [],
			'extraWords': {
				Code: { location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
				DiscountType: { location: modName, identifier: 'DiscountType', initial: 'Discount Type' },
				Discount: { location: modName, identifier: 'Discount', initial: 'Discount' }
			}
		},
		'overloads': {
			'code': {
				'mandatory': true
			},
			'discounttype': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-material-catalog-discount-type-combo-box',
					'options': {
						'eagerLoad': true
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-material-catalog-discount-type-combo-box'
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'discountType',
						displayMember: 'Description'
					}
				}
			},
			'discount': {
				'mandatory': true
			}

		}
	});

	angular.module(modName).factory('basicsMaterialCatalogDiscountGroupUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialcatalogTranslationService',
			'basicsMaterialDiscountGroupLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialDiscountGroupDto',
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

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();
