/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.map';

	/**
	 * @ngdoc service
	 * @name modelMapAreaUIConfig
	 * @function
	 *
	 * @description
	 * modelMapAreaUIConfig is the data service for all ui configurations functions.
	 */
	angular.module(moduleName).factory('modelMapAreaUIConfig', modelMapAreaUIConfig);

	modelMapAreaUIConfig.$inject = ['platformUIStandardConfigService', 'modelMapTranslationService', 'basicsLookupdataConfigGenerator',
		'platformSchemaService', 'projectMainProjectSelectionService', 'modelMapDataService'];

	function modelMapAreaUIConfig(platformUIStandardConfigService, modelMapTranslationService, basicsLookupdataConfigGenerator,
		platformSchemaService, projectMainProjectSelectionService, modelMapDataService) {

		const BaseService = platformUIStandardConfigService;

		function getModelMapDetailLayout() {
			return {
				fid: 'model.map',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['description', 'locationfk']
					}
				],

				'overloads': {
					locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'projectLocationLookupDataService',
						showClearButton: true,
						filter: function () {

							const selectedMap = modelMapDataService.getSelected();
							const projectId = selectedMap.ProjectFk;
							if (projectId) {
								return projectId;
							}
						}
					})
				}
			};
		}

		const modelMapDetailLayout = getModelMapDetailLayout();

		let modelMapAttributeDomainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'MapAreaDto',
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
})(angular);

