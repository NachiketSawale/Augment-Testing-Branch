/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.billing';

	// TODO: remarks => we reuse the accrual detail layout (salesWipAccrualDetailLayout) and translation from wip module
	angular.module(moduleName).factory('salesBillingAccrualConfigurationService',
		['platformUIStandardConfigService', 'salesWipTranslationService', 'platformSchemaService', 'salesWipAccrualDetailLayout', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, salesWipTranslationService, platformSchemaService, salesWipAccrualDetailLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;
				var domains = platformSchemaService.getSchemaFromCache({
					typeName: 'AccrualDto',
					moduleSubModule: 'Sales.Billing'
				}).properties;
				var service = new BaseService(salesWipAccrualDetailLayout, domains, salesWipTranslationService);
				platformUIStandardExtentService.extend(service, salesWipAccrualDetailLayout.addition, domains);

				return service;
			}
		]);
})();
