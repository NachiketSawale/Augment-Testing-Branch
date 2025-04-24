/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'project.costcodes';

	/**
	 * @ngdoc service
	 * @name projectCostCodesJobRateStandardConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for for project costcodes job rate container
	 */
	angular.module(moduleName).factory('projectCostCodesJobRateStandardConfigurationService',

		['platformUIStandardConfigService', 'projectCostCodesTranslationService', 'projectCostCodesJobRateConfigValuesService', 'platformSchemaService', 'cloudCommonGridService',

			function (platformUIStandardConfigService, projectCostCodesTranslationService, projectCostCodesJobRateConfigValuesService, platformSchemaService, cloudCommonGridService) {


				let BaseService = platformUIStandardConfigService;

				let projectCostCodesJobRateAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ProjectCostCodesJobRateDto', moduleSubModule: 'Project.CostCodes'} );

				if(projectCostCodesJobRateAttributeDomains) {
					projectCostCodesJobRateAttributeDomains = projectCostCodesJobRateAttributeDomains.properties;
				}

				let basicCostCodesAttributeDomains =  platformSchemaService.getSchemaFromCache({ typeName: 'CostCodeDto', moduleSubModule: 'Basics.CostCodes'});

				// Add the prefix 'BasCostCode' to the keys of the properties information because we use them in the context of the PrjCostCodeDto
				basicCostCodesAttributeDomains = cloudCommonGridService.addPrefixToKeys(basicCostCodesAttributeDomains.properties, 'BasCostCode');

				let prjCostCodesJobRateAttributeDomains= angular.extend({}, projectCostCodesJobRateAttributeDomains, basicCostCodesAttributeDomains);

				function ProjectCostCodesJobRateUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ProjectCostCodesJobRateUIStandardService.prototype = Object.create(BaseService.prototype);
				ProjectCostCodesJobRateUIStandardService.prototype.constructor = ProjectCostCodesJobRateUIStandardService;

				let projectCostCodesJobRateDetailLayout = projectCostCodesJobRateConfigValuesService.getProjectCostCodesJobRateDetailLayout();

				return new BaseService(projectCostCodesJobRateDetailLayout, prjCostCodesJobRateAttributeDomains, projectCostCodesTranslationService);
			}
		]);
})(angular);
