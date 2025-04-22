(function () {
	'use strict';

	var moduleName = 'sales.contract';

	angular.module(moduleName).factory('salesContractAdvanceUIStandardService', [
		'platformUIStandardConfigService',
		'platformSchemaService',
		'salesContractTranslationService',
		'salesContractAdvanceDetailLayout',
		'platformUIStandardExtentService',
		function (
			platformUIStandardConfigService,
			platformSchemaService,
			translationService,
			layout,
			platformUIStandardExtentService
		) {
			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'OrdAdvanceDto',
				moduleSubModule: 'Sales.Contract'
			});
			domainSchema = domainSchema.properties;

			function ordAdvanceUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);// jshint ignore:line
			}

			ordAdvanceUIStandardService.prototype = Object.create(BaseService.prototype);
			ordAdvanceUIStandardService.prototype.constructor = ordAdvanceUIStandardService;

			var service = new BaseService(layout, domainSchema, translationService);
			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
			return service;
		}
	]);
})();