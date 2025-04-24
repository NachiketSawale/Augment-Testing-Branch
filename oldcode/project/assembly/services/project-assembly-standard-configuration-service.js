
(function (angular) {
	'use strict';
	var moduleName = 'project.assembly';

	/**
	 * @ngdoc service
	 * @name projectAssemblyStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for for project Assembly container
	 */
	angular.module(moduleName).factory('projectAssemblyStandardConfigurationService',

		['platformUIStandardConfigService', 'projectAssemblyTranslationService', 'projectAssemblyUIConfigurationService', 'platformSchemaService', 'cloudCommonGridService',

			function (platformUIStandardConfigService, projectAssemblyTranslationService, projectAssemblyUIConfigurationService, platformSchemaService, cloudCommonGridService) {


				var BaseService = platformUIStandardConfigService;

				var projectAssemblyAttributeDomains = platformSchemaService.getSchemaFromCache( {typeName: 'Project2EstAssemblyDto', moduleSubModule: 'Project.Assembly'} );

				if(projectAssemblyAttributeDomains) {
					projectAssemblyAttributeDomains = projectAssemblyAttributeDomains.properties;
				}

				var assemblyAttributeDomains =  platformSchemaService.getSchemaFromCache({typeName: 'EstLineItemDto', moduleSubModule: 'Estimate.Main'});

				// Add the prefix 'Assembly' to the keys of the properties information because we use them in the context of the Project2EstAssemblyDto
				assemblyAttributeDomains = cloudCommonGridService.addPrefixToKeys(assemblyAttributeDomains.properties, 'Assembly');

				var prjAssemblyAttributeDomains = angular.extend({}, projectAssemblyAttributeDomains, assemblyAttributeDomains);

				function ProjectAssemblyUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectAssemblyUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectAssemblyUIStandardService.prototype.constructor = ProjectAssemblyUIStandardService;

				var projectAssemblyDetailLayout = projectAssemblyUIConfigurationService.getProjectAssemblyDetailLayout();

				return new BaseService(projectAssemblyDetailLayout, prjAssemblyAttributeDomains, projectAssemblyTranslationService);
			}
		]);
})(angular);
