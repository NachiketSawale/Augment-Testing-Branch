(function () {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementContractCallOffAgreementUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of procurement call off agreement entities
	 */
	angular.module(moduleName).factory('procurementContractCallOffAgreementUIStandardService',
		['platformUIStandardConfigService', '$injector', 'procurementContractTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, procurementContractTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						'fid': 'procurement.contract.calloffagreementdetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['calloffagreement', 'leadtime', 'earlieststart', 'lateststart', 'executionduration', 'contractpenalty']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {}
					};
				}

				var quoteCallOffAgreementDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var quoteCallOffAgreementAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcCallOffAgreementDto',
					moduleSubModule: 'Procurement.Common'
				});
				quoteCallOffAgreementAttributeDomains = quoteCallOffAgreementAttributeDomains.properties;

				function QuoteCallOffAgreementUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				QuoteCallOffAgreementUIStandardService.prototype = Object.create(BaseService.prototype);
				QuoteCallOffAgreementUIStandardService.prototype.constructor = QuoteCallOffAgreementUIStandardService;

				return new BaseService(quoteCallOffAgreementDetailLayout, quoteCallOffAgreementAttributeDomains, procurementContractTranslationService);
			}
		]);
})();
