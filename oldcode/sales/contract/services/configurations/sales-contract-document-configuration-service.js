/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.contract';

	/**
	 * @ngdoc service
	 * @name salesContractDocumentConfigurationService
	 * @function
	 *
	 * @description
	 * provides layout configuration for contract document container
	 */
	angular.module(moduleName).factory('salesContractDocumentConfigurationService',
		['platformUIStandardConfigService', 'salesCommonDocumentServiceProvider', 'salesContractTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, salesCommonDocumentServiceProvider, salesContractTranslationService, platformSchemaService) {

				var layout = salesCommonDocumentServiceProvider.createDocumentDetailLayout('sales.contract.documentdetail', '1.0.0');
				var documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentDto',
					moduleSubModule: 'Sales.Contract'
				});
				documentAttributeDomains = documentAttributeDomains.properties;

				function UIStandardService(layout, scheme, translateService) {
					platformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new platformUIStandardConfigService(layout, documentAttributeDomains, salesContractTranslationService);
			}
		]);
})();
