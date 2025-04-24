(function (angular) {
	'use strict';
	var modName = 'qto.formula',
		cloudCommonModule = 'cloud.common',
		mod = angular.module(modName);

	mod.value('qtoFormulaCommentDataLayout', {
		'fid': 'qto.formula.comment',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': false,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['code', 'commenttext']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				CommentText: { location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment' }
			}
		},
		'overloads': {
			'code': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-common-limit-input',
					'options': {
						validKeys: {
							regular: '^.{0,3}$'
						}
					}
				},
				'grid': {
					formatter: 'code',
					editor: 'directive',
					editorOptions: {
						directive: 'basics-common-limit-input',
						validKeys: {
							regular: '^.{0,3}$'
						}
					},
					width: 80
				}
			},
			'commenttext': {
				'width': 70
			}
		}
	});

	mod.factory('qtoFormulaCommentDataUIStandardService',
		['platformUIStandardConfigService', 'qtoFormulaTranslationService',
			'qtoFormulaCommentDataLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoCommentDto',
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
})(angular);
