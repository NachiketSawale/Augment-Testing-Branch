/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedImportEditorType, BasicsSharedImportField } from '@libs/basics/shared';
import { FieldType } from '@libs/ui/common';

export const PES_ITEM_IMPORT_FIELDS: BasicsSharedImportField[] = [
	{
		PropertyName: 'ContractCode',
		EntityName: 'PesItem',
		model: 'ContractCode',
		type: FieldType.Description,
		DisplayName: 'procurement.pes.entityConHeaderFk',
		DomainName: 'description',
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'PrcItem_Code',
		EntityName: 'PesItem',
		model: 'PrcItem_Code',
		type: FieldType.Description,
		DisplayName: 'procurement.pes.entityPrcItemFk',
		DomainName: 'description',
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'MDC_MATERIAL_FK',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.prcItemMaterialNoForImport',
		DomainName: 'integer',
		model: 'MDC_MATERIAL_FK',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.customlookup,
		DisplayMember: 'Code',
		LookupQualifier: 'materialrecord',
		NotUseDefaultValue: true,
		sortable: false
	},
	{
		PropertyName: 'Quantity',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityQuantity',
		DomainName: 'quantity',
		model: 'Quantity',
		type: FieldType.Quantity,
		Editor: BasicsSharedImportEditorType.domain,
		ribFormatMappingName: 'Quantity',
		sortable: false
	},
	{
		PropertyName: 'TaxCode',
		EntityName: 'Tax',
		DisplayName: 'cloud.common.entityTaxCode',
		DomainName: 'integer',
		model: 'TaxCode',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		NotUseDefaultValue: true,
		DisplayMember: 'Code',
		LookupQualifier: 'masterdata.context.taxcode',
		sortable: false
	},
	{
		PropertyName: 'Uom',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.AlternativeUom',
		DomainName: 'integer',
		model: 'Uom',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		DisplayMember: 'UOM',
		LookupQualifier: 'basics.uom',
		sortable: false
	},
	{
		PropertyName: 'PriceOc',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityPriceOc',
		DomainName: 'money',
		model: 'PriceOc',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'ProjectCode',
		EntityName: 'PesItem',
		DisplayName: 'cloud.common.entityProjectNo',
		DomainName: 'integer',
		model: 'ProjectCode',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.customlookup,
		DisplayMember: 'ProjectName',
		LookupType: 'project',
		sortable: false
	},
	{
		PropertyName: 'PackageCode',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityPackageFk',
		DomainName: 'integer',
		model: 'PackageCode',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.customlookup,
		DisplayMember: 'Code',
		LookupType: 'PrcPackage',
		sortable: false
	},
	{
		PropertyName: 'MDC_CONTROLLINGUNIT_FK',
		EntityName: 'Controllingunit',
		DisplayName: 'cloud.common.entityControllingUnitCode',
		DomainName: 'integer',
		model: 'MDC_CONTROLLINGUNIT_FK',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		DisplayMember: 'Code',
		AlternativeMember: 'description',
		LookupQualifier: 'masterdata.context.controllingunit.withcontext',
		sortable: false
	},
	{
		PropertyName: 'PRC_STRUCTURE_FK',
		EntityName: 'PesItem',
		DisplayName: 'cloud.common.entityStructureCode',
		DomainName: 'integer',
		model: 'PRC_STRUCTURE_FK',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		DisplayMember: 'Code',
		LookupQualifier: 'prc.structure.withcontext',
		sortable: false
	},
	{
		PropertyName: 'Description1',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.prcItemDescription1',
		DomainName: 'description',
		model: 'Description1',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'DESCRIPTION2',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.prcItemFurtherDescription',
		DomainName: 'description',
		model: 'DESCRIPTION2',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'PrcStockTransaction',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityPrcStockTransaction',
		DomainName: 'integer',
		model: 'PrcStockTransaction',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.customlookup,
		DisplayMember: 'MaterialDescription',
		LookupType: 'PrcStocktransaction',
		sortable: false
	},
	{
		PropertyName: 'PrcStockTransactionType',
		EntityName: 'PesItem',
		DisplayName: 'cloud.common.entityPrcStockTransactionType',
		DomainName: 'integer',
		model: 'PrcStockTransactionType',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		DisplayMember: 'Description',
		LookupQualifier: 'basics.customize.prcstocktransactiontype',
		sortable: false
	},
	{
		PropertyName: 'PrjStockLocation',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityPrjStockLocation',
		DomainName: 'integer',
		model: 'PrjStockLocation',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.customlookup,
		DisplayMember: 'Code',
		LookupType: 'ProjectStockLocation',
		sortable: false
	},
	{
		PropertyName: 'PrjStock',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityPrjStock',
		DomainName: 'integer',
		model: 'PrjStock',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.customlookup,
		DisplayMember: 'Code',
		LookupType: 'ProjectStock',
		sortable: false
	},
	{
		PropertyName: 'LotNo',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityLotNo',
		DomainName: 'description',
		model: 'LotNo',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'BatchNo',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityBatchNo',
		DomainName: 'description',
		model: 'BatchNo',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'ProvisionPercent',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityProvisionPercent',
		DomainName: 'money',
		model: 'ProvisionPercent',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'ProvisonTotal',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityProvisonTotal',
		DomainName: 'money',
		model: 'ProvisonTotal',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'Userdefined1',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.userDefined1',
		DomainName: 'description',
		model: 'Userdefined1',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'Userdefined2',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.userDefined2',
		DomainName: 'description',
		model: 'Userdefined2',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'Userdefined3',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.userDefined3',
		DomainName: 'description',
		model: 'Userdefined3',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'Userdefined4',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.userDefined4',
		DomainName: 'description',
		model: 'Userdefined4',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'Userdefined5',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.userDefined5',
		DomainName: 'description',
		model: 'Userdefined5',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'IsFinalDelivery',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityIsFinalDelivery',
		DomainName: 'boolean',
		model: 'IsFinalDelivery',
		type: FieldType.Boolean,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'PriceCondition',
		EntityName: 'PesItem',
		DisplayName: 'cloud.common.entityPriceCondition',
		DomainName: 'integer',
		model: 'PriceCondition',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		NotUseDefaultValue: true,
		DisplayMember: 'description',
		LookupQualifier: 'prc.pricecondition',
		sortable: false
	},
	{
		PropertyName: 'IsAssetManagement',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityIsAssetmanagement',
		DomainName: 'boolean',
		model: 'IsAssetManagement',
		type: FieldType.Boolean,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'DiscountSplitOc',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.DiscountSplitOcEntity',
		DomainName: 'money',
		model: 'DiscountSplitOc',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'PriceGrossOc',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.priceOcGross',
		DomainName: 'money',
		model: 'PriceGrossOc',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'ExternalCode',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.externalCode',
		DomainName: 'description',
		model: 'ExternalCode',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'MaterialExternalCode',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.prcItemMaterialExternalCode',
		DomainName: 'description',
		model: 'MaterialExternalCode',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'ExpirationDate',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.ExpirationDate',
		DomainName: 'date',
		model: 'ExpirationDate',
		IsDefaultNullForDomain: true,
		NotUseDefaultValue: true,
		type: FieldType.Date,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'AlternativeUom',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.AlternativeUom',
		DomainName: 'integer',
		model: 'AlternativeUom',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		DisplayMember: 'description',
		LookupQualifier: 'basics.uom',
		sortable: false
	},
	{
		PropertyName: 'AlternativeQuantity',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.AlternativeQuantity',
		DomainName: 'quantity',
		model: 'AlternativeQuantity',
		type: FieldType.Quantity,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'TotalOcDelivered',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityDeliveredTotalOc',
		DomainName: 'money',
		model: 'TotalOcDelivered',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'BudgetPerUnit',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityBudgetPerUnit',
		DomainName: 'money',
		model: 'BudgetPerUnit',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'BudgetTotal',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityBudgetTotal',
		DomainName: 'money',
		model: 'BudgetTotal',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'BudgetFixedTotal',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityBudgetFixedTotal',
		DomainName: 'money',
		model: 'BudgetFixedTotal',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'BudgetFixedUnit',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.entityBudgetFixedUnit',
		DomainName: 'money',
		model: 'BudgetFixedUnit',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'BasBlobSpecification',
		EntityName: 'PesItem',
		DisplayName: 'cloud.common.EntitySpec',
		DomainName: 'description',
		model: 'BasBlobSpecification',
		type: FieldType.Description,
		Editor: BasicsSharedImportEditorType.none,
		sortable: false
	},
	{
		PropertyName: 'MdcSalesTaxGroup',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityMdcSalesTaxGroup',
		DomainName: 'integer',
		model: 'MdcSalesTaxGroup',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.simpledescriptionlookup,
		DisplayMember: 'Code',
		LookupQualifier: 'basics.customize.salestaxgroup',
		sortable: false
	},
	{
		PropertyName: 'StandardCost',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityStandardCost',
		DomainName: 'money',
		model: 'StandardCost',
		type: FieldType.Money,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	},
	{
		PropertyName: 'MaterialStock',
		EntityName: 'PesItem',
		DisplayName: 'procurement.pes.entityStockMaterial',
		DomainName: 'integer',
		model: 'MaterialStock',
		type: FieldType.Integer,
		Editor: BasicsSharedImportEditorType.customlookup,
		DisplayMember: 'Code',
		LookupType: 'MaterialCommodity',
		sortable: false
	},
	{
		PropertyName: 'QuantityAskedFor',
		EntityName: 'PesItem',
		DisplayName: 'procurement.common.prcItemQuantityAskedfor',
		DomainName: 'quantity',
		model: 'QuantityAskedFor',
		type: FieldType.Quantity,
		Editor: BasicsSharedImportEditorType.domain,
		sortable: false
	}
];
