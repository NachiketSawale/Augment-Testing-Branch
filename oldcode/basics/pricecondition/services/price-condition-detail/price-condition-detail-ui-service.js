(function (angular) {
	'use strict';
	var modName = 'basics.pricecondition',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);

	mod.factory('basicsPriceConditionDetailLayout', ['priceConditionValueFormatter', function (priceConditionValueFormatter) {
		return {
			'fid': 'basics.price.condition.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['priceconditiontypefk', 'value', 'isactivated']
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
					IsActivated: {location: modName, identifier: 'entityIsActivated', initial: 'Is Activated'}
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
							descriptionMember: 'DescriptionInfo.Translated'
						}
					},
					'grid': {
						editor: 'lookup',
						editorOptions: {
							directive: 'basics-price-condition-type-lookup'
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcPriceConditionType',
							displayMember: 'Code'
						},
						width: 100
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
				}
			},
			addition: {
				'grid': [{
					'lookupDisplayColumn': true,
					'field': 'PriceConditionTypeFk',
					'displayMember': 'DescriptionInfo.Translated',
					'name$tr$': 'basics.pricecondition.entityPriceConditionDescription',
					'width': 150
				}]
			}
		};
	}]);

	/* jshint -W072 */ // many parameters because of dependency injection
	mod.factory('basicsPriceConditionDetailUIStandardService',
		['$translate', 'platformUIStandardConfigService', 'basicsPriceConditionTranslationService',
			'basicsPriceConditionDetailLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function ($translate, platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PriceConditionDetailDto',
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