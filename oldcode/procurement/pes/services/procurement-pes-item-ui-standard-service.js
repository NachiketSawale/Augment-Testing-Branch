(function () {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementPesItemUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('procurementPesItemUIStandardService',
		['platformUIStandardConfigService', 'procurementPesItemDetailLayout', 'procurementPesTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',
			function (platformUIStandardConfigService, procurementPesItemDetailLayout, procurementPesTranslationService, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				var unitClerkAttributeDomains = platformSchemaService.getSchemaFromCache({typeName: 'PesItemDto', moduleSubModule: 'Procurement.Pes'});

				unitClerkAttributeDomains = unitClerkAttributeDomains.properties;

				var service = new StructureUIStandardService(procurementPesItemDetailLayout, unitClerkAttributeDomains, procurementPesTranslationService);
				platformUIStandardExtentService.extend(service, procurementPesItemDetailLayout.addition, unitClerkAttributeDomains);
				return service;
			}
		]);

})(angular);
