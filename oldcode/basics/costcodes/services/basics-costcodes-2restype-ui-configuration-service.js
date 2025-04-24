/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc service
	 * @name basicsCostCodes2ResTypeUIConfigurationService
	 * @function
	 *
	 * @description
	 *basicsCostCodes2ResTypeUIConfigurationService
	 */
	angular.module(moduleName).factory('basicsCostCodes2ResTypeUIConfigurationService',
		['platformUIStandardConfigService',
			'basicsCostCodesTranslationService',
			'platformSchemaService', 'basicsLookupdataConfigGenerator',
			function (platformUIStandardConfigService,
				basicsCostCodesTranslationService,
				platformSchemaService, basicsLookupdataConfigGenerator) {

				let BaseService = platformUIStandardConfigService;
				let costCodes2ResTypeLayout = {

					'fid': 'basics.costcodes.restype.layout',
					'version': '1.0.0',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['resourcecontextfk', 'restypefk']
						}
					],

					'overloads': {
						'resourcecontextfk':basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.resource.context', 'Description'),
						'restypefk':  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceTypeLookupDataService'
						})
					}
				};

				let costCodes2ResTypeSchema = platformSchemaService.getSchemaFromCache({typeName: 'CostCode2ResTypeDto',moduleSubModule: 'Basics.CostCodes'});
				if (costCodes2ResTypeSchema) {
					costCodes2ResTypeSchema = costCodes2ResTypeSchema.properties;
					costCodes2ResTypeSchema.ResourceContextFk ={ domain : 'integer'};
				}
				function CostCode2ResTypeUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
				CostCode2ResTypeUIStandardService.prototype = Object.create(BaseService.prototype);
				CostCode2ResTypeUIStandardService.prototype.constructor = CostCode2ResTypeUIStandardService;
				return new BaseService(costCodes2ResTypeLayout, costCodes2ResTypeSchema, basicsCostCodesTranslationService);
			}
		]);
})(angular);

