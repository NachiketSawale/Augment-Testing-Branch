/**
 * Created by chk on 1/29/2016.
 */
/* jshint -W072 */
(function (angular) {
	'use strict';

	var moduleName = 'documents.project';

	angular.module(moduleName).factory('documentsProjectDocumentRevisionUIStandardService',
		['platformUIStandardConfigService',
			'documentsProjectDocumentRevisionDetailLayout',
			'platformSchemaService',
			'platformUIStandardExtentService',
			'documentProjectDocumentTranslationService',
			function (platformUIStandardConfigService,
				documentRevisionDetailLayout,
				platformSchemaService,
				platformUIStandardExtentService,
				documentTranslationService) {
				var service = {};
				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentRevisionDto',
					moduleSubModule: 'Documents.Project'
				});

				attributeDomains = attributeDomains.properties;
				attributeDomains.ModelStatus = {domain: 'action'};

				service.service = new StructureUIStandardService(documentRevisionDetailLayout, attributeDomains, documentTranslationService);
				return service.service;
			}
		]);

	angular.module(moduleName).factory('documentsProjectDocumentRevisionDetailLayout', [
		function () {
			return {
				'fid': 'documents.project.documentRevision.detail',
				'version': '1.1.0',
				'showGrouping': true,
				'addValidationAutomatically': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['originfilename', 'barcode', 'description', 'commenttext', 'revision', 'filesize']
						// 'attributes': ['barcode', 'description', 'commenttext', 'revision']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName],
					'extraWords': {
						OriginFileName: {location: moduleName, identifier: 'entityFileArchiveDoc', initial: 'Origin File Name'},
						BarCode: {location: moduleName, identifier: 'Revisions.BarCode', initial: 'BarCode'},
						Description: {location: 'cloud.common', identifier: 'entityDescription', initial: 'Description'},
						CommentText: {location: 'cloud.common', identifier: 'entityCommentText', initial: 'Comment'},
						Revision: {location: moduleName, identifier: 'Revisions.Revision', initial: 'Revision'},
						FileSize: {
							location: moduleName,
							identifier: 'entityFileSize',
							initial: 'File Size'
						},
					}
				},
				'overloads': {
					'originfilename': {readonly: true},
					'revision': {readonly: true},
					'filesize': {
						'readonly': 'true'
					},
				}
			};
		}
	]);
})(angular);