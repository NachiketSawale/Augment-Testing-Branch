/*
 * Copyright(c) RIB Software GmbH
 */

import { IInv2ContractEntity } from '../model';
import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCompanyContextService, BasicsSharedLookupOverloadProvider, RoundingFieldOverloadSpec } from '@libs/basics/shared';
import { IMaterialPriceConditionEntity } from '@libs/basics/interfaces';
import {
	ProcurementSharedLookupOverloadProvider,
	ProcurementSharedPrcItemMergedLookupService
} from '@libs/procurement/shared';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';

/**
 * Procurement Contract Item layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceContractItemLayoutService {
	private readonly leadingService = inject(ProcurementInvoiceHeaderDataService);
	private prcItemMergedLookup = inject(ProcurementSharedPrcItemMergedLookupService);
	private readonly companyContextService = inject(BasicsSharedCompanyContextService);

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IInv2ContractEntity>> {
		return <ILayoutConfiguration<IInv2ContractEntity>>{
			groups: [
				{
					gid: 'invoiceContract',
					attributes: [
						'ConHeaderFk',
						'PrcItemFk',
						'PrcBoqFk',
						'Description',
						'OrderQuantity',
						'Uom',
						'Price',
						'BasUomPriceUnit',
						'OrderQuantityConverted',
						'PriceOc',
						'TotalPrice',
						'TotalPriceOc',
						'LotNo',
						'PrcStockTransactionFk',
						'PrcStockTransactionTypeFk',
						'PrjStockFk',
						'PrjStockLocationFk',
						'ProvisionPercent',
						'ProvisionTotal',
						'IsAssetManagement',
						'ControllinggrpsetFk',
						'FixedAssetFk',
						'ExpirationDate',
						'DiscountSplit',
						'DiscountSplitOc',
						'AlternativeUomFk',
						'AlternativeQuantity',
						'MaterialStockFk',
						'Co2Project',
						'Co2ProjectTotal',
						'Co2SourceTotal',
						'Co2Source',
						'Account',
						'AccountDesc',
						'Percentage',
						'MaterialCode',
						'MaterialExternalCode',
						'PriceGross',
						'PriceOcGross',
					],
				},
				{
					gid: 'invoiceDelivery',
					attributes: ['PrcStructureFk', 'ControllingUnitFk', 'Quantity', 'TotalValue', 'TotalValueOc', 'TotalValueGross', 'TotalValueGrossOc', 'IsFinalDelivery', 'MdcSalesTaxGroupFk'],
				},
				{
					gid: 'invoiceOther',
					attributes: ['CommentText', 'TaxCodeFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.invoice.', {
					ConHeaderFk: {
						key: 'entityConCode',
						text: 'entityConCode',
					},
					PrcItemFk: {
						key: 'contract.itemTitle',
						text: 'contract.itemTitle',
					},
					PrcBoqFk: {
						key: 'contract.boqTitle',
						text: 'contract.boqTitle',
					},
					OrderQuantity: {
						key: 'contract.orderQuantity',
						text: 'contract.orderQuantity',
					},
					OrderQuantityConverted: {
						key: 'contract.orderFactoredQuantity',
						text: 'Factored Order Qty',
					},
					Price: {
						key: 'contract.price',
						text: 'contract.price',
					},
					PriceOc: {
						key: 'contract.priceOc',
						text: 'contract.priceOc',
					},
					TotalPrice: {
						key: 'contract.totalPrice',
						text: 'contract.totalPrice',
					},
					TotalPriceOc: {
						key: 'contract.totalPriceOc',
						text: 'contract.totalPriceOc',
					},
					TotalValue: {
						key: 'contract.totalValue',
						text: 'contract.totalValue',
					},
					TotalValueOc: {
						key: 'contract.totalValueOc',
						text: 'contract.totalValueOc',
					},
					IsFinalDelivery: {
						key: 'contract.finalDelivery',
						text: 'contract.finalDelivery',
					},
					invoiceContract: {
						key: 'group.contract',
						text: 'group.contract',
					},
					invoiceDelivery: {
						key: 'group.delivery',
						text: 'group.delivery',
					},
					invoiceOther: {
						key: 'group.other',
						text: 'group.other',
					},
					ExpirationDate: {
						key: 'ExpirationDate',
						text: 'Expiration Date',
					},
					IsAssetManagement: {
						key: 'entityIsAssetmanagement',
						text: 'Is Assetmanagement',
					},
					Co2Project: {
						key: 'entityCo2Project',
						text: 'CO2/kg (Project)',
					},
					Co2ProjectTotal: {
						key: 'entityCo2ProjectTotal',
						text: 'CO2/kg (Project Total)',
					},
					Co2SourceTotal: {
						key: 'entityCo2SourceTotal',
						text: 'CO2/kg (Source Total)',
					},
					Co2Source: {
						key: 'entityCo2Source',
						text: 'CO2/kg (Source)',
					},
					Account: {
						key: 'account',
						text: 'Account',
					},
					AccountDesc: {
						key: 'accountDesc',
						text: 'Account Description',
					},
					MdcSalesTaxGroupFk: { key: 'entityMdcSalesTaxGroup', text: 'Sales Tax Group' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					PrcStructureFk: { key: 'entityStructureCode', text: 'Structure Code' },
					BasUomPriceUnit: { key: 'entityPriceUnitUoM', text: 'Price Unit UoM' },
					CommentText: { key: 'entityComment', text: 'entityComment' },
					Uom: { key: 'entityUoM', text: 'entityUoM' },
					FixedAssetFk: { key: 'entityFixedAsset', text: 'Fixed Asset' },
					ControllinggrpsetFk: { key: 'entityControllinggrpset', text: 'Controlling grp set' },
					TaxCodeFk: { key: 'entityTaxCode', text: 'Tax Code' },
					ControllingUnitFk: { key: 'entityControllingUnitCode', text: 'Controlling Unit Code' },
				}),

				...prefixAllTranslationKeys('procurement.common.', {
					TotalValueGross: { key: 'totalValueGross', text: 'Total Value (Gross)' },
					TotalValueGrossOc: { key: 'totalValueOcGross', text: 'Total Value (OC)(Gross)' },
					PrcStockTransactionTypeFk: { key: 'entityPrcStockTransactionType', text: 'Stock Transaction Type' },
					PrjStockFk: { key: 'entityPrjStock', text: 'Stock' },
					PrjStockLocationFk: { key: 'entityPrjStockLocation', text: 'Stock Location' },
					ProvisionPercent: { key: 'entityProvisionPercent', text: 'Provision Percent' },
					ProvisionTotal: { key: 'entityProvisonTotal', text: 'Provision Total' },
					PrcStockTransactionFk: { key: 'entityPrcStockTransaction', text: 'Stock Transaction' },
					LotNo: { key: 'entityLotNo', text: 'Lot No.' },
					DiscountSplit: { key: 'DiscountSplitEntity', text: 'Discount Split' },
					DiscountSplitOc: { key: 'DiscountSplitOcEntity', text: 'Discount Split Oc' },
					MaterialStockFk: { key: 'prcItemMaterialStockFk', text: 'Stock Material' },
					AlternativeUomFk: { key: 'AlternativeUom', text: 'Alternative Uom' },
					AlternativeQuantity: { key: 'AlternativeQuantity', text: 'Alternative Quantity' },
					MaterialExternalCode: { key: 'prcItemMaterialExternalCode', text: 'Material External Code' },
					PrcItemTotalGross: { key: 'totalGross', text: 'Total Gross' },
					PrcItemTotalGrossOc: { key: 'procurement.common.totalOcGross', text: 'Total Gross (OC)' },
				}),
				...prefixAllTranslationKeys('procurement.contract.', {
					Quantity: {
						key: 'Quantity',
						text: 'Quantity',
					},
				}),
				...prefixAllTranslationKeys('basics.common.', {
					MaterialCode: {
						key: 'entityMaterialCode',
						text: 'Material Code',
					},
				}),
			},
			overloads: {
				Code: { readonly: true },
				Account: { readonly: true },
				AccountDesc: { readonly: true },
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				MdcSalesTaxGroupFk: ProcurementSharedLookupOverloadProvider.provideProcurementSalesTaxGroupLookupOverload(true),
				ControllingUnitFk: await ProcurementSharedLookupOverloadProvider.provideProcurementControllingUnitLookupOverload(context, {
					controllingUnitGetter: (e) => e.ControllingUnitFk,
					lookupOptions: {
						serverSideFilter: {
							key: 'prc.con.controllingunit.by.prj.filterkey',
							execute: (context) => {
								const invHeader = this.leadingService.getSelectedEntity();
								return {
									ByStructure: true,
									ExtraFilter: true,
									PrjProjectFk: invHeader?.ProjectFk,
								};
							},
						},
					},
				}),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
				PrcItemFk: ProcurementSharedLookupOverloadProvider.providePrcItemFkLookupOverload(true, {
					key: 'prc-invoice-item-filter',
					execute: (context) => {
						return {
							IsCanceled: false,
							ContractId: context.entity!.ConHeaderFk,
						};
					},
				}),
				ConHeaderFk: {
					...ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'procurement.invoice.header.conHeaderDes', false, {
						key: 'prc-invoice-con-header-filter',
						execute: (context) => {
							const invHeader = this.leadingService.getSelectedEntity();
							if (!invHeader) {
								return {};
							}
							return {
								StatusIsInvoiced: false,
								StatusIsCanceled: false,
								StatusIsVirtual: false,
								StatusIsOrdered: true,
								IsFramework: false,
								PesHeaderFk: invHeader.PesHeaderFk,
								BusinessPartnerFk: invHeader.BusinessPartnerFk,
								ProjectFk: invHeader.ProjectFk,
								PrcPackageFk: invHeader.PrcPackageFk,
								ControllingUnit: invHeader.ControllingUnitFk,
								PrcStructureFk: invHeader.PrcStructureFk,
								ExcludeCalloffContracts: context.entity!.InvHeaderFk === 0,
							};
						},
					}),
					...{
						additionalFields: [
							{
								id: 'ConHeaderDescription',
								displayMember: 'Description',
								label: {
									key: 'procurement.invoice.header.conHeaderDes',
									text: 'Contract Description',
								},
								column: true,
								singleRow: true,
							},
							{
								id: 'ConHeaderStatus',
								displayMember: 'StatusDescriptionInfo.Translated',
								label: {
									key: 'cloud.common.entityStatus',
									text: 'Status',
								},
								column: true,
								singleRow: true,
							},
							{
								id: 'contractDate',
								displayMember: 'DateOrdered',
								label: {
									key: 'procurement.invoice.contract.dateOrdered',
									text: 'Contract Date',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				BasUomPriceUnit: { readonly: true },
				OrderQuantityConverted: { readonly: true },
				PrjStockFk: ProjectSharedLookupOverloadProvider.provideProjectStockOptionLookupOverload({
					showClearButton: true,
					readonly: false,
					serverSideFilter: {
						key: 'prc-invoice-item-stock-type-filter',
						execute: (context) => {
							const invHeader = this.leadingService.getSelectedEntity();
							return {
								PKey2: context.entity!.MaterialStockFk ?? context.entity!.MdcMaterialFk,
								PKey3: invHeader?.ProjectFk,
							};
						},
					},
					clientSideFilter: {
						execute: (item) => {
							return item.IsProcurement;
						},
					},
				}),
				PrjStockLocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationLookupOverload(true),
				PrcStockTransactionTypeFk: ProcurementSharedLookupOverloadProvider.providePrcStockTransactionTypeFkLookupOverload(true, {
					key: 'prc-invoice-item-transactiontype-filter',
					execute: (context) => {
						const invHeader = this.leadingService.getSelectedEntity();
						return invHeader && invHeader.PrcConfigurationFk !== 0 ? `PrcConfiguration=${invHeader.PrcConfigurationFk}` : '';
					},
				}),
				PrcStockTransactionFk: ProcurementSharedLookupOverloadProvider.providePrcStockTransactionFkLookupOverload(true, {
					key: 'prc-invoice-transaction-filter',
					execute: (context) => {
						const contractItem = context.entity!;
						if (contractItem.PrcItemFk) {
							return new Promise((resolve) => {
								this.prcItemMergedLookup
									.getItemByKey({
										id: contractItem.PrcItemFk as number,
									})
									.subscribe((e) => {
										resolve({ PrjStockFk: contractItem.PrjStockFk, MdcMaterialFk: e.MdcMaterialFk });
									});
							});
						}
						return { PrjStockFk: contractItem.PrjStockFk };
					},
				}),
				ControllinggrpsetFk: {
					readonly: true,
					form: {
						visible: false,
					},
					grid: {
						// Todo - custom formatter controllingStructureGrpSetDTLActionProcessor
						// wait for framework: https://rib-40.atlassian.net/browse/DEV-19395
					},
				},

				FixedAssetFk: ProcurementSharedLookupOverloadProvider.provideFixedAssetServerLookupOverload(true, {
					key: 'procurement-invoice-item-fixed-asset-filter',
					execute: (context) => {
						const contractItem = context.entity!;
						if (contractItem.IsAssetManagement) {
							const loginCompany = this.companyContextService.loginCompanyEntity;
							if (loginCompany.EquipmentContextFk) {
								return `EtmContextFk = ${loginCompany.EquipmentContextFk}`;
							}
						}
						return 'EtmContextFk = -1';
					},
				}),
				AlternativeUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				// Todo - materialstockfk, waiting for material stock lookup
				MaterialStockFk: {
					readonly: true,
				},
				AlternativeQuantity: { readonly: true },
				Co2ProjectTotal: { readonly: true },
				Co2SourceTotal: { readonly: true },
				Co2Source: { readonly: true },
				Co2Project: { readonly: true },
				TotalPrice: <RoundingFieldOverloadSpec<IMaterialPriceConditionEntity>>{
					roundingField: 'Inv2Con_TotalPrice',
				},
				TotalPriceOc: <RoundingFieldOverloadSpec<IMaterialPriceConditionEntity>>{
					roundingField: 'Inv2Con_TotalPriceOc',
				},
			},
			transientFields: [
				{
					id: 'Percentage',
					model: 'Percentage',
					type: FieldType.Decimal,
					label: { key: 'procurement.invoice.contract.percentage' },
					readonly: false,
					pinned: true,
				},
				{
					id: 'priceGross',
					model: 'PriceGross',
					type: FieldType.Money,
					label: { key: 'procurement.common.priceGross' },
					readonly: false,
					pinned: true,
				},
			],
		};
	}
}
