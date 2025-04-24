/**
 * Created by jhe on 7/25/2018.
 */
(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.regionCatalog';
	/**
     * @ngdoc service
     * @name basicsRegionTypeUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of unit entities
     */
	angular.module(moduleName).factory('basicsRegionTypeUIStandardService',

		['platformUIStandardConfigService', 'basicsRegionCatalogTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsRegionCatalogTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.regionCatalog.regionTypeList',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['descriptioninfo']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							'descriptioninfo':{'readonly':true}
						}
					};
				}

				var unitDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var regionCatalogAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'RegionTypeDto',
					moduleSubModule: 'Basics.RegionCatalog'
				});
				regionCatalogAttributeDomains = regionCatalogAttributeDomains.properties;


				function RegionTypeUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				RegionTypeUIStandardService.prototype = Object.create(BaseService.prototype);
				RegionTypeUIStandardService.prototype.constructor = RegionTypeUIStandardService;

				var service = new BaseService(unitDetailLayout, regionCatalogAttributeDomains, basicsRegionCatalogTranslationService);

				return service;
			}
		]);
})();
