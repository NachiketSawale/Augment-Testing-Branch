/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectModelFileUIConfig
	 * @function
	 *
	 * @description
	 * modelProjectModelFileUIConfig is the data service for all ui configurations functions.
	 */
	angular.module(moduleName).factory('modelProjectModelFileUIConfig',
		['platformUIStandardConfigService', 'modelProjectModelFileDataService', 'modelProjectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, modelProjectModelFileDataService, modelProjectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function getModelDetailLayout() {
					return {
						fid: 'model.project.modelfiledetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['description', 'originfilename']
							},
							{
								gid: 'modelCnvGroup',
								attributes: ['action', 'status', 'pktagids', 'trace', 'importprofilefk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'originfilename': {
								'grid': {
									'editor': 'directive',
									'editorOptions': {
										directive: 'model-project-file-upload-input',
										formData: {
											sectionType: 'Model',
											action: 'Upload',
											appId: '17221f9d254d4304b2683915ab92c14a'
										},
										uploadServiceKey: 'model.file',
										fileFilter: modelProjectModelFileDataService.getBimFiles()
									},
									'formatter': 'description',
									'width': 200
								},
								'detail': {
									'type': 'directive',
									directive: 'model-project-file-upload-input',
									'options': {
										formData: {
											sectionType: 'Model',
											action: 'Upload',
											appId: '17221f9d254d4304b2683915ab92c14a'
										},
										uploadServiceKey: 'model.file',
										fileFilter: modelProjectModelFileDataService.getBimFiles(),
										canUpload: function () {
											return false;
										}
									}
								},
								readonly: true
							},
							status: {
								formatterOptions: {
									appendContent: true,
									displayMember: 'StatusText'
								}
							},
							pktagids: {
								detail: {
									type: 'directive',
									directive: 'model-administration-property-key-tag-selector',
									options: {
										model: 'PkTagIds',
										change: function (item) {
											modelProjectModelFileDataService.markItemAsModified(item);
										}
									}
								},
								grid: {
									editor: 'directive',
									editorOptions: {
										model: 'PkTagIds',
										change: function (item) {
											modelProjectModelFileDataService.markItemAsModified(item);
										},
										directive: 'model-administration-property-key-tag-selector',
									},
									width: 150,
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'modelAdministrationPropertyKeyTagSetLookupDataService',
										displayMember: 'DisplayName'
									}
								}
							},
							trace: {
								readonly: true
							},
							importprofilefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'modelAdministrationModelImportProfileWithAutoselectLookupDataService',
								enableCache: true,
								readonly: true
							})
						}
					};
				}

				var modelProjectModelFileDetailLayout = getModelDetailLayout();

				var modelProjectModelFileAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ModelFileDto',
					moduleSubModule: 'Model.Project'
				});
				if (modelProjectModelFileAttributeDomains) {
					modelProjectModelFileAttributeDomains = modelProjectModelFileAttributeDomains.properties;
					modelProjectModelFileAttributeDomains.Status = {domain: 'action'};
					modelProjectModelFileAttributeDomains.Action = {domain: 'action'};
				}

				function ModelProjectModelFileUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ModelProjectModelFileUIStandardService.prototype = Object.create(BaseService.prototype);
				ModelProjectModelFileUIStandardService.prototype.constructor = ModelProjectModelFileUIStandardService;

				return new BaseService(modelProjectModelFileDetailLayout, modelProjectModelFileAttributeDomains, modelProjectMainTranslationService);
			}
		]);
})(angular);
