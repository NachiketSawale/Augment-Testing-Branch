/**
 * Created by guh on 5/17/2017.
 */
(function () {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
     * @ngdoc service
     * @name procurementPesShipmentInfoUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers
     */
	angular.module(moduleName).factory('procurementPesShipmentInfoUIStandardService',
		['platformUIStandardConfigService', 'procurementPesShipmentInfoLayout', 'procurementPesTranslationService', 'platformSchemaService',
			function (platformUIStandardConfigService, procurementPesShipmentInfoLayout, procurementPesTranslationService, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;
				var unitClerkAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'PesShipmentinfoDto', moduleSubModule: 'Procurement.Pes' });

				unitClerkAttributeDomains = unitClerkAttributeDomains.properties;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;

				return new StructureUIStandardService(procurementPesShipmentInfoLayout, unitClerkAttributeDomains, procurementPesTranslationService);
			}
		]);

})(angular);
