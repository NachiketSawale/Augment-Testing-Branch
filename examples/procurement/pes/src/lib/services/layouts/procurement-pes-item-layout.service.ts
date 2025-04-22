/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, TransientFieldSpec } from '@libs/ui/common';
import { IPesItemEntity } from '../../model/entities';
import { IInitializationContext, PlatformPinningContextService, prefixAllTranslationKeys } from '@libs/platform/common';
import { ProcurementSharedLookupOverloadProvider, ProcurementSharedPrcItemMergedLookupService } from '@libs/procurement/shared';
import { ProcurementPesItemDataService } from '../procurement-pes-item-data.service';
import {
	BasicsSharedLookupOverloadProvider,
	BasicsSharedRoundingFactoryService,
	BasicsSharedRoundingModule as roundingModule,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupLayoutService,
	BasicsSharedMaterialLookupService,
} from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider, ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
import { ControllingSharedControllingUnitLookupProviderService } from '@libs/controlling/shared';
import { isNil } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPesItemLayoutService {
	private readonly dataService = inject(ProcurementPesItemDataService);
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);
	private readonly controllingUnitLookupProvider = inject(ControllingSharedControllingUnitLookupProviderService);
	private readonly roundingService = BasicsSharedRoundingFactoryService.getService(roundingModule.basicsMaterial);
	private readonly lookupLayoutService = inject(BasicsSharedLookupLayoutService);
	private readonly platformPinningContextService = inject(PlatformPinningContextService);

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IPesItemEntity>> {
		const controllingUnitOverload = await this.controllingUnitLookupProvider.generateControllingUnitLookup<IPesItemEntity>(context, {
			checkIsAccountingElement: true,
			projectGetter: (e) => e.ProjectFk,
			controllingUnitGetter: (e) => e.ControllingUnitFk,
			lookupOptions: {
				showClearButton: true,
				serverSideFilter: {
					key: 'prc.con.controllingunit.by.prj.filterkey',
					execute: (context) => {
						return {
							ByStructure: true,
							ExtraFilter: true,
							PrjProjectFk: context.entity?.ProjectFk,
						};
					},
				},
			},
		});

		controllingUnitOverload.additionalFields = [
			{
				id: 'controllingUnitDescription',
				displayMember: 'DescriptionInfo.Translated',
				label: {
					key: 'cloud.common.entityControllingUnitDesc',
				},
				column: true,
				singleRow: true,
			},
		];

		const layout = <ILayoutConfiguration<IPesItemEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'QuantityRemaining',
						'QuantityContractedConverted',
						'QuantityDeliveredConverted',
						'QuantityRemainingConverted',
						'QuantityConverted',
						'PercentageQuantity',
						'QuantityContractedAccepted',
						'Co2Project',
						'Co2ProjectTotal',
						'Co2Source',
						'Co2SourceTotal',
						'ConHeaderFk',
						'PrcItemFk',
						'ItemNo',
						'QuantityContracted',
						'QuantityDelivered',
						'QuantityAskedFor',
						'Quantity',
						'UomFk',
						'Price',
						'PrcPackageFk',
						'ProjectFk',
						'ControllingUnitFk',
						'PrcStructureFk',
						'BatchNo',
						'PrcStockTransactionTypeFk',
						'PrjStockFk',
						'PrjStockLocationFk',
						'LotNo',
						'ProvisionPercent',
						'ProvisonTotal',
						'PrcStockTransactionFk',
						'IsFinalDelivery',
						'PriceOc',
						'PriceExtra',
						'PriceExtraOc',
						'PrcPriceConditionFk',
						'MdcMaterialFk',
						'Description1',
						'Description2',
						'MdcTaxCodeFk',
						'IsAssetManagement',
						'ControllinggrpsetFk',
						'FixedAssetFk',
						'DiscountSplit',
						'DiscountSplitOc',
						'PriceGross',
						'PriceGrossOc',
						'Total',
						'TotalOc',
						'TotalGross',
						'TotalGrossOc',
						'TotalPrice',
						'TotalPriceOc',
						'ExternalCode',
						'MaterialExternalCode',
						'TotalPriceGross',
						'TotalPriceGrossOc',
						'ExpirationDate',
						'AlternativeUomFk',
						'AlternativeQuantity',
						'TotalDelivered',
						'TotalOcDelivered',
						'BudgetPerUnit',
						'BudgetTotal',
						'BudgetFixedUnit',
						'BudgetFixedTotal',
						'MdcSalesTaxGroupFk',
						'StandardCost',
						'MaterialStockFk',
						'Vat',
						'VatOC',
						'TotalStandardCost',
						'InvoiceQuantity',
						'CumulativeInvoicedQuantity',
						'Specification',
					],
				},
				{
					gid: 'projectChange',
					title: {
						key: 'procurement.common.projectChange',
						text: 'Project Change',
					},
					attributes: ['PrjChangeFk', 'PrjChangeStatusFk'],
				},
				{
					gid: 'userDefinedFields',
					title: {
						key: 'procurement.pes.entityUserDefinedFields',
						text: 'User Defined Fields',
					},
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.pes.', {
					QuantityRemaining: {
						key: 'entityRemainingQuantity',
						text: 'Remaining Quantity',
					},
					QuantityContractedConverted: {
						key: 'entityFactoredQuantityContracted',
						text: 'Factored Contracted Quantity',
					},
					QuantityDeliveredConverted: {
						key: 'entityFactoredQuantityDelivered',
						text: 'Factored Delivered Quantity',
					},
					QuantityRemainingConverted: {
						key: 'entityFactoredRemainingQuantity',
						text: 'Factored Remaining Quantity',
					},
					QuantityConverted: {
						key: 'entityFactoredQuantityConfirmed',
						text: 'Factored Quantity Confirmed',
					},
					PercentageQuantity: {
						key: 'percentageQuantity',
						text: 'Percentage Quantity(%)',
					},
					QuantityContractedAccepted: {
						key: 'entityQuantityContractedAccepted',
						text: 'Contracted Quantity (Approved)',
					},
					Co2Project: {
						key: 'entityCo2Project',
						text: 'CO2/kg (Project)',
					},
					Co2ProjectTotal: {
						key: 'entityCo2ProjectTotal',
						text: 'CO2/kg (Project Total)',
					},
					Co2Source: {
						key: 'entityCo2Source',
						text: 'CO2/kg (Source)',
					},
					Co2SourceTotal: {
						key: 'entityCo2SourceTotal',
						text: 'CO2/kg (Source Total)',
					},
					ConHeaderFk: {
						key: 'entityConHeaderFk',
						text: 'Contract',
					},
					PrcItemFk: {
						key: 'entityPrcItemFk',
						text: 'Contract Item',
					},
					ItemNo: {
						key: 'entityItemNo',
						text: 'Item No.',
					},
					QuantityContracted: {
						key: 'entityQuantityContracted',
						text: 'Contracted Quantity',
					},
					QuantityDelivered: {
						key: 'entityQuantityDelivered',
						text: 'Delivered Quantity',
					},
					QuantityAskedFor: {
						key: 'entityQuantityAskedFor',
						text: 'Quantity Asked For',
					},
					Quantity: {
						key: 'transaction.quantity',
						text: 'Quantity',
					},
					PrcPackageFk: {
						key: 'entityPackageFk',
						text: 'Package',
					},
					BatchNo: {
						key: 'entityBatchNo',
						text: 'Batch No.',
					},
					IsFinalDelivery: {
						key: 'entityIsFinalDelivery',
						text: 'Is Final Delivery',
					},
					PriceOc: {
						key: 'entityPriceOc',
						text: 'Price(OC)',
					},
					MdcMaterialFk: {
						key: 'entityMaterialFk',
						text: 'Material No.',
					},
					IsAssetManagement: {
						key: 'entityIsAssetmanagement',
						text: 'Is Assetmanagement',
					},
					TotalDelivered: {
						key: 'entityDeliveredTotal',
						text: 'Delivered Total',
					},
					TotalOcDelivered: {
						key: 'entityDeliveredTotalOc',
						text: 'Delivered Total OC',
					},
					MaterialStockFk: {
						key: 'entityStockMaterial',
						text: 'Stock Material',
					},
					Vat: {
						key: 'entityPesVat',
						text: 'VAT',
					},
					VatOC: {
						key: 'entityPesVatOc',
						text: 'VAT(OC)',
					},
					TotalStandardCost: {
						key: 'entityTotalStandardCost',
						text: 'Total Standard Cost',
					},
					InvoiceQuantity: {
						key: 'entityInvoiceQuantity',
						text: 'Invoice Quantity',
					},
					CumulativeInvoicedQuantity: {
						key: 'entityCumulativeInvoicedQuantity',
						text: 'Cumulative Invoiced Quantity',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					UomFk: {
						key: 'entityUoM',
						text: 'UoM',
					},
					Price: {
						key: 'entityPrice',
						text: 'Price',
					},
					ProjectFk: {
						key: 'entityProjectNo',
						text: 'Project No.',
					},
					ControllingUnitFk: {
						key: 'entityControllingUnitCode',
						text: 'Controlling Unit Code',
					},
					PrcStructureFk: {
						key: 'entityStructureCode',
						text: 'Structure Code',
					},
					UserDefined1: {
						key: 'entityUserDefined',
						text: 'User-Defined 1',
						params: { p_0: '1' },
					},
					UserDefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					UserDefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					UserDefined4: {
						key: 'entityUserDefined',
						text: 'User-Defined 4',
						params: { p_0: '4' },
					},
					UserDefined5: {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: { p_0: '5' },
					},
					PrcPriceConditionFk: {
						key: 'entityPriceCondition',
						text: 'Price Condition',
					},
					MdcTaxCodeFk: {
						key: 'entityTaxCode',
						text: 'Tax Code',
					},
					ControllinggrpsetFk: {
						key: 'entityControllinggrpset',
						text: 'Controlling Group Set',
					},
					FixedAssetFk: {
						key: 'entityFixedAsset',
						text: 'Fixed Asset',
					},
					Total: {
						key: 'entityTotal',
						text: 'Total',
					},
					Specification: {
						key: 'EntitySpec',
					},
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					MdcSalesTaxGroupFk: {
						key: 'entityMdcSalesTaxGroupFk',
						text: 'Sales Tax Group',
					},
					PrcStockTransactionTypeFk: {
						key: 'entityPrcStockTransactionType',
						text: 'Stock Transaction Type',
					},
					PrjStockFk: {
						key: 'transaction.prjStockFk',
						text: 'Stock Code',
					},
					PrjStockLocationFk: {
						key: 'transaction.prjStocklocationFk',
						text: 'Stock Location',
					},
					LotNo: {
						key: 'entityLotNo',
						text: 'Lot No.',
					},
					ProvisionPercent: {
						key: 'entityProvisionPercent',
						text: 'Provision Percent',
					},
					ProvisonTotal: {
						key: 'entityProvisonTotal',
						text: 'Provision Total',
					},
					PrcStockTransactionFk: {
						key: 'entityPrcStockTransaction',
						text: 'Stock Transaction',
					},
					PriceExtra: {
						key: 'prcItemPriceExtras',
						text: 'Price Extras',
					},
					PriceExtraOc: {
						key: 'prcItemPriceExtrasCurrency',
						text: 'Price Extras (Currency)',
					},
					Description1: {
						key: 'prcItemDescription1',
						text: 'Description 1',
					},
					Description2: {
						key: 'prcItemFurtherDescription',
						text: 'Further Description',
					},
					DiscountSplit: {
						key: 'DiscountSplitEntity',
						text: 'Discount Split',
					},
					DiscountSplitOc: {
						key: 'DiscountSplitOcEntity',
						text: 'Discount Split Oc',
					},
					PriceGross: {
						key: 'priceGross',
						text: 'Price Gross',
					},
					PriceGrossOc: {
						key: 'priceOcGross',
						text: 'Price Gross(OC)',
					},
					TotalOc: {
						key: 'prcItemTotalCurrency',
						text: 'Total (Currency)',
					},
					TotalGross: {
						key: 'totalGross',
						text: 'Total (Gross)',
					},
					TotalGrossOc: {
						key: 'totalOcGross',
						text: 'Total (Gross OC)',
					},
					TotalPrice: {
						key: 'prcItemTotalPrice',
						text: 'Total Price',
					},
					TotalPriceOc: {
						key: 'prcItemTotalPriceCurrency',
						text: 'Total Price (Currency)',
					},
					ExternalCode: {
						key: 'externalCode',
						text: 'External Code',
					},
					MaterialExternalCode: {
						key: 'prcItemMaterialExternalCode',
						text: 'Material External Code',
					},
					TotalPriceGross: {
						key: 'totalPriceGross',
						text: 'Total Price Gross',
					},
					TotalPriceGrossOc: {
						key: 'totalPriceGrossOc',
						text: 'Total Price Gross(OC)',
					},
					ExpirationDate: {
						key: 'ExpirationDate',
						text: 'Expiration Date',
					},
					AlternativeUomFk: {
						key: 'AlternativeUom',
						text: 'Alternative Uom',
					},
					AlternativeQuantity: {
						key: 'AlternativeQuantity',
						text: 'Alternative Quantity',
					},
					BudgetPerUnit: {
						key: 'entityBudgetPerUnit',
						text: 'Budget Per Unit',
					},
					BudgetTotal: {
						key: 'entityBudgetTotal',
						text: 'Budget Total',
					},
					BudgetFixedUnit: {
						key: 'entityBudgetFixedUnit',
						text: 'Budget Fixed Unit',
					},
					BudgetFixedTotal: {
						key: 'entityBudgetFixedTotal',
						text: 'Budget Fixed Total',
					},
					StandardCost: {
						key: 'entityStandardCost',
						text: 'Standard Cost',
					},
					PrjChangeFk: {
						key: 'projectChange',
						text: 'Project Change',
					},
					PrjChangeStatusFk: {
						key: 'projectChangeStatus',
						text: 'Project Change Status',
					},
				}),
			},
			overloads: {
				QuantityRemaining: {
					readonly: true,
				},
				QuantityContractedConverted: {
					readonly: true,
				},
				QuantityDeliveredConverted: {
					readonly: true,
				},
				QuantityRemainingConverted: {
					readonly: true,
				},
				QuantityConverted: {
					readonly: true,
				},
				QuantityContractedAccepted: {
					readonly: true,
				},
				QuantityContracted: {
					readonly: true,
				},
				QuantityDelivered: {
					readonly: true,
				},
				PriceExtra: {
					readonly: true,
				},
				PriceExtraOc: {
					readonly: true,
				},
				DiscountSplit: {
					readonly: true,
				},
				DiscountSplitOc: {
					readonly: true,
				},
				Total: {
					readonly: true,
				},
				TotalOc: {
					readonly: true,
				},
				TotalPrice: {
					readonly: true,
				},
				TotalPriceOc: {
					readonly: true,
				},
				TotalPriceGross: {
					readonly: true,
				},
				TotalPriceGrossOc: {
					readonly: true,
				},
				TotalDelivered: {
					readonly: true,
				},
				TotalOcDelivered: {
					readonly: true,
				},
				MaterialStockFk: {
					readonly: true,
				},
				Vat: {
					readonly: true,
					type: FieldType.Money,
				},
				VatOC: {
					readonly: true,
					type: FieldType.Money,
				},
				TotalStandardCost: {
					readonly: true,
					type: FieldType.Money,
				},
				CumulativeInvoicedQuantity: {
					readonly: true,
				},
				ConHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'procurement.pes.entityConHeaderDescription', false, {
					key: 'procurement-pes-item-contract-filter',
					execute: (context) => {
						const pesHeader = this.dataService.currentPesHeader;
						const pesItem = context.entity!;

						return {
							StatusIsInvoiced: false,
							StatusIsCanceled: false,
							StatusIsVirtual: false,
							StatusIsOrdered: true,
							prcItemStatusIsCanceled: false,
							IsFramework: false,
							BusinessPartnerFk: pesHeader.BusinessPartnerFk,
							ControllingUnit: pesItem.ControllingUnitFk,
							PrcPackageFk: pesItem.PrcPackageFk,
							PrcStructureFk: pesItem.PrcStructureFk,
							ProjectFk: pesItem.ProjectFk,
							PrcConfigurationRelatedPesHeaderId: pesItem.PesHeaderFk,
						};
					},
				}),
				PrcItemFk: ProcurementSharedLookupOverloadProvider.providePrcItemFkLookupOverload(true, {
					key: 'procurement-pes-item-item-filter',
					execute: (context) => {
						return {
							IsCanceled: false,
							ContractId: context.entity!.ConHeaderFk,
							PesHeaderId: context.entity!.PesHeaderFk,
						};
					},
				}),
				MdcMaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
				// Todo - materialstockfk, waiting for material stock lookup
				MdcTaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				AlternativeUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(false),
				ProjectFk: {
					...this.projectLookupProvider.generateProjectLookup(),
					additionalFields: [
						{
							id: 'projectDescription',
							displayMember: 'ProjectName',
							label: {
								key: 'cloud.common.entityProjectName',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				PrcPackageFk: {
					...ProcurementSharedLookupOverloadProvider.providePackageLookupOverload(true, 'Description', {
						key: 'procurement-pes-item-package-filter',
						execute: (context) => {
							return {
								ProjectFk: context.entity?.ProjectFk ?? this.platformPinningContextService.getPinningContextForModule('project.main')?.Id,
							};
						},
					}),
					...{
						additionalFields: [
							{
								id: 'packageDescription',
								displayMember: 'Description',
								label: {
									key: 'cloud.common.entityPackageDescription',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				ControllingUnitFk: controllingUnitOverload,
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				MdcSalesTaxGroupFk: ProcurementSharedLookupOverloadProvider.provideProcurementSalesTaxGroupLookupOverload(true),
				Price: {
					// Todo - procument-pes-item-highlight-cell-input
					// Todo - grid formatter, highlightColumn
					// wait for framework: https://rib-40.atlassian.net/browse/DEV-19395
				},
				PriceOc: {},
				PriceGross: {},
				PriceGrossOc: {},
				PrjStockFk: ProjectSharedLookupOverloadProvider.provideProjectStockOptionLookupOverload({
					showClearButton: true,
					readonly: false,
					serverSideFilter: {
						key: 'procurement-pes-item-stock-type-filter',
						execute: (context) => {
							const pesItem = context.entity!;
							const pesHeader = this.dataService.currentPesHeader;

							return {
								PKey2: pesItem.MaterialStockFk ?? pesItem.MdcMaterialFk,
								PKey3: pesHeader.ProjectFk,
							};
						},
					},
					clientSideFilter: {
						execute: (item) => {
							return item.IsProcurement;
						},
					},
				}),
				PrjStockLocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationOptionLookupOverload({
					showClearButton: true,
				}),
				PrcStockTransactionTypeFk: ProcurementSharedLookupOverloadProvider.providePrcStockTransactionTypeLookupOverload(true, {
					key: 'procurement-pes-item-transactiontype-filter',
					execute: (context) => {
						const pesHeader = this.dataService.currentPesHeader;
						return 'PrcConfiguration=' + pesHeader.PrcConfigurationFk;
					},
				}),
				PrcStockTransactionFk: ProcurementSharedLookupOverloadProvider.providePrcStockTransactionLookupOverload(true, {
					key: 'procurement-pes-item-transaction-filter',
					execute: (context) => {
						const pesItem = context.entity!;
						return {
							PrjStockFk: pesItem.PrjStockFk,
							MdcMaterialFk: pesItem.MdcMaterialFk,
						};
					},
				}),
				PrcPriceConditionFk: BasicsSharedLookupOverloadProvider.providePriceConditionLookupOverload(true),
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
				FixedAssetFk: ProcurementSharedLookupOverloadProvider.provideProcurementFixedAssetLookupOverload(true, (e) => e.IsAssetManagement),
				PrjChangeFk: ProcurementSharedLookupOverloadProvider.providePrjChangeFkLookupOverload(false),
				PrjChangeStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectChangeStatusLookupOverload(true),
			},
			transientFields: [
				...this.createTransientFieldFromPrcItemOrMaterial([
					{ id: 'Co2Project', type: FieldType.Money },
					{ id: 'Co2Source', type: FieldType.Money },
				]),
				...this.createTransientFieldFromPrcItem([
					{ id: 'Co2ProjectTotal', type: FieldType.Money },
					{ id: 'Co2SourceTotal', type: FieldType.Money },
					{ id: 'Specification', type: FieldType.Description },
				]),
			],
		};

		this.roundingService.uiRoundingConfig(layout);

		return layout;
	}

	private createTransientFieldFromPrcItem(fields: TransientFieldSpec<IPesItemEntity>[]) {
		return fields.map((field) => {
			return {
				...field,
				model: {
					getValue: (entity: IPesItemEntity) => {
						if (entity.PrcItemFk) {
							return this.lookupLayoutService.getLookupTransientFieldValue(entity.PrcItemFk, ProcurementSharedPrcItemMergedLookupService, field.id, this.dataService, entity);
						}
						return null;
					},
				},
			};
		});
	}

	private createTransientFieldFromPrcItemOrMaterial(fields: TransientFieldSpec<IPesItemEntity>[]) {
		return fields.map((field) => {
			return {
				...field,
				readonly: true,
				model: {
					getValue: (entity: IPesItemEntity) => {
						if (entity.PrcItemFk) {
							return this.lookupLayoutService.getLookupTransientFieldValue(entity.PrcItemFk, ProcurementSharedPrcItemMergedLookupService, field.id, this.dataService, entity);
						} else if (!isNil(entity.MdcMaterialFk)) {
							return this.lookupLayoutService.getLookupTransientFieldValue(entity.MdcMaterialFk, BasicsSharedMaterialLookupService, field.id, this.dataService, entity);
						}

						return null;
					},
				},
			};
		});
	}
}
