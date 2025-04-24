/**
 * Created by Frank Baedeker on 22.08.2017.
 */
(function (angular) {
	'use strict';

	var resourceEquipmentGroupModule = 'resource.equipmentgroup';
	var resourceEquipmentModule = 'resource.equipment';
	var logisticJobModule = 'logistic.job';
	var module = angular.module(resourceEquipmentGroupModule);

	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var resourceCommonModule = 'resource.common';

	/**
	 * @ngdoc service
	 * @name resourceTypeTranslationService
	 * @description provides translation for resource type module
	 */
	module.service('resourceEquipmentGroupTranslationService', ResourceEquipmentGroupTranslationService);

	ResourceEquipmentGroupTranslationService.$inject = ['platformTranslationUtilitiesService', 'resourceCommonTranslationService'];

	function ResourceEquipmentGroupTranslationService(platformTranslationUtilitiesService, resourceCommonTranslationService) {
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [resourceEquipmentGroupModule, cloudCommonModule, basicsCustomizeModule, resourceCommonModule, resourceEquipmentModule, logisticJobModule]
		};

		data.words = {
			//Entities / container / Title
			EquipmentGroupFk: { location: resourceEquipmentGroupModule, identifier: 'entityResourceEquipmentGroup'},
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive'},
			RubricCategoryFk: { location: cloudCommonModule, identifier: 'entityBasRubricCategoryFk'},
			IsPriced:{ location: resourceEquipmentGroupModule, identifier: 'entityIsPriced'},
			WorkOperationTypeFk:{ location: resourceEquipmentGroupModule, identifier: 'entityWorkOperationTypeFk'},
			Percent: { location: resourceEquipmentGroupModule, identifier: 'entityPercent'},
			PricingGroupFk: { location: basicsCustomizeModule, identifier: 'equipmentpricinggroup'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			PricePortionSum: { location: resourceEquipmentGroupModule, identifier: 'entityPricePortionSum'},
			Lookupcode:{ location: resourceEquipmentGroupModule, identifier: 'entityLookupCode'},
			Reinstallment:{ location: resourceEquipmentGroupModule, identifier: 'entityReinstatement'},
			Reinstallmentyear:{ location: resourceEquipmentGroupModule, identifier: 'entityReinstatementYear'},
			Deviceparameter1:{ location: resourceEquipmentGroupModule, identifier: 'entityDeviceParameter1'},
			Deviceparameter2:{ location: resourceEquipmentGroupModule, identifier: 'entityDeviceParameter2'},
			LedgerContextFk: { location: basicsCustomizeModule, identifier: 'ledgercontext'},
			accounts: { location: resourceEquipmentGroupModule, identifier: 'entityAccounts'},
			AccountTypeFk: { location: basicsCustomizeModule, identifier: 'accountingtype'},
			Account01Fk: { location: resourceEquipmentGroupModule, identifier: 'entityAccount', param: { index: 1 }},
			Account02Fk: { location: resourceEquipmentGroupModule, identifier: 'entityAccount', param: { index: 2 }},
			Account03Fk: { location: resourceEquipmentGroupModule, identifier: 'entityAccount', param: { index: 3 }},
			Account04Fk: { location: resourceEquipmentGroupModule, identifier: 'entityAccount', param: { index: 4 }},
			Account05Fk: { location: resourceEquipmentGroupModule, identifier: 'entityAccount', param: { index: 5 }},
			Account06Fk: { location: resourceEquipmentGroupModule, identifier: 'entityAccount', param: { index: 6 }},
			ProjectContextFk: { location: basicsCustomizeModule, identifier: 'projectcontext'},
			ProjectFk: { location: cloudCommonModule, identifier: 'entityProject'},
			ControllingUnitFk: { location: cloudCommonModule, identifier: 'entityControllingUnit'},
			UomFk: {location: cloudCommonModule, identifier: 'entityUoM'},
			ItemKind:{location: resourceEquipmentModule, identifier: 'entityItemKind'},
			DisplayInPlant:{location: resourceEquipmentModule, identifier: 'entityDisplayInPlant'},
			JobDescription:{location: resourceEquipmentModule, identifier: 'entityJobDescription'},
			JobUserdefined1:{location: resourceEquipmentModule, identifier: 'entityJobUserdefined1'},
			JobValidfrom:{location: resourceEquipmentModule, identifier: 'entityJobValidfrom'},
			JobValidto:{location: resourceEquipmentModule, identifier: 'entityJobValidto'},
			JobTypeDescription:{location: resourceEquipmentModule, identifier: 'entityJobTypeDescription'},
			Projectno:{location: resourceEquipmentModule, identifier: 'entityProjectno'},
			ProjectNo:{location: resourceEquipmentModule, identifier: 'entityProjectno'},
			ItemheaderDate:{location: resourceEquipmentModule, identifier: 'entityItemheaderDate'},
			ItemheaderCode:{location: resourceEquipmentModule, identifier: 'entityItemheaderCode'},
			ItemheaderDescription:{location: resourceEquipmentModule, identifier: 'entityItemheaderDescription'},
			ItemheaderFrom:{location: resourceEquipmentModule, identifier: 'entityItemheaderFrom'},
			ItemheaderTo:{location: resourceEquipmentModule, identifier: 'entityItemheaderTo'},
			Currency:{location: resourceEquipmentModule, identifier: 'entityCurrency'},
			ItemPrcStructureCode:{location: resourceEquipmentModule, identifier: 'entityItemPrcStructureCode'},
			ItemPrcStructureDescription:{location: resourceEquipmentModule, identifier: 'entityItemPrcStructureDescription'},
			ItemDescription1:{location: resourceEquipmentModule, identifier: 'entityItemDescription1'},
			ItemDescription2:{location: resourceEquipmentModule, identifier: 'entityItemDescription2'},
			ItemQuantity:{location: resourceEquipmentModule, identifier: 'entityItemQuantity'},
			ItemQuantityMultiplier:{location: resourceEquipmentModule, identifier: 'entityItemQuantityMultiplier'},
			ItemPriceportion1:{location: resourceEquipmentModule, identifier: 'entityItemPriceportion1'},
			ItemPriceportion2:{location: resourceEquipmentModule, identifier: 'entityItemPriceportion2'},
			ItemPriceportion3:{location: resourceEquipmentModule, identifier: 'entityItemPriceportion3'},
			ItemPriceportion4:{location: resourceEquipmentModule, identifier: 'entityItemPriceportion4'},
			ItemPriceportion5:{location: resourceEquipmentModule, identifier: 'entityItemPriceportion5'},
			ItemPriceportion6:{location: resourceEquipmentModule, identifier: 'entityItemPriceportion6'},
			ItemPriceTotal:{location: resourceEquipmentModule, identifier: 'entityItemPriceTotal'},
			ItemTotalCost:{location: resourceEquipmentModule, identifier: 'entityItemTotalCost'},
			ItemUnitInfo:{location: resourceEquipmentModule, identifier: 'entityItemUnitInfo'},
			SettlementstatusIsStorno:{location: resourceEquipmentModule, identifier: 'entitySettlementstatusIsStorno'},
			ContractStatusIsRejected:{location: resourceEquipmentModule, identifier: 'entityContractStatusIsRejected'},
			InvoiceHeaderStatusIsCanceled:{location: resourceEquipmentModule, identifier: 'entityInvoiceHeaderStatusIsCanceled'},
			jobGroup: {location: resourceEquipmentModule, identifier: 'detailJobGroupTitel'},
			jobTypeGroup: {location: resourceEquipmentModule, identifier: 'detailJobTypeGroupTitel'},
			itemGroup: {location: resourceEquipmentModule, identifier: 'detailItemGroupTitel'},
			itemHeaderGroup: {location: resourceEquipmentModule, identifier: 'detailItemHeaderGroupTitel'},
			PlantFk: {location: resourceEquipmentModule, identifier:'entityPlant'},
			Specification: {location: cloudCommonModule, identifier:'EntitySpec'},
			PlantTypeFk: {location: basicsCustomizeModule, identifier: 'planttype'},
			AllocatedFrom: {location: logisticJobModule, identifier:'allocatedFrom'},
			AllocatedTo: {location: logisticJobModule, identifier:'allocatedTo'},
			ProjectName: {location: cloudCommonModule, identifier: 'entityProjectName'},
			JobCode: {location: resourceEquipmentModule, identifier: 'entityJobCode'},
			CompanyFk: {location: cloudCommonModule, identifier: 'entityCompany'},
			JobGroupFk: {location: basicsCustomizeModule, identifier: 'jobgroup'},
			PlantIsBulk: {location: logisticJobModule, identifier: 'plantIsBulkEntity'},
			CompanyCode: {location: logisticJobModule, identifier: 'plantLocation2CompanyCodeEntity'},
			CompanyName: {location: logisticJobModule, identifier: 'plantLocation2CompanyNameEntity'},
			NominalDimension0101: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0101'},
			NominalDimension0102: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0102'},
			NominalDimension0103: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0103'},
			NominalDimension0201: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0201'},
			NominalDimension0202: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0202'},
			NominalDimension0203: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0203'},
			NominalDimension0301: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0301'},
			NominalDimension0302: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0302'},
			NominalDimension0303: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0303'},
			NominalDimension0401: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0401'},
			NominalDimension0402: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0402'},
			NominalDimension0403: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0403'},
			NominalDimension0501: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0501'},
			NominalDimension0502: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0502'},
			NominalDimension0503: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0503'},
			NominalDimension0601: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0601'},
			NominalDimension0602: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0602'},
			NominalDimension0603: { location: resourceEquipmentGroupModule, identifier: 'entityNominalDimension0603'},
			PlantDescription: {location: resourceCommonModule, identifier: 'plantDescription'},
			PlantStatusFk: {location: resourceCommonModule, identifier: 'plantStatus'},
			CostCodePriceP1Fk:{location: resourceEquipmentGroupModule, identifier: 'entityCostCodePriceP1'},
			CostCodePriceP2Fk:{location: resourceEquipmentGroupModule, identifier: 'entityCostCodePriceP2'},
			CostCodePriceP3Fk:{location: resourceEquipmentGroupModule, identifier: 'entityCostCodePriceP3'},
			CostCodePriceP4Fk:{location: resourceEquipmentGroupModule, identifier: 'entityCostCodePriceP4'},
			CostCodePriceP5Fk:{location: resourceEquipmentGroupModule, identifier: 'entityCostCodePriceP5'},
			CostCodePriceP6Fk:{location: resourceEquipmentGroupModule, identifier: 'entityCostCodePriceP6'},
			EstimatePricelistFk:{location: resourceEquipmentGroupModule, identifier: 'entityEstimatePricelist'},
			TaxCodeFk:{location: resourceEquipmentGroupModule, identifier: 'entityTaxCode'},
			IsExtrapolated: { location: resourceEquipmentGroupModule, identifier: 'entityIsExtrapolated' },
			GroupEurolistFk:{location: resourceEquipmentGroupModule, identifier: 'entityGroupEurolistFk'},
			SpecificValueTypeFk: {location: basicsCustomizeModule, identifier: 'specificvaluetype'},
			UomFromTypeFk: {location: resourceEquipmentGroupModule, identifier: 'uomFromType'},
			IsInherited: {location: resourceEquipmentGroupModule, identifier: 'isInherited'},
			IsManual: {location: basicsCustomizeModule, identifier: 'isManual'},
			Value: {location: basicsCustomizeModule, identifier: 'value'},
			Factor: {location: basicsCustomizeModule, identifier: 'factor'},
			CostCodeFk: {location: basicsCustomizeModule, identifier: 'costCode'},
			PlantGroupCode:{location: resourceEquipmentGroupModule, identifier: 'entityResourceEquipmentGroupCode'},
			PlantGroupDesc:{location: resourceEquipmentGroupModule, identifier: 'entityResourceEquipmentGroupDesc'},
			ResTypeFk:{location: basicsCustomizeModule, identifier: 'resourcetype'},
			PlantAssemblyTypeFk:{location: basicsCustomizeModule, identifier: 'plantassemblytype'},
			MaintSchemaFk: { location: resourceEquipmentModule, identifier: 'maintenanceSchema'},
			SubSchema1: {location: resourceEquipmentGroupModule, identifier: 'entitySubSchema1'},
			SubSchema2: {location: resourceEquipmentGroupModule, identifier: 'entitySubSchema2'},
			SubSchema3: {location: resourceEquipmentGroupModule, identifier: 'entitySubSchema3'},
			SubSchema4: {location: resourceEquipmentGroupModule, identifier: 'entitySubSchema4'},
			SubSchema5: {location: resourceEquipmentGroupModule, identifier: 'entitySubSchema5'},
			PlantComponentTypeFk: { location: resourceEquipmentModule, identifier: 'entityPlantComponentTypeFk'},
			DefaultProcurementStructureFk: { location: resourceEquipmentModule, identifier: 'entityProcurementStructure'},
			DefaultPlantKindFk: {location: basicsCustomizeModule, identifier: 'plantkind'},
			DefaultPlantTypeFk: {location: basicsCustomizeModule, identifier: 'planttype'},
			PictureDate: { location: resourceEquipmentModule, identifier: 'entityPictureData' },
			IsHiddenInPublicApi: { location: resourceEquipmentModule, identifier: 'isHiddenInPublicApi' },
			PlantDocumentTypeFk: { location: basicsCustomizeModule, identifier: 'plantdocumenttype' },
			DocumentTypeFk: { location: basicsCustomizeModule, identifier: 'documenttype' },
			Date: { location: cloudCommonModule, identifier: 'entityDate' },
			Barcode: { location: resourceEquipmentModule, identifier: 'entityBarcode' },
			OriginFileName: { location: cloudCommonModule, identifier: 'documentOriginFileName' },
			Url: { location: resourceEquipmentModule, identifier: 'url', initial: 'Url' },
			FactorDetail: {location: resourceEquipmentGroupModule, identifier: 'factorDetail'},
			QuantityDetail: {location: resourceEquipmentGroupModule, identifier: 'quantityDetail'},
			Quantity: { location: cloudCommonModule, identifier: 'entityQuantity' }
		};

		function provideEquipmentGroupContainerTitle(words) {
			words.entityResourceEquipmentGroup = { location: resourceEquipmentGroupModule, identifier: 'entityResourceEquipmentGroup', initial: 'Plant Group'};
			words.equipmentGroupListTitle = { location: resourceEquipmentGroupModule, identifier: 'equipmentGroupListTitle', initial: 'Plant Groups'};
			words.equipmentGroupDetailTitle = { location: resourceEquipmentGroupModule, identifier: 'equipmentGroupDetailTitle', initial: 'Plant Group Details'};
		}

		//Get some predefined packages of words used in project
		provideEquipmentGroupContainerTitle(data.words);
		resourceCommonTranslationService.providePricePortionWords(data.words, 6, null, '0');
		resourceCommonTranslationService.providePlantCatalogWords(data.words);
		resourceCommonTranslationService.providePlantPriceListWords(data.words);
		resourceCommonTranslationService.provideEquipmentWords(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(this, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		this.provideProjectStockContainerTitle = provideEquipmentGroupContainerTitle;
	}
})(angular);
