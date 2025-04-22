/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc service
	 * @name salesBillingDocumentConfigurationService
	 * @function
	 *
	 * @description
	 * provides layout configuration for billing document container
	 */
	angular.module(moduleName).factory('salesBillingDocumentConfigurationService',
		['platformUIStandardConfigService', 'salesCommonDocumentServiceProvider', 'salesBillingTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, salesCommonDocumentServiceProvider, salesBillingTranslationService, platformSchemaService) {

				var layout = salesCommonDocumentServiceProvider.createDocumentDetailLayout('sales.billing.documentdetail', '1.0.0');
				var documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentDto',
					moduleSubModule: 'Sales.Billing'
				});
				documentAttributeDomains = documentAttributeDomains.properties;

				function UIStandardService(layout, scheme, translateService) {
					platformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new platformUIStandardConfigService(layout, documentAttributeDomains, salesBillingTranslationService);
			}
		]);
})();
