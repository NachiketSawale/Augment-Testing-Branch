(function () {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	/**
	 * @ngdoc service
	 * @name procurementPesHeaderUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers
	 */
	angular.module(moduleName).factory('procurementPesHeaderUIStandardService',
		['$injector', 'platformUIStandardConfigService', 'procurementPesHeaderDetailLayout', 'procurementPesTranslationService', 'platformSchemaService', 'platformUIStandardExtentService',
			function ($injector, platformUIStandardConfigService, procurementPesHeaderDetailLayout, procurementPesTranslationService, platformSchemaService,platformUIStandardExtentService) {


				var basicsClerkFormatService = $injector.get('basicsClerkFormatService');
				procurementPesHeaderDetailLayout.overloads.clerkreqfk.grid.formatter = basicsClerkFormatService.formatClerk;
				procurementPesHeaderDetailLayout.overloads.clerkprcfk.grid.formatter = basicsClerkFormatService.formatClerk;

				var BaseService = platformUIStandardConfigService;

				var unitClerkAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PesHeaderDto',
					moduleSubModule: 'Procurement.Pes'
				});

				unitClerkAttributeDomains = unitClerkAttributeDomains.properties;

				function StructureUIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				StructureUIStandardService.prototype = Object.create(BaseService.prototype);
				StructureUIStandardService.prototype.constructor = StructureUIStandardService;
				const entityInformation = { module: angular.module( 'procurement.pes'), moduleName: 'Procurement.Pes', entity: 'PesHeader' };
				var service = new BaseService(procurementPesHeaderDetailLayout, unitClerkAttributeDomains, procurementPesTranslationService, entityInformation);
				//var service = new StructureUIStandardService(procurementPesHeaderDetailLayout, unitClerkAttributeDomains, procurementPesTranslationService);
				platformUIStandardExtentService.extend(service, procurementPesHeaderDetailLayout.addition, unitClerkAttributeDomains);

				function removeDescriptionColumns() {
					var configForDetailView = service.getStandardConfigForDetailView(),
						displayCols = ['clerkprcdescription', 'clerkreqdescription', 'supplierbpname', 'projectname', 'conheaderdescription', 'packagedescription', 'controllingunitdescription'];
					for (var index = 0; index < configForDetailView.rows.length; index++) {
						if (displayCols.indexOf(configForDetailView.rows[index].rid) > -1) {
							configForDetailView.rows.splice(index, 1);
							index--;
						}
					}
				}

				removeDescriptionColumns();

				return service;
			}
		]);

})(angular);
