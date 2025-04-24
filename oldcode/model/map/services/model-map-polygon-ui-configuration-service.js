/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc service
	 * @name modelMapPolygonUIConfig
	 * @function
	 *
	 * @description
	 * modelMapPolygonUIConfig is the data service for all ui configurations functions.
	 */
	angular.module(moduleName).factory('modelMapPolygonUIConfig',
		['platformUIStandardConfigService', 'modelMapTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService','projectMainProjectSelectionService','modelMapDataService',
			
			function (platformUIStandardConfigService, modelMapTranslationService, basicsLookupdataConfigGenerator, platformSchemaService,projectMainProjectSelectionService,modelMapDataService) {
				
				var BaseService = platformUIStandardConfigService;
				
				function getModelMapDetailLayout() {
					return {
						fid: 'model.map.polygon',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': [ 'description','locationfk']
							}
						],
						'overloads': {
							locationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'projectLocationLookupDataService',
								showClearButton: true,
								filter: function () {
									
									var selectedMap=  modelMapDataService.getSelected();
									var projectId= selectedMap.ProjectFk;
									if(projectId){
										return projectId;
									}
								}
							})
							
						}
					};
				}
				
				var modelMapDetailLayout = getModelMapDetailLayout();
				
				var modelMapAttributeDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'MapPolygonDto', moduleSubModule: 'Model.Map'} );
				if(modelMapAttributeDomainSchema) {
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

