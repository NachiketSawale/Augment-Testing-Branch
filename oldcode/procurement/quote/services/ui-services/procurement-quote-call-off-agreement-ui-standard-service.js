(function () {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementQuoteCallOffAgreementUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of procurement call off agreement entities
	 */
	angular.module(moduleName).factory('procurementQuoteCallOffAgreementUIStandardService',
		['platformUIStandardConfigService', '$injector', 'procurementQuoteTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, procurementQuoteTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						'fid': 'procurement.quote.calloffagreementdetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['calloffagreement','leadtime','earlieststart','lateststart','executionduration','contractpenalty']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {

						}
					};
				}

				var contractCallOffAgreementDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var contractCallOffAgreementAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcCallOffAgreementDto',
					moduleSubModule: 'Procurement.Common'
				});
				contractCallOffAgreementAttributeDomains = contractCallOffAgreementAttributeDomains.properties;


				function ContractCallOffAgreementUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ContractCallOffAgreementUIStandardService.prototype = Object.create(BaseService.prototype);
				ContractCallOffAgreementUIStandardService.prototype.constructor = ContractCallOffAgreementUIStandardService;

				return new BaseService(contractCallOffAgreementDetailLayout, contractCallOffAgreementAttributeDomains, procurementQuoteTranslationService);
			}
		]);
})();
