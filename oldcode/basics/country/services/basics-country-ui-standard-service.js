(function (angular) {
	'use strict';
	var moduleName = 'basics.country';

	/**
	 * @ngdoc service
	 * @name basicsCountryUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of Country entities
	 */
	angular.module(moduleName).factory('basicsCountryUIStandardService',
		['platformUIStandardConfigService', 'basicsCountryTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService',

			function (platformUIStandardConfigService, basicsCountryTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						fid: 'basics.country.countrydetailform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						groups: [
							{
								'gid': 'country',
								'attributes': ['iso2', 'iso3', 'descriptioninfo', 'addressformatfk', 'areacode', 'isdefault', 'recordstate', 'regexvatno', 'regextaxno', 'vatnovalidexample', 'taxnovalidexample']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							iso2: {
								detail: {
									maxLength: 2
								},
								grid: {
									maxLength: 2
								}
							},
							iso3: {
								detail: {
									maxLength: 3
								},
								grid: {
									maxLength: 3
								}
							},
							addressformatfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.addressformat')
						}
					};
				}

				var countryDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var countryAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'CountryDto',
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
})(angular);
