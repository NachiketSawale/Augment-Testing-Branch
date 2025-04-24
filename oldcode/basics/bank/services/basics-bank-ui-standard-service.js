(function () {
	'use strict';
	var moduleName = 'basics.bank';

	/**
	 * @ngdoc service
	 * @name basicsBankUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of bank entities
	 */
	angular.module(moduleName).factory('basicsBankUIStandardService',
		['platformUIStandardConfigService', 'basicsBankTranslationService', 'basicsLookupdataConfigGenerator' , 'platformSchemaService',

			function (platformUIStandardConfigService, basicsBankTranslationService, basicsLookupdataConfigGenerator, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						'fid': 'basics.bank.bankdetailform',
						'version': '1.0.0',
						'showGrouping': true,
						'groups': [
							{
								'gid': 'bank',
								'attributes': [ 'bankname','bascountryfk','zipcode','sortcode', 'street', 'city', 'bic', 'leiidentification', 'banksignificancefk' ]
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							bascountryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'basicsCountryLookupDataService',
								enableCache: true}),
							banksignificancefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.banksignificance', 'Description'),
						}
					};
				}
				var bankDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var bankAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'BankDto', moduleSubModule: 'Basics.Bank'});
				bankAttributeDomains = bankAttributeDomains.properties;


				function BankUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				BankUIStandardService.prototype = Object.create(BaseService.prototype);
				BankUIStandardService.prototype.constructor = BankUIStandardService;

				return new BaseService(bankDetailLayout, bankAttributeDomains, basicsBankTranslationService);
			}
		]);
})();
