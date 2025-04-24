(function (angular) {
	'use strict';
	let modName = 'qto.main',
		mod = angular.module(modName);
	
	mod.value('prjQtoCommentDataLayout', {
		'fid': 'qto.formula.comment',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': false,
		'groups': [{'gid': 'basicData', 'attributes': ['code', 'commenttext', 'prjprojectfk']}, {
			'gid': 'entityHistory',
			'isHistory': true
		}],
		'overloads': {
			'code': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-common-limit-input',
					'options': {validKeys: {regular: '^.{0,3}$'}}
				},
				'grid': {
					formatter: 'code',
					editor: 'directive',
					editorOptions: {directive: 'basics-common-limit-input', validKeys: {regular: '^.{0,3}$'}},
					width: 80
				}
			},
			'commenttext': {'width': 70},
			'prjprojectfk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						lookupDirective: 'qto-header-project-lookup-dialog',
						descriptionField: 'ProjectName',
						descriptionMember: 'ProjectName'
					}
				},
				'grid': {
					formatter: 'lookup',
					formatterOptions: {lookupType: 'QtoPrcProject', displayMember: 'ProjectNo'},
					editor: null,
					editorOptions: null
				}
			}
		}
	});
	
	mod.factory('prjQtoCommentUIStandardService', ['platformUIStandardConfigService', 'qtoMainTranslationService', 'prjQtoCommentDataLayout', 'platformSchemaService', function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
		let BaseService = platformUIStandardConfigService;
		let domainSchema = platformSchemaService.getSchemaFromCache({
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
	}]);
})(angular);
