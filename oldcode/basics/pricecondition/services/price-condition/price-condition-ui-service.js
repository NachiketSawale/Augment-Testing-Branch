(function (angular) {
	'use strict';
	var modName = 'basics.pricecondition',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);

	mod.value('basicsPriceConditionLayout', {
		'fid': 'basics.price.condition',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['descriptioninfo','isdefault', 'sorting', 'remarkinfo', 'formulatext']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				moduleName: {'location': modName, 'identifier': 'moduleName', 'initial': 'Price Condition'},
				DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
				Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
				IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'},
				RemarkInfo: {location: cloudCommonModule, identifier: 'entityRemark', initial: 'Remark'},
				FormulaText: {location: cloudCommonModule, identifier: 'formulatext', initial: 'Formula Text'}
			}
		},
		'overloads': {
			'descriptioninfo': {
				'mandatory': true
			},
			'sorting': {
				'mandatory': true
			},
			'remarkinfo': {
				'mandatory': true
			},
			'formulatext': {
				'mandatory': true
			}
		}
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	mod.factory('basicsPriceConditionUIStandardService',
		['$translate', 'platformUIStandardConfigService', 'basicsPriceConditionTranslationService',
			'basicsPriceConditionLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function ($translate, platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PriceConditionDto',
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
				//platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);
})(angular);
