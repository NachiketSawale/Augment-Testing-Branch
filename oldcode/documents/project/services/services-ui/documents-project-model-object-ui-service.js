/**
 * Created by alm on 2020-6-1.
 */
(function (angular) {
	'use strict';
	var moduleName = 'documents.project';
	angular.module(moduleName)
		.factory('documentProjectModelObjectLayout',
			['basicsLookupdataConfigGenerator', '$injector', 'documentsProjectDocumentModuleContext', function (basicsLookupdataConfigGenerator, $injector, documentsProjectDocumentModuleContext) {
				return {
					fid: 'document.project.modelObject',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					'groups': [
						{
							gid: 'basicData',
							attributes: ['prjdocumentfk', 'mdlmodelfk', 'mdlobjectfk']
						}
					],
					'translationInfos': {
						'extraModules': [moduleName],
						'extraWords': {
							PrjDocumentFk: {
								location: moduleName,
								identifier: 'entityId',
								initial: 'Document ID'
							},
							MdlModelFk: {
								location: moduleName, identifier: 'entityModel', initial: 'Model'
							},
							MdlObjectFk: {
								location: moduleName, identifier: 'entityModelObject', initial: 'Model Object'
							},
						}
					},
					overloads: {
						'prjdocumentfk': {
							readonly: true
						},
						'mdlmodelfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'documentModelProjectModelLookupDataService',
							enableCache: false,
							filter: function (item) {
								function getProjectId() {
									var prjId = -1;
									var documentsProjectModelObjectDataService = $injector.get('documentsProjectModelObjectDataService').getService(documentsProjectDocumentModuleContext.getConfig());
									var documentsProjectService = documentsProjectModelObjectDataService.parentService();
									prjId = documentsProjectService.getSelectedProjectId();
									return prjId;
								}

								return getProjectId(item);
							},
							filterKey: 'documents-project-model-by-company-filter'
						}),

						'mdlobjectfk': {
							'detail': {
								'type': 'directive',
								'directive': 'document-model-object-lookup-dialog'
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'document-model-object-lookup-dialog',
									lookupOptions: {
										filterKey: 'documents-project-model-object-by-model-filter',
										'displayMember': 'Description'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'modelObjects',
									filter: function (item) {
										return item.MdlModelFk || -1;
									},
									displayMember: 'Description',
									dataServiceName: 'documentModelMainObjectLookupDataService'
								}
							}
						}
					}
				};
			}
			]);

	angular.module(moduleName).factory('documentsProjectModelObjectUIService', ['documentProjectModelObjectLayout', 'platformUIStandardConfigService',
		'platformSchemaService', 'documentProjectDocumentTranslationService', 'platformUIStandardExtentService',
		function (documentProjectModelObjectLayout, platformUIStandardConfigService, platformSchemaService, translationService, platformUIStandardExtentService) {
			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'Document2mdlObjectDto',
				moduleSubModule: 'Documents.Project'
			});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			var service = new BaseService(documentProjectModelObjectLayout, domainSchema, translationService);

			platformUIStandardExtentService.extend(service, documentProjectModelObjectLayout.addition, domainSchema);

			return service;
		}]);
})(angular);
