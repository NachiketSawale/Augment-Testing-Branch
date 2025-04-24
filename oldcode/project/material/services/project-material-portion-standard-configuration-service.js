
(function (angular) {
	'use strict';
	let moduleName = 'project.material';

	angular.module(moduleName).factory('projectMaterialPortionStandardConfigurationService', [
		'platformUIStandardConfigService', 'projectMaterialTranslationService', 'projectMaterialPortionConfigurationValuesService',
		'platformSchemaService', 'cloudCommonGridService', function (platformUIStandardConfigService, projectMaterialTranslationService,projectMaterialPortionConfigurationValuesService, platformSchemaService, cloudCommonGridService) {

			let BaseService = platformUIStandardConfigService;

			let projectMaterialPortionAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'Project2MdcMaterialPortionDto', moduleSubModule: 'Project.Material'} );

			if(projectMaterialPortionAttributeDomains) {
				projectMaterialPortionAttributeDomains = projectMaterialPortionAttributeDomains.properties;
			}

			let basicMaterialPortionAttributeDomains =  platformSchemaService.getSchemaFromCache({ typeName: 'MaterialPortionDto', moduleSubModule: 'Basics.Material'});

			// Add the prefix 'BasMaterial' to the keys of the properties information because we use them in the context of the PrjMaterialDto
			basicMaterialPortionAttributeDomains = cloudCommonGridService.addPrefixToKeys(basicMaterialPortionAttributeDomains.properties, 'BasMaterialPortion');

			let prjMaterialPortionAttributeDomains = angular.extend({}, projectMaterialPortionAttributeDomains, basicMaterialPortionAttributeDomains);

			function ProjectMaterialPortionUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ProjectMaterialPortionUIStandardService.prototype = Object.create(BaseService.prototype);
			ProjectMaterialPortionUIStandardService.prototype.constructor = ProjectMaterialPortionUIStandardService;

			let projectMaterialDetailLayout = projectMaterialPortionConfigurationValuesService.getProjectMaterialPortionDetailLayout();

			return new BaseService(projectMaterialDetailLayout, prjMaterialPortionAttributeDomains, projectMaterialTranslationService);
		}
	]);
})(angular);
