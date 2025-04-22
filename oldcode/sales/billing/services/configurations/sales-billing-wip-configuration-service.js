/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingWipConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'salesCommonLookupConfigsService', 'salesBillingTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'salesWipConfigurationService',
		function (_, $injector, platformUIStandardConfigService, salesCommonLookupConfigsService, salesBillingTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, salesWipConfigurationService) {

			// get a copy from the original service
			var wipDetailLayout = salesWipConfigurationService.getLayoutDetailConfiguration();

			salesCommonLookupConfigsService.addCommonLookupsToLayout(wipDetailLayout);

			// make all other attributes readonly
			var overloads = wipDetailLayout.overloads;
			_.each(_.flatten(_.map(wipDetailLayout.groups, 'attributes')), function(attribute) {
				if (angular.isUndefined(overloads[attribute])) {
					overloads[attribute] = angular.extend(overloads[attribute] || {}, {readonly: true});
				}
			});

			var BaseService = platformUIStandardConfigService;

			var salesBillingHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'WipHeaderDto',
				moduleSubModule: 'Sales.Wip'
			});

			if (salesBillingHeaderDomainSchema) {
				salesBillingHeaderDomainSchema = salesBillingHeaderDomainSchema.properties;
			}

			function SalesBillingWipUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesBillingWipUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBillingWipUIStandardService.prototype.constructor = SalesBillingWipUIStandardService;
			return new BaseService(wipDetailLayout, salesBillingHeaderDomainSchema, salesBillingTranslationService);
		}
	]);
})();
