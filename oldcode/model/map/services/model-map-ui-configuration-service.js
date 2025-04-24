/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.map';

	/**
	 * @ngdoc service
	 * @name modelMapUIConfig
	 * @function
	 *
	 * @description
	 * modelMapUIConfig is the data service for all ui configurations functions.
	 */
	angular.module(moduleName).factory('modelMapUIConfig',
		['platformUIStandardConfigService', 'modelMapTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, modelMapTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				function getModelMapDetailLayout() {
					return {
						fid: 'model.map',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['modelfk', 'description', 'isdefault']
							}
						],

						'overloads': {
							modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
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

				var modelMapDetailLayout = getModelMapDetailLayout();

				var modelMapAttributeDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MapDto',
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

