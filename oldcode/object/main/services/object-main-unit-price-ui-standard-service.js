(function () {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnitPriceUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of UnitPrice entities
	 */
	angular.module(moduleName).factory('objectMainUnitPriceUIStandardService',
		['platformUIStandardConfigService', '$injector', 'objectMainTranslationService', 'platformSchemaService','basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, objectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {

						'fid': 'object.main.unitpricedetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['pricetypefk', 'price', 'commenttext']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							pricetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.objectpricetype')

						}
					};
				}

				var unitPriceDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var unitPriceAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'UnitPriceDto',
					moduleSubModule: 'Object.Main'
				});
				unitPriceAttributeDomains = unitPriceAttributeDomains.properties;


				function UnitPriceUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitPriceUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitPriceUIStandardService.prototype.constructor = UnitPriceUIStandardService;

				return new BaseService(unitPriceDetailLayout, unitPriceAttributeDomains, objectMainTranslationService);
			}
		]);
})();
