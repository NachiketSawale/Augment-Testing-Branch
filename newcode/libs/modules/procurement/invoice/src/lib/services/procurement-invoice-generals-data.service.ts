/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcGeneralsEntity, ProcurementCommonGeneralsDataService } from '@libs/procurement/common';
import { IInvHeaderEntity } from '../model/entities';
import { InvComplete } from '../model';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Invoice Generals data service
 */
export class ProcurementInvoiceGeneralsDataService extends ProcurementCommonGeneralsDataService<IPrcGeneralsEntity, IInvHeaderEntity, InvComplete> {

	protected override createReloadUrl: string = 'procurement/invoice/general/reloadbybp';

	public constructor(protected InvoiceDataService: ProcurementInvoiceHeaderDataService) {
		super(InvoiceDataService, {
			apiUrl: 'procurement/invoice/general',
			itemName: 'InvGenerals',
		});
	}

	public override controllingUnitSideFilterValue(): object {
		const header = this.getSelectedParent();
		return {
			PrjProjectFk: header?.ProjectFk,
			ExtraFilter: true,
			ByStructure: true,
			CompanyFk: null
		};
	}

	public getParentEntity() {
		return this.getSelectedParent();
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: InvComplete, modified: IPrcGeneralsEntity[], deleted: IPrcGeneralsEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.InvGeneralsToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.InvGeneralsToDelete = deleted;
		}
	}

	public override isParentFn(parentKey: IInvHeaderEntity, entity: IPrcGeneralsEntity): boolean {
		return entity.InvHeaderFk === parentKey.Id;
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: InvComplete): IPrcGeneralsEntity[] {
		if (parentUpdate && parentUpdate.InvGeneralsToSave) {
			return parentUpdate.InvGeneralsToSave;
		}

		return [];
	}

	public deleteAll(){
		const entities = this.getList();
		this.delete(entities);
	}

	protected override provideLoadPayload(): object {
		return this.getMainItemIdPayload();
	}

	protected override provideCreatePayload(): object {
		return this.getMainItemIdPayload();
	}

	private getMainItemIdPayload(): object {
		const selectedParent = this.getSelectedParent();
		if (selectedParent) {
			const invHeaderFk = selectedParent.Id;
			return {mainItemId: invHeaderFk};
		}
		throw new Error('Should have selected parent entity');
	}

}