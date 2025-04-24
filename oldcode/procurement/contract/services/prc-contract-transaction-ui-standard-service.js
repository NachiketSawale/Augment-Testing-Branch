/**
 * Created by Ivy on 06.22.2020.
 */

// eslint-disable-next-line func-names
(function () {
	'use strict';
	var modName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module(modName).factory('procurementContractTransactionUIStandardService', [
		'platformUIStandardConfigService',
		'procurementContractTranslationService',
		'procurementContractTransactionLayout',
		'platformSchemaService',
		'platformUIStandardExtentService',
		function (
			platformUIStandardConfigService,
			translationService,
			layout,
			platformSchemaService,
			platformUIStandardExtentService
		) {

			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ConTransactionDto',
				moduleSubModule: 'Procurement.Contract'
			});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}

			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			var service = new BaseService(layout, domainSchema, translationService);

			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

			return service;
		}
	]);
})();
