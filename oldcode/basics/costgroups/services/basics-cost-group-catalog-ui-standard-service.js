(function () {
	'use strict';
	const moduleName = 'basics.costgroups';

	/**
     * @ngdoc service
     * @name basicsCostGroupCatalogUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of basics costgroup entities
     */
	angular.module(moduleName).factory('basicsCostGroupCatalogUIStandardService',
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
								'attributes': ['code', 'descriptioninfo','islive']
							}
						],
						overloads: {
							descriptioninfo: {detail: {maxLength: 252}, grid: {maxLength: 252}},
						}
					};
				}

				let costGroupCatDetailLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;
                
				let costGroupCatAttributeDomains = platformSchemaService.getSchemaFromCache(projectMainConstantValues.schemes.costGroupCatalog);
				costGroupCatAttributeDomains = costGroupCatAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;

				let baseService = new BaseService(costGroupCatDetailLayout, costGroupCatAttributeDomains, basicsCostgroupsTranslationService);
				baseService.getCreateMainLayout = function getCreateMainLayout() {
					return createMainDetailLayout();
				};
				return baseService;
			}
		]);
})();