/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.material';

	/**
	 * @ngdoc service
	 * @name projectMaterialStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for for project Material container
	 */
	angular.module(moduleName).factory('projectMaterialStandardConfigurationService', [
		'platformUIStandardConfigService', 'projectMaterialTranslationService', 'projectMaterialConfigurationValuesService',
		'platformSchemaService', 'cloudCommonGridService', 'platformUIStandardExtentService',function (platformUIStandardConfigService, projectMaterialTranslationService,
			projectMaterialConfigurationValuesService, platformSchemaService, cloudCommonGridService, platformUIStandardExtentService) {

			let BaseService = platformUIStandardConfigService;

			let projectMaterialAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'PrjMaterialDto', moduleSubModule: 'Project.Material'} );

			if(projectMaterialAttributeDomains) {
				projectMaterialAttributeDomains = projectMaterialAttributeDomains.properties;
			}

			let basicMaterialAttributeDomains =  platformSchemaService.getSchemaFromCache({ typeName: 'MaterialDto', moduleSubModule: 'Basics.Material'});

			// Add the prefix 'BasMaterial' to the keys of the properties information because we use them in the context of the PrjMaterialDto
			basicMaterialAttributeDomains = cloudCommonGridService.addPrefixToKeys(basicMaterialAttributeDomains.properties, 'BasMaterial');

			let prjMaterialAttributeDomains = angular.extend({}, projectMaterialAttributeDomains, basicMaterialAttributeDomains);

			function ProjectMaterialUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ProjectMaterialUIStandardService.prototype = Object.create(BaseService.prototype);
			ProjectMaterialUIStandardService.prototype.constructor = ProjectMaterialUIStandardService;

			let projectMaterialDetailLayout = projectMaterialConfigurationValuesService.getProjectMaterialDetailLayout();

			let service = new ProjectMaterialUIStandardService(projectMaterialDetailLayout, prjMaterialAttributeDomains, projectMaterialTranslationService);
			platformUIStandardExtentService.extend(service, projectMaterialDetailLayout.addition, prjMaterialAttributeDomains.properties);
			return service;
		}
	]);
})(angular);
