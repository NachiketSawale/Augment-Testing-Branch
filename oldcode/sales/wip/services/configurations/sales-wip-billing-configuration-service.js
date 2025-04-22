/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipBillingConfigurationService', ['_', '$injector', 'platformUIStandardConfigService', 'salesCommonLookupConfigsService', 'salesWipTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator', 'salesBillingConfigurationService',
		function (_, $injector, platformUIStandardConfigService, salesCommonLookupConfigsService, salesWipTranslationService, platformSchemaService, basicsLookupdataConfigGenerator, salesBillingConfigurationService) {

			// get a copy from the original service
			var billingDetailLayout = salesBillingConfigurationService.getLayoutDetailConfiguration();

			salesCommonLookupConfigsService.addCommonLookupsToLayout(billingDetailLayout);

			// make all other attributes readonly
			var overloads = billingDetailLayout.overloads;
			_.each(_.flatten(_.map(billingDetailLayout.groups, 'attributes')), function(attribute) {
				if (angular.isUndefined(overloads[attribute])) {
					overloads[attribute] = angular.extend(overloads[attribute] || {}, {readonly: true});
				}
			});

			var BaseService = platformUIStandardConfigService;

			var salesBillingHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'BilHeaderDto',
				moduleSubModule: 'Sales.Billing'
			});

			if (salesBillingHeaderDomainSchema) {
				salesBillingHeaderDomainSchema = salesBillingHeaderDomainSchema.properties;
			}

			function SalesWipBillingUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesWipBillingUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesWipBillingUIStandardService.prototype.constructor = SalesWipBillingUIStandardService;
			return new BaseService(billingDetailLayout, salesBillingHeaderDomainSchema, salesWipTranslationService);
		}
	]);
})();
