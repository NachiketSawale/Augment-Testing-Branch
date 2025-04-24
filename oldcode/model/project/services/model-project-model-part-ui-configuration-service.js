/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectModelPartUIConfig
	 * @function
	 *
	 * @description
	 * modelProjectModelPartUIConfig is the data service for the UI configurations of the model part entity.
	 */
	angular.module(moduleName).factory('modelProjectModelPartUIConfig',
		['platformUIStandardConfigService', 'modelProjectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, modelProjectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function getModelPartDetailLayout() {
					return {
						fid: 'model.project.modelpartdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'baseGroup',
								'attributes': ['description', 'modelfk', 'modelpartfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'modelProjectVersionedModelLookupDataService',
								enableCache: true,
								filter: function (item) {
									return item.Model ? item.Model.ProjectFk : 0;
								},
								readonly: true
							}),
							modelpartfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'modelProjectVersionedModelLookupDataService',
								enableCache: true,
								filter: function (item) {
									return item.Model ? item.Model.ProjectFk : 0;
								},
								readonly: true
							})
						}
					};
				}

				var modelProjectModelPartDetailLayout = getModelPartDetailLayout();

				var modelProjectModelPartAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'ModelPartDto', moduleSubModule: 'Model.Project'});
				if(modelProjectModelPartAttributeDomains) {
					modelProjectModelPartAttributeDomains = modelProjectModelPartAttributeDomains.properties;
				}

				function ModelProjectModelPartUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ModelProjectModelPartUIStandardService.prototype = Object.create(BaseService.prototype);
				ModelProjectModelPartUIStandardService.prototype.constructor = ModelProjectModelPartUIStandardService;

				return new BaseService(modelProjectModelPartDetailLayout, modelProjectModelPartAttributeDomains, modelProjectMainTranslationService);
			}
		]);
})(angular);
