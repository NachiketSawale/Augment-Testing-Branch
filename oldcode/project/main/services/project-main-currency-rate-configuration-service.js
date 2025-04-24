/**
 * Created by Frank Baedeker on 30.01.2015.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectMainChangeConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers defined in project main module
	 */
	angular.module('project.main').factory('projectMainCurrencyRateConfigurationService', ['platformUIStandardConfigService',
		'projectMainTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',
		function (platformUIStandardConfigService, projectMainTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

			function createCurrencyConversionRateDetailLayout() {
				return {
					fid: 'project.main.projectcurrencyratedetailform',
					version: '0.2.4',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['currencyforeignfk', 'currencyhomefk', 'currencyratetypefk', 'ratedate', 'rate', 'basis', 'comment']
						},
						{
							gid: 'entityHistory',
							isHistory: true
						}
					],
					overloads: {
						currencyhomefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsCurrencyLookupDataService',
							enableCache: true,
							readonly: true
						}),
						currencyforeignfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsForeignCurrencyLookupService',
							enableCache: true,
							filter: function (item) {
								return item.CurrencyHomeFk;
							}
						}),
						currencyratetypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.currency.rate.type', 'Description')
					}
				};
			}

			var projectCurrencyRateDetailLayout = createCurrencyConversionRateDetailLayout();

			var BaseService = platformUIStandardConfigService;

			var projectCurrencyRateAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'CurrencyRateDto', moduleSubModule: 'Project.Main'} );
			if(projectCurrencyRateAttributeDomains) {
				projectCurrencyRateAttributeDomains = projectCurrencyRateAttributeDomains.properties;
			}

			function ProjectUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ProjectUIStandardService.prototype = Object.create(BaseService.prototype);
			ProjectUIStandardService.prototype.constructor = ProjectUIStandardService;

			return new BaseService(projectCurrencyRateDetailLayout, projectCurrencyRateAttributeDomains, projectMainTranslationService);
		}
	]);
})();
