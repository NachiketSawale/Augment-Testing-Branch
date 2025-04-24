(function () {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantDocumentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant fixed asset entities
	 */
	angular.module(moduleName).factory('resourceEquipmentGroupDocumentUIStandardService',
		['platformUIStandardConfigService', '$injector', 'resourceEquipmentGroupTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, $injector, resourceEquipmentGroupTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'resource.equipmentgroup.document',
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

				const resourceEquipmentGroupDocumentDetailLayout = createMainDetailLayout();

				const BaseService = platformUIStandardConfigService;

				let resourceEquipmentGroupDocumentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantGroupDocumentDto',
					moduleSubModule: 'Resource.EquipmentGroup'
				});
				resourceEquipmentGroupDocumentAttributeDomains = resourceEquipmentGroupDocumentAttributeDomains.properties;


				function ResourceEquipmentGroupDocumentUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentGroupDocumentUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentGroupDocumentUIStandardService.prototype.constructor = ResourceEquipmentGroupDocumentUIStandardService;

				return new BaseService(resourceEquipmentGroupDocumentDetailLayout, resourceEquipmentGroupDocumentAttributeDomains, resourceEquipmentGroupTranslationService);
			}
		]);
})();
