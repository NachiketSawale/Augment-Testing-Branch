(function (angular) {
	'use strict';

	var moduleName = 'sales.wip';

	angular.module(moduleName).factory('salesWipValidationUIStandardService',
		['platformUIStandardConfigService', 'procurementInvoiceTranslationService',
			'salesWipValidationConfigurationService', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'WipValidationDto',
					moduleSubModule: 'Sales.Wip'
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
