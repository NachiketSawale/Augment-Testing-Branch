/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ColumnDef, createLookup, FieldType } from '@libs/ui/common';
import { IMaterialSearchEntity } from '../../material-search';
import { BasicsSharedProcurementStructureLookupService } from '../../lookup-services/procurement-structure-lookup.service';
import { BasicsMaterialWeightNumberLookupService } from '../../lookup-services/basics/material/basics-material-weight-number-lookup.service';
import { BasicsSharedMaterialDiscountGroupLookupService } from '../../lookup-services/basics/material/basics-material-discount-group-lookup.service';
import { BasicsSharedMaterialSimpleLookupService } from '../../lookup-services/basics/material/basics-material-simple-lookup.service';
import {
	BasicsSharedCo2SourceLookupService,
	BasicsSharedCostTypeLookupService,
	BasicsSharedDangerClassLookupService,
	BasicsSharedMaterialAbcLookupService,
	BasicsSharedMaterialStatusLookupService,
	BasicsSharedMaterialTemplateTypeLookupService,
	BasicsSharedMaterialTypeLookupService,
	BasicsSharedPackagingTypesLookupService
} from '../../lookup-services/customize';
import { BasicsSharedUomLookupService } from '../../lookup-services/basics-uom-lookup.service';
import { BasicsSharedTaxCodeLookupService } from '../../lookup-services/tax-code-lookup.service';
import { BasicsSharedMaterialFilterPriceListLookupService } from '../services/lookup-service/material-filter-price-list-lookup.service';
import { cloneDeep } from 'lodash';
import { MATERIAL_FILTER_ITEM_ATTRIBUTES_OPTIONS_TOKEN } from '../model';
import { BasicsSharedMaterialFilterItemAttributesComponent, BasicsSharedMaterialFilterItemDocumentsComponent } from '../components';

