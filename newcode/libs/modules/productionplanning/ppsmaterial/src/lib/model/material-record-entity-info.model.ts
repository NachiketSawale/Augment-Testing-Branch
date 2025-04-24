/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { PpsMaterialRecordBehavior } from '../behaviors/material-record-behavior.service';
import { PpsMaterialRecordDataService } from '../services/material/material-record-data.service';
import { PpsMaterialRecordLayoutService } from '../services/material/material-record-layout.service';
import { PpsMaterialRecordValidationService } from '../services/material/material-record-validation.service';
import { IMaterialNewEntity } from './models';
// import { MATERIAL_NEW_ENTITY_SCHEMA } from './material-new-entity-schema';
import { EntityDomainType } from '@libs/platform/data-access';

export const PPS_MATERIAL_RECORD_ENTITY_INFO = EntityInfo.create<IMaterialNewEntity>({
	grid: {
		title: { text: '*Material Records', key: 'productionplanning.ppsmaterial.record.listViewTitle' },
		behavior: (ctx) => ctx.injector.get(PpsMaterialRecordBehavior),
	},
	form: {
		containerUuid: 'ef4562bf23b54fcba3f84643bd64212c',
		title: { text: '*Material Record Detail', key: 'productionplanning.ppsmaterial.record.detailViewTitle' },
	},
	dataService: (ctx) => ctx.injector.get(PpsMaterialRecordDataService),
	permissionUuid: '1ed6d6955a20488e83c10c1c76326275',
	validationService: (context) => context.injector.get(PpsMaterialRecordValidationService),
	dtoSchemeId: { moduleSubModule: 'ProductionPlanning.PpsMaterial', typeName: 'MaterialNewDto' },
	entitySchema: {
		schema: 'IMaterialNewEntity',
		properties: {
			AgreementFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			BasBlobsFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			BasBlobsSpecificationFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			BasCo2SourceFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			BasCurrencyFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			BasRubricCategoryFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			BasUomPriceUnitFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			BasUomWeightFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Charges: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			Co2Project: {
				domain: EntityDomainType.Quantity,
				mandatory: false,
			},
			Co2Source: {
				domain: EntityDomainType.Quantity,
				mandatory: false,
			},
			Code: {
				domain: EntityDomainType.Code,
				mandatory: true,
			},
			Cost: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			CostPriceGross: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			DangerClassFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			DayworkRate: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			DescriptionInfo1: {
				domain: EntityDomainType.Translation,
				mandatory: false,
			},
			DescriptionInfo2: {
				domain: EntityDomainType.Translation,
				mandatory: false,
			},
			Discount: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			EanGtin: {
				domain: EntityDomainType.Code,
				mandatory: false,
			},
			EstCostTypeFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			EstimatePrice: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			ExternalCode: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			FactorHour: {
				domain: EntityDomainType.Factor,
				mandatory: true,
			},
			FactorPriceUnit: {
				domain: EntityDomainType.Factor,
				mandatory: false,
			},
			// Id
			IsLabour: {
				domain: EntityDomainType.Boolean,
				mandatory: false,
			},
			IsLive: {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			IsProduct: {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			LeadTime: {
				domain: EntityDomainType.Quantity,
				mandatory: true,
			},
			LeadTimeExtra: {
				domain: EntityDomainType.Quantity,
				mandatory: true,
			},
			ListPrice: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			MatchCode: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			MaterialCatalogFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			MaterialDiscountGroupFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			MaterialGroupFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			MaterialStatusFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			MaterialTempFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			MaterialTempTypeFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			MaterialTypeFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			MdcBrandFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			// MdcMaterial2basUomEntities
			// MdcMaterial2certificateEntities
			MdcMaterialFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			// MdcMaterialReferenceEntities
			MdcMaterialStockFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			MdcMaterialabcFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			MdcTaxCodeFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			MinQuantity: {
				domain: EntityDomainType.Quantity,
				mandatory: true,
			},
			ModelName: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			NeutralMaterialCatalogFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			// ObsoleteUuid
			PackageTypeFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			PrcPriceConditionFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			PrcPriceconditionFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			PriceExtra: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			PriceExtraDwRate: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			PriceExtraEstPrice: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			PriceUnit: {
				domain: EntityDomainType.Quantity,
				mandatory: true,
			},
			RetailPrice: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			// SearchPattern
			SellUnit: {
				domain: EntityDomainType.Quantity,
				mandatory: true,
			},
			SpecificationInfo: {
				domain: EntityDomainType.Translation,
				mandatory: false,
			},
			StockMaterialCatalogFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Supplier: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UomFk: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			UomVolumeFk: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			UserDefinedDate1: {
				domain: EntityDomainType.DateTimeUtc,
				mandatory: false,
			},
			UserDefinedDate2: {
				domain: EntityDomainType.DateTimeUtc,
				mandatory: false,
			},
			UserDefinedDate3: {
				domain: EntityDomainType.DateTimeUtc,
				mandatory: false,
			},
			UserDefinedDate4: {
				domain: EntityDomainType.DateTimeUtc,
				mandatory: false,
			},
			UserDefinedDate5: {
				domain: EntityDomainType.DateTimeUtc,
				mandatory: false,
			},
			UserDefinedNumber1: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			UserDefinedNumber2: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			UserDefinedNumber3: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			UserDefinedNumber4: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			UserDefinedNumber5: {
				domain: EntityDomainType.Money,
				mandatory: true,
			},
			UserDefinedText1: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefinedText2: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefinedText3: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefinedText4: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			UserDefinedText5: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			Userdefined1: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			Userdefined2: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			Userdefined3: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			Userdefined4: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			Userdefined5: {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			// Uuid
			Volume: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Weight: {
				domain: EntityDomainType.Quantity,
				mandatory: true,
			},
			WeightNumber: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			WeightType: {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			InsertedAt: {
				domain: EntityDomainType.Date,
				mandatory: true,
			},
			InsertedBy: {
				mandatory: true,
				domain: EntityDomainType.Integer,
			},
			UpdatedAt: {
				domain: EntityDomainType.Date,
				mandatory: false,
			},
			UpdatedBy: {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			Version: {
				mandatory: true,
				domain: EntityDomainType.Integer,
			},
		},
		mainModule: 'productionplanning.ppsmaterial',
		additionalProperties: {
			// PPS Properties
			'PpsMaterial.ProdMatGroupFk': {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			'PpsMaterial.IsBundled': {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			'PpsMaterial.BasClobsPqtyContent': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsMaterial.BasUomPlanFk': {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			'PpsMaterial.BasClobsBqtyContent': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsMaterial.BasUomBillFk': {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			'PpsMaterial.MatSiteGrpFk': {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			'PpsMaterial.IsReadonly': {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},

			// PPS UserdefinedTexts
			'PpsMaterial.UserdefinedForProddesc1': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsMaterial.UserdefinedForProddesc2': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsMaterial.UserdefinedForProddesc3': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsMaterial.UserdefinedForProddesc4': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			'PpsMaterial.UserdefinedForProddesc5': {
				domain: EntityDomainType.Description,
				mandatory: false,
			},
			// PU Creation Group
			'PpsMaterial.QuantityFormula': {
				domain: EntityDomainType.Text,
				mandatory: true,
			},
			'PpsMaterial.MatGroupOvrFk': {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			'PpsMaterial.IsOverrideMaterial': {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			'PpsMaterial.MaterialOvrFk': {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			'PpsMaterial.BasUomOvrFk': {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			'PpsMaterial.IsSerialProduction': {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
			'PpsMaterial.SummarizeMode': {
				domain: EntityDomainType.Integer,
				mandatory: true,
			},
			'PpsMaterial.SummarizeGroup': {
				domain: EntityDomainType.Integer,
				mandatory: false,
			},
			'PpsMaterial.IsForSettlement': {
				domain: EntityDomainType.Boolean,
				mandatory: true,
			},
		},
	},
	layoutConfiguration: (context) => {
		return context.injector.get(PpsMaterialRecordLayoutService).generateLayout();
	},
	// prepareEntityContainer: async (ctx) => {
	// 	const materialTemplateTypeLookup = ctx.injector.get(BasicsSharedMaterialTemplateTypeLookupService);
	// 	const materialNumGenService = ctx.injector.get(BasicsSharedNumberGenerationService);
	// 	await Promise.all([
	// 		firstValueFrom(materialTemplateTypeLookup.getList()),
	// 		materialNumGenService.getNumberGenerateConfig('basics/material/numbergeneration//list')
	// 	]);
	// },

});


