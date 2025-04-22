/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc service
	 * @name salesWipDocumentConfigurationService
	 * @function
	 *
	 * @description
	 * provides layout configuration for wip document container
	 */
	angular.module(moduleName).factory('salesWipDocumentConfigurationService',
		['_', 'platformUIStandardConfigService', 'salesCommonDocumentServiceProvider', 'salesWipTranslationService', 'platformSchemaService',

			function (_, platformUIStandardConfigService, salesCommonDocumentServiceProvider, salesWipTranslationService, platformSchemaService) {

				var layout = salesCommonDocumentServiceProvider.createDocumentDetailLayout('sales.wip.documentdetail', '1.0.0');
				// in wip documents we have an additional column 'export' (see also #106353)
				var basicDataGroup = _.first(_.get(layout, 'groups'), {gid: 'basicData'});
				basicDataGroup.attributes.push('isexport');

				var documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'DocumentDto',
					moduleSubModule: 'Sales.Wip'
				});
				documentAttributeDomains = documentAttributeDomains.properties;

				function UIStandardService(layout, scheme, translateService) {
					platformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new platformUIStandardConfigService(layout, documentAttributeDomains, salesWipTranslationService);
			}
		]);
})();
