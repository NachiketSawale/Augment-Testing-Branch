(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantDocumentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant fixed asset entities
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantDocumentUIStandardService',
		['platformUIStandardConfigService', '$injector', 'resourceEquipmentTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, resourceEquipmentTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'object.main.resourceequipmentplantdocumentdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: [ 'description', 'plantdocumenttypefk', 'documenttypefk', 'date', 'barcode', 'originfilename','url', 'ishiddeninpublicapi']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype'),
							plantdocumenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantdocumenttype'),
							originfilename: { readonly: true },
							url: {
								maxLength: 2000, grid: {
									editor: 'url',
									formatter: 'url'
								}
							}
						}
					};
				}

				var resourceEquipmentPlantDocumentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentPlantDocumentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantDocumentDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentPlantDocumentAttributeDomains = resourceEquipmentPlantDocumentAttributeDomains.properties;


				function ResourceEquipmentPlantDocumentUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentPlantDocumentUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentPlantDocumentUIStandardService.prototype.constructor = ResourceEquipmentPlantDocumentUIStandardService;

				return new BaseService(resourceEquipmentPlantDocumentDetailLayout, resourceEquipmentPlantDocumentAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
