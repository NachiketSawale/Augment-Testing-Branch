/**
 * Created by wuj on 2/28/2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.procurementstructure';

	angular.module(moduleName).factory('basicsProcurementStructureUIStandardService',
		['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService',
			'basicsProcurementStructureLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout,
			          platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcStructureDto',
					moduleSubModule: 'Basics.ProcurementStructure'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;


				var service = new UIStandardService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);
})();
