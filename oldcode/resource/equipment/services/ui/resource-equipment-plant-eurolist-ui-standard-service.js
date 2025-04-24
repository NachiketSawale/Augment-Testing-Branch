(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantEurolistUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant eurolist entities
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantEurolistUIStandardService',
		[
			'platformUIStandardConfigService', '$injector', 'resourceEquipmentTranslationService',
			'platformSchemaService', 'basicsLookupdataConfigGenerator', 'resourceCommonLayoutHelperService',
			function (
				platformUIStandardConfigService, $injector, resourceEquipmentTranslationService,
				platformSchemaService, basicsLookupdataConfigGenerator, resourceCommonLayoutHelperService) {

				function createMainDetailLayout() {
					return {
						fid: 'object.main.resourceequipmentplanteurolistdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'basicData',
								'attributes': [
									'catalogfk', 'lookupcode', 'catalogrecordfk', 'quantity',
									'uomfk', 'reinstallment','reinstallmentyear','deviceparameter1',
									'deviceparameter2', 'istire', 'ismanual', 'code', 'planteurolistfk'
								]
							},
							{

								'gid': 'OutputGeneralDev',
								'attributes': [
									'depreciationpercentfrom', 'depreciationpercentto',
									'repairpercent'
								]
							},
							{
								'gid': 'OutputUpperDev',
								'attributes': [
									'catalogrecordupperfk','depreciationupperfrom',
									'depreciationupperto', 'repairupper', 'reinstallmentupper', 'priceindexupper'
								]
							},
							{
								'gid': 'OutputLowerDev',
								'attributes': [
									'catalogrecordlowerfk', 'depreciationlowerfrom',
									'depreciationlowerto', 'repairlower', 'reinstallmentlower', 'priceindexlower'
								]
							},
							{
								'gid': 'OutputCalcDev',
								'attributes': [
									'description', 'depreciation', 'repaircalculated',
									'reinstallmentcalculated', 'priceindexcalc', 'isinterpolated', 'isextrapolated']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							uomfk:{
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-lookupdata-uom-lookup'
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'Uom',
										'displayMember': 'Unit'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-uom-lookup'
								}
							},
							catalogfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceCatalogLookupDataService'
							}),
							catalogrecordfk: resourceCommonLayoutHelperService.providePlantCatalogRecordOverload(),
							catalogrecordlowerfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceCatalogDetailLookupDataService',
								filter: function (item) {
									return item;
								}
							}),
							catalogrecordupperfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceCatalogDetailLookupDataService',
								filter: function (item) {
									return item;
								}
							}),
							planteurolistfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'resourceEquipmentEurolistLookupDataService',
								filter: function (item) {
									return {PKey1: item.PlantFk};
								},
								filterKey: 'resource-equipment-self-eurolist-filter',
								valMember: 'Id',
								dispMember: 'Code'
							})
						}
					};
				}

				var resourceEquipmentPlantEurolistDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentPlantEurolistAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantEurolistDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentPlantEurolistAttributeDomains = resourceEquipmentPlantEurolistAttributeDomains.properties;


				function ResourceEquipmentPlantEurolistUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentPlantEurolistUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentPlantEurolistUIStandardService.prototype.constructor = ResourceEquipmentPlantEurolistUIStandardService;

				return new BaseService(resourceEquipmentPlantEurolistDetailLayout, resourceEquipmentPlantEurolistAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
