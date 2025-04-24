/**
 * Created by yew on 12/10/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var modName = 'procurement.contract',
		mod = angular.module(modName);

	mod.factory('procurementContractChangeUIStandardService',
		['platformUIStandardConfigService', 'procurementContractTranslationService',
			'procurementContractHeaderLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ConHeaderDto',
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
})(angular);