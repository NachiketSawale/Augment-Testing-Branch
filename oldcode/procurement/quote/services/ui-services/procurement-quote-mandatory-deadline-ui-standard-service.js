(function () {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementQuoteMandatoryDeadlineUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of procurement call off agreement entities
	 */
	angular.module(moduleName).factory('procurementQuoteMandatoryDeadlineUIStandardService',
		['platformUIStandardConfigService', '$injector', 'procurementQuoteTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, procurementQuoteTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						'fid': 'procurement.quote.mandatorydeadlinedetailform',
						'version': '1.0.0',
						'addValidationAutomatically': true,
						'showGrouping': true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['individualperformance','start','end']
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

				var contractMandatoryDeadlineDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var contractMandatoryDeadlineAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcMandatoryDeadlineDto',
					moduleSubModule: 'Procurement.Common'
				});
				contractMandatoryDeadlineAttributeDomains = contractMandatoryDeadlineAttributeDomains.properties;


				function ContractMandatoryDeadlineUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ContractMandatoryDeadlineUIStandardService.prototype = Object.create(BaseService.prototype);
				ContractMandatoryDeadlineUIStandardService.prototype.constructor = ContractMandatoryDeadlineUIStandardService;

				return new BaseService(contractMandatoryDeadlineDetailLayout, contractMandatoryDeadlineAttributeDomains, procurementQuoteTranslationService);
			}
		]);
})();