/**
 * Service to material filter grid
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedMaterialFilterResultColumnService {
	private fields: Partial<keyof IMaterialSearchEntity>[] = ['Code', 'CatalogCode', 'CatalogDescriptionInfo', 'GroupCode', 'GroupDescriptionInfo', 'PrcStructureFk', 'DescriptionInfo', 'DescriptionInfo2', 'SpecificationInfo', 'Cost', 'EstimatePrice', 'Currency', 'UomInfo', 'PriceUnit', 'PriceUnitUomInfo', 'BpdBusinesspartnerFk', 'LeadTime', 'MinQuantity', 'ListPrice', 'Matchcode', 'MdcMaterialabcFk', 'RetailPrice', 'Discount', 'Charges', 'PrcPriceconditionFk', 'PriceExtra', 'Supplier', 'DayworkRate', 'FactorPriceUnit', 'FactorHour', 'SellUnit', 'WeightType', 'WeightNumber', 'Weight', 'ExternalCode', 'EstCostTypeFk', 'LeadTimeExtra', 'MaterialTempTypeFk', 'BasUomWeightFk', 'Co2Source', 'Co2Project', 'BasCo2SourceFk', 'MdcTaxCodeFk', 'MdcMaterialFk', 'MdcMaterialDiscountGroupFk', 'MaterialStockFk', 'MaterialStatusFk', 'DangerClassFk', 'PackageTypeFk', 'UomVolumeFk', 'AgreementFk', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5', 'UserDefinedText1', 'UserDefinedText2', 'UserDefinedText3', 'UserDefinedText4', 'UserDefinedText5', 'UserDefinedNumber1', 'UserDefinedNumber2', 'UserDefinedNumber3', 'UserDefinedNumber4', 'UserDefinedNumber5'];
	private readonly selectedField: keyof IMaterialSearchEntity = 'selected';

	/**
	 * Material filter grid column
	 */
	private columns: ColumnDef<IMaterialSearchEntity>[] = [
		{
			id: 'selected',
			model: 'selected',
			type: FieldType.Boolean,
			pinned: true,
			visible: true,
			sortable: true,
			readonly: false,
			headerChkbox: false,
			label: {key: 'basics.common.selected'}
		},
		{
			id: 'code',
			model: 'Code',
			type: FieldType.Code,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'cloud.common.entityCode'}
		},
		{
			id: 'catalogCode',
			model: 'CatalogCode',
			type: FieldType.Code,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'basics.material.record.materialCatalog'}
		},
		{
			id: 'catalogDescriptionInfo',
			model: 'CatalogDescriptionInfo',
			type: FieldType.Translation,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.materialCatalogDescription'}
		},
		{
			id: 'groupCode',
			model: 'GroupCode',
			type: FieldType.Code,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'basics.material.record.materialGroup'}
		},
		{
			id: 'groupDescriptionInfo',
			model: 'GroupDescriptionInfo',
			type: FieldType.Translation,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.materialGroupDescription'}
		},
		{
			id: 'descriptionInfo',
			model: 'DescriptionInfo',
			type: FieldType.Translation,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityDescription'}
		},
		{
			id: 'descriptionInfo2',
			model: 'DescriptionInfo2',
			type: FieldType.Translation,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.furtherDescription'}
		},
		{
			id: 'currency',
			model: 'Currency',
			type: FieldType.Code,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'cloud.common.entityCurrency'}
		},
		{
			id: 'uomInfo',
			model: 'UomInfo',
			type: FieldType.Translation,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityUoM'}
		},
		{
			id: 'priceUnitUomInfo',
			model: 'PriceUnitUomInfo',
			type: FieldType.Translation,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityPriceUnitUoM'}
		},
		{
			id: 'prcStructureFk',
			model: 'PrcStructureFk',
			type: FieldType.Lookup,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'cloud.common.entityStructureCode'},
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementStructureLookupService,
				displayMember: 'Code'
			})
		},
		{
			id: 'structureDescription',
			model: 'PrcStructureFk',
			type: FieldType.Lookup,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'cloud.common.entityStructureDescription'},
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedProcurementStructureLookupService,
				displayMember: 'DescriptionInfo.Translated'
			})
		},
		{
			id: 'cost',
			model: 'MaterialPriceListFk',
			type: FieldType.Lookup,
			visible: true,
			sortable: true,
			readonly: false,
			width: 80,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialFilterPriceListLookupService,
				displayMember: 'Cost'
			}),
			label: {key: 'basics.material.record.costPrice'}
		},
		{
			id: 'estimatePrice',
			model: 'MaterialPriceListFk',
			type: FieldType.Lookup,
			visible: true,
			sortable: true,
			readonly: false,
			width: 80,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialFilterPriceListLookupService,
				displayMember: 'EstimatePrice'
			}),
			label: {key: 'basics.material.record.estimatePrice'}
		},
		/*{
			id: 'bpdBusinesspartnerFk',
			model: 'BpdBusinesspartnerFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'basics.common.BusinessPartner'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BusinessPartnerLookupService,
				displayMember: 'BusinessPartnerName1'
			})
		},*/
		{
			id: 'matchcode',
			model: 'Matchcode',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'basics.material.record.matchCode'}
		},
		{
			id: 'weightType',
			model: 'WeightType',
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialTypeLookupService,
			}),
			label: {key: 'basics.material.record.weightType'}
		},
		{
			id: 'mdcMaterialDiscountGroupFk',
			model: 'MdcMaterialDiscountGroupFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 80,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialDiscountGroupLookupService,
				displayMember: 'Code'
			}),
			label: {key: 'basics.material.record.discountGroup'}
		},
		{
			id: 'neutralMaterialFk',
			model: 'MdcMaterialFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 80,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialSimpleLookupService,
				displayMember: 'Code'
			}),
			label: {key: 'basics.material.record.neutralMaterial'}
		},
		{
			id: 'neutralMaterialFkDescription',
			model: 'MdcMaterialFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialSimpleLookupService,
				displayMember: 'DescriptionInfo.Translated'
			}),
			label: {key: 'basics.material.record.neutralMaterialDescription'}
		},
		{
			id: 'materialStockFk',
			model: 'MaterialStockFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 80,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialSimpleLookupService,
				displayMember: 'Code'
			}),
			label: {key: 'basics.material.record.stockMaterial'}
		},
		{
			id: 'materialStockFkDescription',
			model: 'MaterialStockFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialSimpleLookupService,
				displayMember: 'DescriptionInfo.Translated'
			}),
			label: {key: 'basics.material.record.stockMaterialDescription'}
		},
		{
			id: 'materialStockFkCatalogCode',
			model: 'MaterialStockFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialSimpleLookupService,
				displayMember: 'MaterialCatalogCode'
			}),
			label: {key: 'basics.material.record.stockMaterialCatalog'}
		},
		/*{
			id: 'materialStockFkCatalogDescription',
			model: 'MaterialStockFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			type: FieldType.Lookup,
			formatterOptions: {lookupType: 'materialRecord'},
			additionalColumn: {
				id: 'materialStockFkCatalogDescription',
				model: 'MaterialCatalogFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: 'MaterialCatalog',
					displayMember: 'DescriptionInfo.Translated'
				},
			},
			label: {key: 'basics.material.record.stockMaterialCatalogDescription'}
		},*/
		{
			id: 'userDefined1',
			model: 'UserDefined1',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefined', params: {'p_0': '1'}},
			width: 100
		},
		{
			id: 'userDefined2',
			model: 'UserDefined2',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefined', params: {'p_0': '2'}},
			width: 100
		},
		{
			id: 'userDefined3',
			model: 'UserDefined3',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefined', params: {'p_0': '3'}},
			width: 100
		},
		{
			id: 'userDefined4',
			model: 'UserDefined4',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefined', params: {'p_0': '4'}},
			width: 100
		},
		{
			id: 'userDefined5',
			model: 'UserDefined5',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefined', params: {'p_0': '5'}},
			width: 100
		},
		{
			id: 'userDefinedDate1',
			model: 'UserDefinedDate1',
			type: FieldType.DateTime,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedDate', params: {'p_0': '1'}},
			width: 100
		},
		{
			id: 'userDefinedDate2',
			model: 'UserDefinedDate2',
			type: FieldType.DateTime,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedDate', params: {'p_0': '2'}},
			width: 100
		},
		{
			id: 'userDefinedDate3',
			model: 'UserDefinedDate3',
			type: FieldType.DateTime,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedDate', params: {'p_0': '3'}},
			width: 100
		},
		{
			id: 'userDefinedDate4',
			model: 'UserDefinedDate4',
			type: FieldType.DateTime,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedDate', params: {'p_0': '4'}},
			width: 100
		},
		{
			id: 'userDefinedDate5',
			model: 'UserDefinedDate5',
			type: FieldType.DateTime,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedDate', params: {'p_0': '5'}},
			width: 100
		},
		{
			id: 'userDefinedText1',
			model: 'UserDefinedText1',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedText', params: {'p_0': '1'}},
			width: 100
		},
		{
			id: 'userDefinedText2',
			model: 'UserDefinedText2',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedText', params: {'p_0': '2'}},
			width: 100
		},
		{
			id: 'userDefinedText3',
			model: 'UserDefinedText3',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedText', params: {'p_0': '3'}},
			width: 100
		},
		{
			id: 'userDefinedText4',
			model: 'UserDefinedText4',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedText', params: {'p_0': '4'}},
			width: 100
		},
		{
			id: 'userDefinedText5',
			model: 'UserDefinedText5',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedText', params: {'p_0': '5'}},
			width: 100
		},
		{
			id: 'userDefinedNumber1',
			model: 'UserDefinedNumber1',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedNumber', params: {'p_0': '1'}},
			width: 100
		},
		{
			id: 'userDefinedNumber2',
			model: 'UserDefinedNumber2',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedNumber', params: {'p_0': '2'}},
			width: 100
		},
		{
			id: 'userDefinedNumber3',
			model: 'UserDefinedNumber3',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedNumber', params: {'p_0': '3'}},
			width: 100
		},
		{
			id: 'userDefinedNumber4',
			model: 'UserDefinedNumber4',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedNumber', params: {'p_0': '4'}},
			width: 100
		},
		{
			id: 'userDefinedNumber5',
			model: 'UserDefinedNumber5',
			type: FieldType.Text,
			visible: true,
			sortable: true,
			readonly: true,
			label: {key: 'cloud.common.entityUserDefinedNumber', params: {'p_0': '5'}},
			width: 100
		},
		{
			id: 'specificationInfo',
			model: 'SpecificationInfo',
			type: FieldType.Translation,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.EntitySpec'}
		},
		{
			id: 'priceUnit',
			model: 'PriceUnit',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityPriceUnit'}
		},
		{
			id: 'leadTime',
			model: 'LeadTime',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.leadTimeExtra'}
		},
		{
			id: 'leadTimeExtra',
			model: 'LeadTimeExtra',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.leadTimeExtra'}
		},
		{
			id: 'minQuantity',
			model: 'MinQuantity',
			type: FieldType.Quantity,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.minQuantity'}
		},
		{
			id: 'listPrice',
			model: 'ListPrice',
			type: FieldType.Money,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.listPrice'}
		},
		{
			id: 'mdcMaterialabcFk',
			model: 'MdcMaterialabcFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 80,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialAbcLookupService,
				displayMember: 'DescriptionInfo.Translated'
			}),
			label: {key: 'basics.material.record.aBCGroup'}
		},
		{
			id: 'retailPrice',
			model: 'RetailPrice',
			type: FieldType.Money,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.retailPrice'}
		},
		{
			id: 'discount',
			model: 'Discount',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.discount'}
		},
		{
			id: 'charges',
			model: 'Charges',
			type: FieldType.Money,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.charges'}
		},
		/*{
			id: 'prcPriceconditionFk',
			model: 'PrcPriceconditionFk',
			type: FieldType.Lookup,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityPriceCondition'},
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedPriceConditionLookupService
			})
		},*/
		{
			id: 'priceExtra',
			model: 'PriceExtra',
			type: FieldType.Money,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.priceExtras'}
		},
		{
			id: 'supplier',
			model: 'Supplier',
			type: FieldType.Code,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'basics.material.record.supplier'}
		},
		{
			id: 'dayworkRate',
			model: 'DayworkRate',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.dayworkRate'}
		},
		{
			id: 'factorPriceUnit',
			model: 'FactorPriceUnit',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityFactor'}
		},
		{
			id: 'factorHour',
			model: 'FactorHour',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.factorHour'}
		},
		{
			id: 'sellUnit',
			model: 'SellUnit',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.sellUnit'}
		},
		{
			id: 'weightType',
			model: 'WeightType',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialTypeLookupService,
			}),
			label: {key: 'basics.material.record.weightType'}
		},
		{
			id: 'weightNumber',
			model: 'WeightNumber',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsMaterialWeightNumberLookupService,
			}),
			label: {key: 'basics.material.record.weightNumber'}
		},
		{
			id: 'weight',
			model: 'Weight',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.weight'}
		},
		{
			id: 'externalCode',
			model: 'ExternalCode',
			type: FieldType.Code,
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'basics.material.record.externalCode'}
		},
		{
			id: 'estCostTypeFk',
			model: 'EstCostTypeFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 100,
			label: {key: 'basics.material.record.externalCode'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCostTypeLookupService
			})
		},
		{
			id: 'leadTimeExtra',
			model: 'LeadTimeExtra',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.LeadTimeExtra'}
		},
		{
			id: 'materialTempTypeFk',
			model: 'MaterialTempTypeFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			type: FieldType.Lookup,
			label: {key: 'basics.material.record.materialTemplateType'},
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialTemplateTypeLookupService,
				displayMember: 'DescriptionInfo.Translated'
			})
		},
		{
			id: 'basUomWeightFk',
			model: 'BasUomWeightFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.uomWeight'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedUomLookupService
			})
		},
		{
			id: 'co2Source',
			model: 'Co2Source',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.entityCo2Source'}
		},
		{
			id: 'co2Project',
			model: 'Co2Project',
			type: FieldType.Decimal,
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.entityCo2Project'}
		},
		{
			id: 'basCo2SourceFk',
			model: 'BasCo2SourceFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.entityBasCo2SourceFk'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCo2SourceLookupService
			})
		},
		{
			id: 'mdcTaxCodeFk',
			model: 'MdcTaxCodeFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.MdcTaxCodeFk'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedTaxCodeLookupService
			})
		},
		{
			id: 'materialStatusFk',
			model: 'MaterialStatusFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.materialStatus'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMaterialStatusLookupService,
			})
		},
		{
			id: 'dangerClassFk',
			model: 'DangerClassFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityDangerClass'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedDangerClassLookupService
			})
		},
		{
			id: 'packageTypeFk',
			model: 'PackageTypeFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityPackagingType'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedPackagingTypesLookupService
			})
		},
		{
			id: 'uomVolumeFk',
			model: 'UomVolumeFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'cloud.common.entityUomVolume'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedUomLookupService
			})
		}/*,
		{
			id: 'agreementFk',
			model: 'AgreementFk',
			visible: true,
			sortable: true,
			readonly: true,
			width: 150,
			label: {key: 'basics.material.record.partnerAgreement'},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedBusinessPartnerAgreementLookupService
			})
		}*/
	];

	public getColumns() {
		return this.columns;
	}

	public getRows() {
		const rows = cloneDeep(this.getColumns()).filter(c => {
			if (c.model !== this.selectedField) {
				c.readonly = true;
				return true;
			}
			return false;
		});

		rows.push(this.attributesColumnDef, this.documentsColumnDef, this.characteristicsColumnDef);

		return rows;
	}

	private get attributesColumnDef(): ColumnDef<IMaterialSearchEntity> {
		return {
			id: 'attributes',
			model: 'Attributes',
			label: {key: 'basics.material.lookup.attributes'},
			type: FieldType.CustomComponent,
			componentType: BasicsSharedMaterialFilterItemAttributesComponent,
			providers: [{
				provide: MATERIAL_FILTER_ITEM_ATTRIBUTES_OPTIONS_TOKEN,
				useValue: {Model: 'Attributes'}
			}],
			sortable: false
		};
	}

	private get documentsColumnDef(): ColumnDef<IMaterialSearchEntity> {
		return {
			id: 'documents',
			model: 'Documents',
			label: {key: 'basics.material.lookup.documents'},
			type: FieldType.CustomComponent,
			componentType: BasicsSharedMaterialFilterItemDocumentsComponent,
			sortable: false
		};
	}

	private get characteristicsColumnDef(): ColumnDef<IMaterialSearchEntity> {
		return {
			id: 'characteristics',
			model: 'Characteristics',
			label: {key: 'basics.material.lookup.characteristics'},
			type: FieldType.CustomComponent,
			componentType: BasicsSharedMaterialFilterItemAttributesComponent,
			providers: [{
				provide: MATERIAL_FILTER_ITEM_ATTRIBUTES_OPTIONS_TOKEN,
				useValue: {Model: 'Characteristics'}
			}],
			sortable: false
		};
	}
}