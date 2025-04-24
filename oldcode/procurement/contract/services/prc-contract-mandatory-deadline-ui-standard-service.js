(function () {
	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementContractMandatoryDeadlineUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of procurement call off agreement entities
	 */
	angular.module(moduleName).factory('procurementContractMandatoryDeadlineUIStandardService',
		['platformUIStandardConfigService', '$injector', 'procurementContractTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, $injector, procurementContractTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {

						'fid': 'procurement.contract.mandatorydeadlinedetailform',
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

				var quoteMandatoryDeadlineDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var quoteMandatoryDeadlineAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcMandatoryDeadlineDto',
					moduleSubModule: 'Procurement.Common'
				});
				quoteMandatoryDeadlineAttributeDomains = quoteMandatoryDeadlineAttributeDomains.properties;


				function QuoteMandatoryDeadlineUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				QuoteMandatoryDeadlineUIStandardService.prototype = Object.create(BaseService.prototype);
				QuoteMandatoryDeadlineUIStandardService.prototype.constructor = QuoteMandatoryDeadlineUIStandardService;

				return new BaseService(quoteMandatoryDeadlineDetailLayout, quoteMandatoryDeadlineAttributeDomains, procurementContractTranslationService);
			}
		]);
})();
