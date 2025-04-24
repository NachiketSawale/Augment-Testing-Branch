/**
 * Created by zos on 8/31/2015.
 */
(function (angular) {
	'use strict';

	var modName = 'procurement.package';

	angular.module(modName).factory('procurementPackageEstHeaderUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageTranslationService', 'procurementPackageUIConfigurationService', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, procurementPackageUIConfigurationService, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'EstHeaderDto',
					moduleSubModule: 'Estimate.Main'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(procurementPackageUIConfigurationService.getPackageEstHeaderLayout(), domainSchema, translationService);
			}
		]);
})(angular);