/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.map';

	/**
	 * @ngdoc service
	 * @name modelMapLevelUIConfig
	 * @function
	 *
	 * @description
	 * modelMapLevelUIConfig is the data service for all ui configurations functions.
	 */
	angular.module(moduleName).factory('modelMapLevelUIConfig',
		['_', 'platformUIStandardConfigService', 'modelMapTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'projectMainProjectSelectionService', 'basicsLookupdataLookupFilterService', 'modelViewerModelSelectionService', 'modelMapDataService',

			function (_, platformUIStandardConfigService, modelMapTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, projectMainProjectSelectionService, basicsLookupdataLookupFilterService, modelViewerModelSelectionService,modelMapDataService) {

				var BaseService = platformUIStandardConfigService;

				var filter = [{
					key: 'document-project-document-myown-filter',
					serverSide: true,
					serverKey: 'document-project-document-common-filter',
					fn: function () {
						var pid = _.get(modelViewerModelSelectionService.getSelectedModel(), 'info.projectId');
						if (pid) {
							return { ProjectFk: pid};
						} else {
							return {};
						}
					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filter);

				function getModelMapDetailLayout() {
					return {
						fid: 'model.map.level',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['description', 'locationfk', 'prjdocumentfk', 'zmin', 'zmax',
									'orientationangle', 'translationx', 'translationy', 'scale', 'zlevel', 'viewingdistance', 'isup']
							}
						],

						'overloads': {

							locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								showClearButton: true,
								filter: function () {
									var selectedMap=  modelMapDataService.getSelected();
									var projectId= selectedMap.ProjectFk;
									if (projectId) {
										return projectId;
									}
								}
							}),
							/*
							prjdocumentfk:basicsLookupdataConfigGenerator.provideGenericLookupConfig('documents.project.documenttype')
							 */
							'prjdocumentfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'project-document-lookup-dialog',
										'lookupOptions': {
											'showClearButton': true,
											'filterKey': 'document-project-document-myown-filter'
										}
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'ProjectDocument',
										'displayMember': 'Description',
										'version': 3
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'project-document-lookup-dialog',
										'descriptionMember': 'Description',
										'lookupOptions': {
											'showClearButton': true,
											'initValueField': 'Description',
											'filterKey': 'document-project-document-myown-filter'
										}
									}
								}
							}

						}
					};
				}

				var modelMapDetailLayout = getModelMapDetailLayout();

				var modelMapAttributeDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MapLevelDto',
					moduleSubModule: 'Model.Map'
				});
				if (modelMapAttributeDomainSchema) {
					modelMapAttributeDomainSchema = modelMapAttributeDomainSchema.properties;
				}

				function ModelMapUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ModelMapUIStandardService.prototype = Object.create(BaseService.prototype);
				ModelMapUIStandardService.prototype.constructor = ModelMapUIStandardService;

				return new BaseService(modelMapDetailLayout, modelMapAttributeDomainSchema, modelMapTranslationService);
			}
		]);
})(angular);

