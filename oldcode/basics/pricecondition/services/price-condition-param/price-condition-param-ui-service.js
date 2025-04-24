(function (angular) {
	'use strict';
	var modName = 'basics.pricecondition',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);

	mod.factory('basicsPriceConditionParamLayout', ['priceConditionValueFormatter', function (priceConditionValueFormatter) {
		return {
			'fid': 'basics.price.condition.param',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['priceconditiontypefk', 'value', 'code', 'formula', 'commenttext']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					PriceConditionTypeFk: {
						location: modName,
						identifier: 'entityPriceCondition',
						initial: 'Price Condition Type'
					},
					Value: {location: modName, identifier: 'entityValue', initial: 'Value'},
					Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
					Formula: {location: modName, identifier: 'entityFormula', initial: 'Formula'},
					CommentText: {location: modName, identifier: 'entityCommentText', initial: 'Comment Text'}
				}
			},
			'overloads': {
				'priceconditiontypefk': {
					'mandatory': true,
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							lookupDirective: 'basics-price-condition-type-lookup',
							descriptionMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function onSelectedItemChangedHandler(e, args) {
										if (args && args.entity) {
											args.entity.Value = args.selectedItem !== null ? args.selectedItem.Value : args.entity.Value;
											args.entity.Formula = args.selectedItem !== null ? args.selectedItem.Formula : args.entity.Formula;
											args.entity.Code = args.selectedItem !== null ? args.selectedItem.Code : args.entity.Code;
										}
									}
								}]
							}
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-price-condition-type-lookup',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged',
									handler: function onSelectedItemChangedHandler(e, args) {
										if (args && args.entity) {
											args.entity.Value = args.selectedItem !== null ? args.selectedItem.Value : args.entity.Value;
											args.entity.Formula = args.selectedItem !== null ? args.selectedItem.Formula : args.entity.Formula;
											args.entity.Code = args.selectedItem !== null ? args.selectedItem.Code : args.entity.Code;
										}
									}
								}]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcPriceConditionType',
							displayMember: 'Code'
						},
						width: 150
					}
				},
				'value': {
					'mandatory': true,
					'detail': {
						domain:'factor',
						formatter: priceConditionValueFormatter
					},
					'grid': {
						domain:'factor',
						formatter: priceConditionValueFormatter
					}
				},
				'formula': {
					'readonly': true
				},
				'code': { 'readonly': true }
			},
			addition: {
				'grid': [{
					'lookupDisplayColumn': true,
					'field': 'PriceConditionTypeFk',
					'displayMember': 'DescriptionInfo.Translated',
					'name$tr$': 'basics.pricecondition.entityPriceConditionDescription',
					'width': 200
				}]
			}
		};
	}]);

	mod.factory('basicsPriceConditionParamUIStandardService',
		['$translate', 'platformUIStandardConfigService', 'basicsPriceConditionTranslationService',
			'basicsPriceConditionParamLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function ($translate, platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'HeaderPparamDto',
					moduleSubModule: 'Basics.PriceCondition'
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
})(angular);