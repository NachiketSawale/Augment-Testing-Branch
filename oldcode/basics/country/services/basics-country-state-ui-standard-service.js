(function () {
	'use strict';
	var moduleName = 'basics.country';

	/**
	 * @ngdoc service
	 * @name basicsCountryStateUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of Country entities
	 */
	angular.module(moduleName).factory('basicsCountryStateUIStandardService',
		['platformUIStandardConfigService', '$injector', 'basicsCountryTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, basicsCountryTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						fid: 'basics.country.countrydetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'country',
								attributes: ['state', 'description', 'sorting']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
						}
					};
				}

				var countryDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var countryAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'StateDto',
					moduleSubModule: 'Basics.Country'
				});
				countryAttributeDomains = countryAttributeDomains.properties;


				function CountryUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				CountryUIStandardService.prototype = Object.create(BaseService.prototype);
				CountryUIStandardService.prototype.constructor = CountryUIStandardService;

				return new BaseService(countryDetailLayout, countryAttributeDomains, basicsCountryTranslationService);
			}
		]);
})();
