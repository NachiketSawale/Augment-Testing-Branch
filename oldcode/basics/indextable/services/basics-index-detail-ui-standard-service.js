/**
 * Created by xia on 5/8/2019.
 */
(function () {

	'use strict';
	var moduleName = 'basics.indextable';
	/**
     * @ngdoc service
     * @name basicsIndexDetailUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of unit entities
     */
	angular.module(moduleName).factory('basicsIndexDetailUIStandardService',

		['platformUIStandardConfigService', 'basicsIndextableTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'basicsCommonCodeDescriptionSettingsService',

			function (platformUIStandardConfigService, basicsIndextableTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'basics.indextable.indexdetaildetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						'groups': [
							{
								gid: 'baseGroup',
								attributes: ['date','lowquantity', 'quantity','highquantity', 'commenttext']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						'overloads':{
							'date': {
								'detail':{
									'type': 'dateutc',
									formatter: 'dateutc'
								},
								'grid':{
									editor: 'dateutc',
									formatter: 'dateutc'
								}
							}
						}
					};
				}

				let indexDetailDetailLayout = createMainDetailLayout();

				let BaseService = platformUIStandardConfigService;

				let basicsIndexHeaderAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'BasIndexDetailDto',
					moduleSubModule: 'Basics.IndexTable'
				});
				basicsIndexHeaderAttributeDomains = basicsIndexHeaderAttributeDomains.properties;

				function IndexTableUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				IndexTableUIStandardService.prototype = Object.create(BaseService.prototype);
				IndexTableUIStandardService.prototype.constructor = IndexTableUIStandardService;

				return new BaseService(indexDetailDetailLayout, basicsIndexHeaderAttributeDomains, basicsIndextableTranslationService);
			}
		]);
})();

