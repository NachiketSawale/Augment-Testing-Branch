/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { inject } from '@angular/core';
import { IStockTransactionEntity } from '../../model/entities/stock-transaction-entity.interface';
import { ProcurementStockTransactionDataService } from '../procurement-stock-transaction-data.service';
import { ProcurementStockTotalDataService } from '../procurement-stock-total-data.service';

export class ProcurementStockTransactionReadonlyProcessor extends EntityReadonlyProcessorBase<IStockTransactionEntity> {

	private readonly parentDataService = inject(ProcurementStockTotalDataService);

	public constructor(protected dataService: ProcurementStockTransactionDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IStockTransactionEntity> {
		return {
			PesItemFk: {
				shared: ['Inv2contractFk', 'PrjStockFk', 'MdcMaterialFk'],
				readonly: this.readonlyPesItemFk,
			},
			ProvisionPercent: {
				shared: ['ProvisionTotal'],
				readonly: this.readonlyProvisionPercent,
			},
			PrjStocklocationFk: (e) => this.readonlyStockLocationFk(e),
			BasUomFk: (e) => this.readonlyBasUomFkFk(e),
			Total: (e) => this.readonlyTotal(e),
			PrcStocktransactionFk: (e) => this.readonlyStocktransactionFk(e),
			Quantity: (e) => this.readonlyQuantity(e),
		};
	}

	protected readonlyPesItemFk(info: ReadonlyInfo<IStockTransactionEntity>) {
		return false;
	}

	protected override readonlyEntity(entity: IStockTransactionEntity): boolean {
		if(this.dataService.isTransactionReadOnly()){
			return true;
		}
		const parentEntity = this.parentDataService.getSelectedEntity();
		if (!parentEntity || !parentEntity.IsCurrentCompany || parentEntity.InDownTime) {
			return true;
		}

		const transType = this.dataService.transactionTypeLookupService.cache.getItem({ id: entity.PrcStocktransactiontypeFk });
		return !transType || !transType.IsAllowedManual;
	}

	protected readonlyStockLocationFk(info: ReadonlyInfo<IStockTransactionEntity>): boolean {
		const entity = info.item;
		if(entity.Version === 0){
			return false;
		}

		const transType = this.dataService.transactionTypeLookupService.cache.getItem({id:entity.PrcStocktransactiontypeFk});
		return transType?.IsConsumed ?? false;
	}

	protected readonlyBasUomFkFk(info: ReadonlyInfo<IStockTransactionEntity>): boolean {
		const entity = info.item;
		return !!entity.MdcMaterialFk;
	}

	protected readonlyTotal(info: ReadonlyInfo<IStockTransactionEntity>): boolean {
		const entity = info.item;
		const transType = this.dataService.transactionTypeLookupService.cache.getItem({ id: entity.PrcStocktransactiontypeFk });
		if (!transType) {
			return true;
		}
		return !(transType.IsReceipt || transType.IsProvision || (transType.IsDelta && transType.IsReceipt));
	}

	protected readonlyProvisionPercent(info: ReadonlyInfo<IStockTransactionEntity>): boolean {
		const transType = this.dataService.transactionTypeLookupService.cache.getItem({ id: info.item.PrcStocktransactiontypeFk });
		return !transType?.IsReceipt ?? true;
	}

	protected readonlyStocktransactionFk(info: ReadonlyInfo<IStockTransactionEntity>): boolean {
		const entity = info.item;
		const transType = this.dataService.transactionTypeLookupService.cache.getItem({ id: entity.PrcStocktransactiontypeFk });
		if (!transType) {
			return true;
		}
		return !(transType.IsProvision || transType.IsDelta);
	}

	protected readonlyQuantity(info: ReadonlyInfo<IStockTransactionEntity>): boolean {
		const entity = info.item;
		const transType = this.dataService.transactionTypeLookupService.cache.getItem({ id: entity.PrcStocktransactiontypeFk });
		if (!transType) {
			return true;
		}
		return transType.IsDelta && transType.IsConsumed;
	}
}
