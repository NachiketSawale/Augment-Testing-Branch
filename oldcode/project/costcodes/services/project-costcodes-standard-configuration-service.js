/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';

	/**
	 * @ngdoc service
	 * @name projectCostCodesStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for for project costcodes container
	 */
	angular.module(moduleName).factory('projectCostCodesStandardConfigurationService',

		['platformUIStandardConfigService', 'projectCostCodesTranslationService', 'projectCostCodesConfigurationValuesService', 'platformSchemaService', 'cloudCommonGridService',

			function (platformUIStandardConfigService, projectCostCodesTranslationService, projectCostCodesConfigurationValuesService, platformSchemaService, cloudCommonGridService) {


				let BaseService = platformUIStandardConfigService;

				let projectCostCodesAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'PrjCostCodesDto', moduleSubModule: 'Project.CostCodes'} );

				if(projectCostCodesAttributeDomains) {
					projectCostCodesAttributeDomains = projectCostCodesAttributeDomains.properties;
				}

				let basicCostCodesAttributeDomains =  platformSchemaService.getSchemaFromCache({ typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'});

				// Add the prefix 'BasCostCode' to the keys of the properties information because we use them in the context of the PrjCostCodeDto
				basicCostCodesAttributeDomains = cloudCommonGridService.addPrefixToKeys(basicCostCodesAttributeDomains.properties, 'BasCostCode');

				let prjCostCodeAttributeDomains = angular.extend({}, projectCostCodesAttributeDomains, basicCostCodesAttributeDomains);

				function ProjectCostCodesUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectCostCodesUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectCostCodesUIStandardService.prototype.constructor = ProjectCostCodesUIStandardService;

				let projectCostCodesDetailLayout = projectCostCodesConfigurationValuesService.getProjectCostCodesDetailLayout();

				return new BaseService(projectCostCodesDetailLayout, prjCostCodeAttributeDomains, projectCostCodesTranslationService);
			}
		]);
})(angular);
