(function () {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonHeaderUIStandardService
	 * @function
	 *
	 * @description
	 * # ui standard service for entity RfqHeader.
	 */
	angular.module(moduleName).factory('procurementPriceComparisonHeaderUIStandardService', [
		'platformUIStandardConfigService', 'platformSchemaService', 'platformUIStandardExtentService',
		'procurementRfqTranslationService', 'procurementRfqHeaderDetailLayout',
		function (platformUIStandardConfigService, platformSchemaService, platformUIStandardExtentService,
			procurementRfqTranslationService, procurementRfqHeaderDetailLayout) {

			// extend layout 'Code/ Base Code' navigation, others is the same as rfq header layout
			var layout = angular.copy(procurementRfqHeaderDetailLayout);
			var navigator = {
				moduleName: 'procurement.rfq',
				registerService: 'procurementRfqMainService'
			};
			layout.overloads.code.navigator = navigator;
			layout.overloads.rfqheaderfk.navigator = navigator;

			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'RfqHeaderDto',
				moduleSubModule: 'Procurement.RfQ'
			});
			domainSchema = domainSchema.properties;

			function RfqUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			RfqUIStandardService.prototype = Object.create(BaseService.prototype);
			RfqUIStandardService.prototype.constructor = RfqUIStandardService;

			var service = new BaseService(layout, domainSchema, procurementRfqTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

			return service;
		}
	]);
})();
