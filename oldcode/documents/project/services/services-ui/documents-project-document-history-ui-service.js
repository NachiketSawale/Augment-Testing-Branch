/**
 * Created by lvy on 8/22/2018.
 */
(function (angular) {
	'use strict';
	var modName = 'documents.project';
	var cloudMod = 'cloud.common';
	angular.module(modName)
		.factory('documentProjectHistoryLayout',
			[
				function () {
					return {

						'fid': 'documents.project.documentHistory.detail',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['prjdocumentoperationfk', 'basclerkfk', 'remark']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'translationInfos': {
							'extraModules': [modName, cloudMod],
							'extraWords': {
								PrjDocumentOperationFk: {location: modName, identifier: 'entityPrjDocumentOperation', initial: 'Operation'},
								Remark: {location: modName, identifier: 'entityPrjDocumentRemark', initial: 'Remark'},
								BasClerkFk: {location: cloudMod, identifier: 'entityClerk', initial: 'Clerk'}
							}
						},
						'overloads': {
							'prjdocumentoperationfk': {
								detail: {
									type: 'lookup',
									options: {
										lookupType: 'DocumentOperations',
										displayMember: 'DescriptionInfo.Description'
									}
								},
								grid: {
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'DocumentOperations',
										displayMember: 'DescriptionInfo.Description'
									}
								},
								'readonly': true
							},
							'basclerkfk': {
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										descriptionMember: 'Description',
										lookupOptions: {
											showClearButton: true
										}
									},
									requiredInErrorHandling: true
								},
								grid: {
									editor: 'lookup',
									directive: 'basics-lookupdata-lookup-composite',
									editorOptions: {
										lookupDirective: 'cloud-clerk-clerk-dialog',
										lookupOptions: {
											showClearButton: true,
											displayMember: 'Code',
											addGridColumns: [{
												id: 'Description',
												field: 'Description',
												name: 'Description',
												width: 200,
												formatter: 'description',
												name$tr$: 'cloud.common.entityDescription'
											}],
											additionalColumns: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Clerk',
										displayMember: 'Code'
									}
								},
								'readonly': true
							},
							'remark': {readonly: true}
						},
						'addition': {
							'grid': [{
								'id': 'PrjDocumentRevision',
								'field': 'PrjDocumentRevision',
								'name': 'Revision',
								'name$tr$': 'documents.project.Revisions.Revision',
								'formatter': 'integer',
								'readonly': true
							}]
						}
					};
				}]);

	angular.module(modName).factory('documentProjectHistoryUIStandardService',
		[
			'$translate', 'platformUIStandardConfigService', 'documentProjectDocumentTranslationService',
			'documentProjectHistoryLayout', 'platformSchemaService', 'platformUIStandardExtentService',
			function ($translate, PlatformUIStandardConfigService, translationService, layout, platformSchemaService,
				platformUIStandardExtentService) {
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentHistoryDto',
					moduleSubModule: 'Documents.Project'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				var layoutCopy = angular.copy(layout);
				var service = new PlatformUIStandardConfigService(layoutCopy, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layoutCopy.addition);
				return service;

			}
		]);
})(angular);