/**
 * Created by lvy on 7/11/2019.
 */
(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).factory('procurementContractAdvanceUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'procurementContractTranslationService', 'procurementContractAdvanceDetailLayout', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, platformSchemaService, translationService, layout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ConAdvanceDto',
					moduleSubModule: 'Procurement.Contract'
				});
				domainSchema = domainSchema.properties;

				function conAdvanceUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);// jshint ignore:line
				}

				conAdvanceUIStandardService.prototype = Object.create(BaseService.prototype);
				conAdvanceUIStandardService.prototype.constructor = conAdvanceUIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);

})();