(function () {
	'use strict';
	const moduleName = 'basics.costgroups';

	/**
     * @ngdoc service
     * @name basicsCostGroupUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of basics costgroup entities
     */
	angular.module(moduleName).factory('basicsCostGroupUIStandardService',
		['$injector', '$http', 'platformUIStandardConfigService', 'platformLayoutHelperService', 'basicsCostgroupsTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator','projectMainConstantValues',



			function ($injector, $http, platformUIStandardConfigService, platformLayoutHelperService, basicsCostgroupsTranslationService, platformSchemaService, basicsLookupdataConfigGenerator,projectMainConstantValues) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.costgroups',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'basicData',
								'attributes': ['code', 'descriptioninfo', 'quantity', 'uomfk', 'referencequantitycode','leadquantitycalc','noleadquantity','islive']
							}
						],
						overloads: {
							descriptioninfo: {detail: {maxLength: 252}, grid: {maxLength: 252}},
							code: {detail: {maxLength: 32}, grid: {maxLength: 32}},
							uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsUnitLookupDataService', cacheEnable: true})
						}
					};
				}

				let costGroupDetailLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;

				let costGroupAttributeDomains = platformSchemaService.getSchemaFromCache(projectMainConstantValues.schemes.costGroup);
				costGroupAttributeDomains = costGroupAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;

				let baseService = new BaseService(costGroupDetailLayout, costGroupAttributeDomains, basicsCostgroupsTranslationService);
				baseService.getCreateMainLayout = function getCreateMainLayout() {
					return createMainDetailLayout();
				};
				return baseService;
			}
		]);
})();