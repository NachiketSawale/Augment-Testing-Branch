/*
 * Copyright(c) RIB Software GmbH
 */

import { AsyncReadonlyFunctions, BasItemType, EntityAsyncReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { IPesItemEntity } from '../../model/entities';
import { ProcurementPesItemDataService } from '../procurement-pes-item-data.service';
import { PrcStockTransactionType } from '@libs/procurement/shared';
import { firstValueFrom } from 'rxjs';

export class ProcurementPesItemReadonlyProcessor extends EntityAsyncReadonlyProcessorBase<IPesItemEntity> {
	public constructor(private dataService: ProcurementPesItemDataService) {
		super(dataService);
	}

	protected override async readonlyEntityAsync(item: IPesItemEntity): Promise<boolean> {
		return await this.dataService.checkPesHeaderReadonly();
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<IPesItemEntity> {
		return {
			PrcItemFk: (info) => !info.item.ConHeaderFk,
			UomFk: (info) => !!info.item.MdcMaterialFk || !!info.item.PrcItemFk,
			AlternativeUomFk: (info) => !info.item.Material2Uoms,
			FixedAssetFk: (info) => !info.item.IsAssetManagement,
			BudgetPerUnit: {
				shared: ['BudgetTotal', 'BudgetFixedUnit', 'BudgetFixedTotal'],
				readonly: () => true,
			},
			TotalGross: {
				shared: ['TotalGrossOc'],
				readonly: () => !this.dataService.isCalculateOverGross,
			},
			ConHeaderFk: (info) => {
				const pesHeader = this.dataService.currentPesHeader;
				const result = !!pesHeader.ConHeaderFk && pesHeader.ConfigHeaderIsConsolidateChange;
				return result === null ? undefined : result;
			},
			Price: {
				shared: ['PriceOc', 'PriceGross', 'PriceGrossOc'],
				readonly: (info) => !!info.item.PrcItemFk,
			},
			MdcMaterialFk: {
				shared: ['Description1', 'Description2'],
				readonly: (info) => {
					return !!info.item.PrcItemFk || info.item.HasDuplicatedContractedPesItem;
				},
			},
		};
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<IPesItemEntity> {
		return {
			ItemNo: {
				shared: ['Description1', 'Description2', 'PrcItemSpecification', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				readonly: async (info) => {
					const prcItem = await this.dataService.loadPrcItem(info.item);

					if (prcItem?.BasItemTypeFk === BasItemType.TextElement) {
						return false;
					}

					return undefined;
				},
				makeOthersOpposite: true,
			},
			PrjStockFk: {
				shared: ['PrcStockTransactionTypeFk', 'PrcStockTransactionFk', 'PrjStockLocationFk', 'ProvisionPercent', 'ProvisonTotal', 'LotNo', 'ExpirationDate'],
				readonly: async (info) => {
					if (info.item.PrjStockFk) {
						return false;
					}

					const result = await this.dataService.getPrjStockResult(info.item);
					return !result.PrjStockFk;
				},
			},
			PrcStockTransactionFk: async (info) => {
				const item = info.item;

				if (!item.PrcStockTransactionTypeFk) {
					return undefined;
				}

				let readonly = true;

				switch (item.PrcStockTransactionTypeFk) {
					case PrcStockTransactionType.MaterialReceipt:
						{
							const result = await this.dataService.loadProjectStocks([item]);
							readonly = !result[0].IsInStock2Material;
						}
						break;
					case PrcStockTransactionType.IncidentalAcquisitionExpense:
						readonly = false;
						break;
					default: {
						const type = this.dataService.prcStockTransactionTypeLookupService.cache.getItem({ id: item.PrcStockTransactionTypeFk });
						readonly = !type!.IsDelta;
					}
				}

				return readonly;
			},
			ProvisionPercent: {
				shared: ['ProvisonTotal'],
				readonly: async (info) => {
					if (!info.item.PrjStockFk) {
						return true;
					}

					const results = await this.dataService.loadProvisionsAllowed([info.item]);
					return results[0].isReadonly;
				},
			},
			IsAssetManagement: async (info) => {
				if (info.item.ControllingUnitFk) {
					const controllingUnit = await firstValueFrom(this.dataService.controllingUnitLookupService.getItemByKey({ id: info.item.ControllingUnitFk }));
					return controllingUnit.Isassetmanagement;
				}

				return true;
			},
		};
	}
}
