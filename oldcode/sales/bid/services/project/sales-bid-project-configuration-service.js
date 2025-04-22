/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.bid';

	angular.module(moduleName).factory('salesBidProjectConfigurationService', ['platformUIStandardConfigService', 'salesBidTranslationService', 'platformSchemaService', 'salesBidConfigurationService',
		function (platformUIStandardConfigService, salesBidTranslationService, platformSchemaService, salesBidConfigurationService) {

			var bidsForProjectDetailLayout = salesBidConfigurationService.getDetailLayout();

			// TODO: filter attributes for project

			var BaseService = platformUIStandardConfigService;

			var salesBidHeaderDomainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'BidHeaderDto',
				moduleSubModule: 'Sales.Bid'
			});

			if (salesBidHeaderDomainSchema) {
				salesBidHeaderDomainSchema = salesBidHeaderDomainSchema.properties;
			}

			function SalesBidProjectUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			SalesBidProjectUIStandardService.prototype = Object.create(BaseService.prototype);
			SalesBidProjectUIStandardService.prototype.constructor = SalesBidProjectUIStandardService;
			return new BaseService(bidsForProjectDetailLayout, salesBidHeaderDomainSchema, salesBidTranslationService);
		}
	]);
})();
