/**
 * Created by xia on 5/8/2019.
 */
(function () {
	'use strict';
	let moduleName = 'basics.indextable';
	/**
     * @ngdoc service
     * @name basicsIndexHeaderUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of unit entities
     */
	angular.module(moduleName).factory('basicsIndexHeaderUIStandardService',

		['platformUIStandardConfigService', 'basicsIndextableTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator','basicsCurrencyLookupDataService', 'basicsCommonCodeDescriptionSettingsService',

			function (platformUIStandardConfigService, basicsIndextableTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.indextable.indexheaderdetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						'groups': [
							{
								gid: 'baseGroup',
								attributes: ['code', 'descriptioninfo', 'commenttext', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5','currencyfk','ratefactorfk']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							},
						],
						'overloads':{
							currencyfk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName:'basicsCurrencyLookupDataService' ,enableCache: true}),
							levelfk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName:'basicsIndexLevelLookupDataService' ,enableCache: true}),
							ratefactorfk:basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName:'basicsIndexRateFactorLookupDataService' ,enableCache: true})
						}
					};
				}

				let indexHeaderDetailLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;

				let basicsIndexHeaderAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BasIndexHeaderDto',
					moduleSubModule: 'Basics.IndexTable'
				});
				basicsIndexHeaderAttributeDomains = basicsIndexHeaderAttributeDomains.properties;


				function IndexHeaderUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				IndexHeaderUIStandardService.prototype = Object.create(BaseService.prototype);
				IndexHeaderUIStandardService.prototype.constructor = IndexHeaderUIStandardService;

				return new BaseService(indexHeaderDetailLayout, basicsIndexHeaderAttributeDomains, basicsIndextableTranslationService);
			}
		]);
})();
