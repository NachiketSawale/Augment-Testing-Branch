(function () {
	'use strict';
	var modName = 'qto.formula',
		mod = angular.module(modName);

	mod.service('qtoFormulaValidationScriptTranslationLayout', [function () {
		return {
			'fid': 'qto.formula.validationscript.translation',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': false,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['code', 'validationtext']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					ValidationText: {location: modName, identifier: 'scriptValidationTrans.validationText', initial: 'Validation Text'}
				}
			},
			'overloads': {
				'code': {
					regex: '^[a-zA-Z0-9_]+$',
					'required': true,
					'mandatory': true,
					'searchable': true
				},
				'validationtext': {
					'maxLength': 252
				}
			}
		};
	}]);

	mod.factory('qtoFormulaValidationScriptTranslationUIStandardService',
		['platformUIStandardConfigService', 'qtoFormulaTranslationService',
			'qtoFormulaValidationScriptTranslationLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoFormulaScriptTransDto',
					moduleSubModule: 'Qto.Formula'
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
