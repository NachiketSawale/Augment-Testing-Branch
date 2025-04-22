/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.bid';

	/**
	 * @ngdoc service
	 * @name salesBidDocumentConfigurationService
	 * @function
	 *
	 * @description
	 * provides layout configuration for bid document container
	 */
	angular.module(moduleName).factory('salesBidDocumentConfigurationService',
		['platformUIStandardConfigService', 'salesCommonDocumentServiceProvider', 'salesBidTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, salesCommonDocumentServiceProvider, salesBidTranslationService, platformSchemaService) {

				var layout = salesCommonDocumentServiceProvider.createDocumentDetailLayout('sales.bid.documentdetail', '1.0.0');
				var documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentDto',
					moduleSubModule: 'Sales.Bid'
				});
				documentAttributeDomains = documentAttributeDomains.properties;

				function UIStandardService(layout, scheme, translateService) {
					platformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new platformUIStandardConfigService(layout, documentAttributeDomains, salesBidTranslationService);
			}
		]);
})();
