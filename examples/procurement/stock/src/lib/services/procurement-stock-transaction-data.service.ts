/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { IStockTotalVEntity, StockComplete } from '../model';
import { BasicsSharedPrcStockTransactionTypeLookupService, BasicsSharedSystemOptionLookupService, MainDataDto } from '@libs/basics/shared';
import { IStockTransactionEntity } from '../model/entities/stock-transaction-entity.interface';
import { ProcurementStockTotalDataService } from './procurement-stock-total-data.service';
import { BasicsCustomizeSystemOption } from '@libs/basics/interfaces';
import { ProcurementStockTransactionReadonlyProcessor } from './processors/procurement-stock-transaction-readonly-processor.class';

/**
 * Procurement stock transaction data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTransactionDataService extends DataServiceFlatLeaf<IStockTransactionEntity, IStockTotalVEntity, StockComplete> {
	private readonly systemOptionLookupService = inject(BasicsSharedSystemOptionLookupService);
	public readonly transactionTypeLookupService = inject(BasicsSharedPrcStockTransactionTypeLookupService);
	public readonly readonlyProcessor: ProcurementStockTransactionReadonlyProcessor;

	protected constructor(protected parentService: ProcurementStockTotalDataService) {
		const options: IDataServiceOptions<IStockTransactionEntity> = {
			apiUrl: 'procurement/stock/transaction',
			readInfo: {
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<IStockTransactionEntity, IStockTotalVEntity, StockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Transaction',
				parent: parentService,
			},
			createInfo: {
				endPoint: 'create',
				usePost: true,
			},
		};

		super(options);

		this.readonlyProcessor = this.createReadonlyProcessor();
		this.processor.addProcessor(this.readonlyProcessor);
	}

	protected createReadonlyProcessor() {
		return new ProcurementStockTransactionReadonlyProcessor(this);
	}

	protected override provideLoadPayload(): object {
		const parent = this.parentService.getSelectedEntity();
		if (parent) {
			const params = {
				mainItemId: this.getMainItemId(parent),
				mdcMaterialFk: parent.MdcMaterialFk,
				productKf: parent.ProductFk ?? -1,
			};

			return params;
		} else {
			throw new Error('There should be a selected stock total');
		}
	}

	protected override onLoadSucceeded(loaded: object): IStockTransactionEntity[] {
		return new MainDataDto<IStockTransactionEntity>(loaded).Main;
	}

	protected override provideCreatePayload(): object {
		const selected = this.getSelectedParent();
		if (selected) {
			return {
				mdcMaterialFk: selected.MdcMaterialFk,
				productKf: selected.ProductFk ?? -1,//todo-The framework should enhance support null values The current -1 is for compilation
				prjStockFk: selected.PrjStockFk,
			};
		} else {
			throw new Error('There should be a selected stock total');
		}
	}

	protected override onCreateSucceeded(created: object): IStockTransactionEntity {
		return created as unknown as IStockTransactionEntity;
	}

	protected getMainItemId(parent: IStockTotalVEntity): number {
		return parent.PrjStockFk;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: StockComplete, modified: IStockTransactionEntity[], deleted: IStockTransactionEntity[]): void {
		const parent = this.getSelectedParent();
		if (!parent) {
			return;
		}
		if (modified?.some(() => true)) {
			const transComplete = { TransactionToSave: modified, MainItemId: parent.PrjStockFk };
			parentUpdate.StockTotalVToSave = [transComplete];
		}

		if (deleted?.some(() => true)) {
			const deleteComplete = { TransactionToDelete: modified, MainItemId: parent.PrjStockFk };
			parentUpdate.StockTotalVToSave = [deleteComplete];
		}
	}

	public override getSavedEntitiesFromUpdate(complete: StockComplete): IStockTransactionEntity[] {
		if (complete && complete.StockTotalVToSave && complete.StockTotalVToSave.length > 0) {
			return complete.StockTotalVToSave[0].TransactionToSave || [];
		}

		return [];
	}

	public override isParentFn(parentKey: IStockTotalVEntity, entity: IStockTransactionEntity) {
		return entity.PrjStockFk === parentKey.PrjStockFk;
	}

	public override canDelete(): boolean {
		const selected = this.getSelectedEntity();
		if (!selected || !super.canDelete() || this.isTransactionReadOnly() || !this.isParentEntityCreatable()) {
			return false;
		}
		const transType = this.transactionTypeLookupService.cache.getItem({ id: selected.PrcStocktransactiontypeFk });
		return transType?.IsAllowedManual ?? false;
	}

	public override canCreate(): boolean {
		if (!super.canCreate() || this.isTransactionReadOnly()) {
			return false;
		}
		return this.isParentEntityCreatable();
	}

	public isTransactionReadOnly() {
		const sysOpt = this.systemOptionLookupService.syncService?.getListSync().find((item: { Id: number }) => {
			return item.Id === BasicsCustomizeSystemOption.SetStockTransactionReadOnly;
		});
		return sysOpt ? sysOpt.ParameterValue === '1' || sysOpt.ParameterValue.toLowerCase() === 'true' : false;
	}

	public canRecalculate() {
		const parentSelected = this.parentService.getSelectedEntity();
		if (!parentSelected || this.isTransactionReadOnly()) {
			return false;
		}
		return parentSelected.IsCurrentCompany && !parentSelected.InDownTime;
	}

	private isParentEntityCreatable(): boolean {
		const parentSelected = this.parentService.getSelectedEntity();
		if (parentSelected) {
			const isCurrentCompany = parentSelected.IsCurrentCompany ?? false;
			const inDownTime = parentSelected.InDownTime ?? false;
			return isCurrentCompany && !inDownTime;
		}
		return true;
	}
}
