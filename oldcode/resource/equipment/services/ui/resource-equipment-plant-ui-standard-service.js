(function () {
	'use strict';
	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantUIStandardServiceForStructure
	 * @function
	 *
	 * @description
	 * This service is currently only used for structure container. the original one is in container-information-service.js => one day the config and logic from
	 * information-service should be moved here!
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantUIStandardService',
		['$injector', 'platformUIStandardConfigService', 'platformLayoutHelperService', 'resourceEquipmentTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function ($injector, platformUIStandardConfigService, platformLayoutHelperService, resourceEquipmentTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {
				function createMainDetailLayout() {
					return {
						fid: 'resource.equipment.plant.detailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'baseGroup',
								attributes: ['code', 'descriptioninfo', 'longdescriptioninfo', 'specification', 'alternativecode', 'matchcode', 'commenttext', 'validfrom', 'validto',
									'islive', 'regnumber', 'companyfk', 'plantstatusfk', 'serialnumber','basuomtranspsizefk','basuomtranspweightfk','transportlength','transportwidth',
									'transportheight','transportweight','trafficlightfk', 'haspooljob', 'equipmentdivisionfk', 'plantgroupfk', 'planttypefk', 'plantkindfk', 'procurementstructurefk', 'uomfk', 'rubriccategoryfk',
									'clerkownerfk', 'clerkresponsiblefk', 'purchasedate', 'purchaseprice', 'replacementdate', 'replacementprice', 'commissioningdate', 'planneddecommissioningdate', 'decommissioningdate', 'licenseplate', 'externalcode', 'clerktechnicalfk'
								]
							}
						],
						overloads: {
							planttypefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomizePantTypeLookupDataService',
								readonly: true
							}),
							plantkindfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantkind'),
							uomfk:  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(platformLayoutHelperService.provideUoMLookupSpecification()),
							clerktechnicalfk: platformLayoutHelperService.provideClerkLookupOverload()
						}
					};
				}

				var resDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EquipmentPlantDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resAttributeDomains = resAttributeDomains.properties;


				function UnitUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UnitUIStandardService.prototype = Object.create(BaseService.prototype);
				UnitUIStandardService.prototype.constructor = UnitUIStandardService;


				var baseService = new BaseService(resDetailLayout, resAttributeDomains, resourceEquipmentTranslationService);
				baseService.getCreateMainLayout = function getCreateMainLayout() {
					return createMainDetailLayout();
				};
				return baseService;
			}
		]);
})();
