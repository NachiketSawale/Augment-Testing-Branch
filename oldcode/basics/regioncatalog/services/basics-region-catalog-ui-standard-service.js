/**
 * Created by jhe on 7/23/2018.
 */
(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'basics.regionCatalog';
	/**
     * @ngdoc service
     * @name basicsRegionCatalogUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of unit entities
     */
	angular.module(moduleName).factory('basicsRegionCatalogUIStandardService',

		['platformUIStandardConfigService', 'basicsRegionCatalogTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, basicsRegionCatalogTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.regionCatalog.regionCatalogList',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						'groups': [
							{
								gid: 'baseGroup',
								attributes: ['descriptioninfo', 'commenttextinfo', 'uomfk', 'orgcode','sorting','isdefault','islive']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							'uomfk': {
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-uom-lookup',
									'options': {
										'eagerLoad': true
									}
								},
								'grid': {
									editor: 'lookup',
									editorOptions: {
										lookupDirective: 'basics-lookupdata-uom-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'uom',
										displayMember: 'Unit'
									}
								}
							},
						}
					};
				}

				var unitDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var regionCatalogAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'RegionCatalogDto',
					moduleSubModule: 'Basics.RegionCatalog'
				});
				regionCatalogAttributeDomains = regionCatalogAttributeDomains.properties;


				function RegionCatalogUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}
                
				RegionCatalogUIStandardService.prototype = Object.create(BaseService.prototype);
				RegionCatalogUIStandardService.prototype.constructor = RegionCatalogUIStandardService;

				var service = new BaseService(unitDetailLayout, regionCatalogAttributeDomains, basicsRegionCatalogTranslationService);

				return service;
			}
		]);
})();
