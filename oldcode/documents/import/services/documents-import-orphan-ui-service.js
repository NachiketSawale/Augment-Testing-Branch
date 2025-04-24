(function (angular) {
	'use strict';
	var modName = 'documents.import';
	angular.module(modName)
		.factory('documentImportLayout',
			['basicsLookupdataConfigGenerator',
				function () {
					return {
						'fid': 'documents.import.header',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['barcode', 'commenttext', 'originfilename']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'translationInfos': {
							'extraModules': [modName],
							'extraWords': {
								Barcode: {location: modName, identifier: 'entityBarCode', initial: 'BarCode'},
								CommentText: {location: modName, identifier: 'entityCommentText', initial: 'CommentText'},
								OriginFileName: {location: modName, identifier: 'entityFileArchiveDoc', initial: 'Origin File Name'}
							}
						},
						'overloads': {
							'barcode': {readonly: false},
							'commenttext': {readonly: false},
							'originfilename': {readonly: true}
						}
					};
				}]);

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('documentImportUIStandardService',
		['platformUIStandardConfigService', 'documentImportLayout', 'platformSchemaService',
			'platformUIStandardExtentService', 'documentsImportTranslationService',
			function (platformUIStandardConfigService, documentImportLayout, platformSchemaService,
				platformUIStandardExtentService, documentImportTranslationService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentorphanDto',
					moduleSubModule: 'Documents.Import'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				return new StructureUIStandardService(documentImportLayout, domainSchema, documentImportTranslationService);

			}
		]);
})(angular);