/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipContractConfigurationService',
		['_', '$injector', 'platformUIStandardConfigService', 'salesCommonLookupConfigsService', 'salesWipTranslationService', 'platformSchemaService', 'salesContractConfigurationService',
			function (_, $injector, platformUIStandardConfigService, salesCommonLookupConfigsService, salesWipTranslationService, platformSchemaService, salesContractConfigurationService) {

				// get a copy from the original service
				var contractDetailLayout = salesContractConfigurationService.getLayoutDetailConfiguration();

				salesCommonLookupConfigsService.addCommonLookupsToLayout(contractDetailLayout);

				// make all other attributes readonly
				var overloads = contractDetailLayout.overloads;
				_.each(_.flatten(_.map(contractDetailLayout.groups, 'attributes')), function (attribute) {
					if (angular.isUndefined(overloads[attribute])) {
						overloads[attribute] = angular.extend(overloads[attribute] || {}, {readonly: true});
					}
				});

				var BaseService = platformUIStandardConfigService;

				var salesContractHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'OrdHeaderDto',
					moduleSubModule: 'Sales.Contract'
				});

				if (salesContractHeaderDomainSchema) {
					salesContractHeaderDomainSchema = salesContractHeaderDomainSchema.properties;
				}

				function SalesWipContractUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				SalesWipContractUIStandardService.prototype = Object.create(BaseService.prototype);
				SalesWipContractUIStandardService.prototype.constructor = SalesWipContractUIStandardService;
				return new BaseService(contractDetailLayout, salesContractHeaderDomainSchema, salesWipTranslationService);
			}
		]);
})();
