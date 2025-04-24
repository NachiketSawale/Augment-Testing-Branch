/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcGeneralsEntity, PrcCreateContext, ProcurementCommonGeneralsDataService } from '@libs/procurement/common';
import { IConHeaderEntity } from '../model/entities';
import { ContractComplete } from '../model/contract-complete.class';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { ProcurementContractGeneralsReadonlyProcessor } from './processors/procurement-contract-generals-readonly-processor.service';

@Injectable({
	providedIn: 'root',
})

/**
 * Contract Generals data service
 */
export class ProcurementContractGeneralsDataService extends ProcurementCommonGeneralsDataService<IPrcGeneralsEntity, IConHeaderEntity, ContractComplete> {
	public constructor(protected contractDataService: ProcurementContractHeaderDataService) {
		super(contractDataService, {});
	}

	public override getHeaderContext() {
		return this.contractDataService.getHeaderContext();
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public getContract() {
		return this.contractDataService.getSelectedEntity();
	}

	protected override createReadonlyProcessor() {
		return new ProcurementContractGeneralsReadonlyProcessor(this);
	}

	public override registerModificationsToParentUpdate(parentUpdate: ContractComplete, modified: IPrcGeneralsEntity[], deleted: IPrcGeneralsEntity[]): void {
		if (modified && modified.some(() => true)) {
			parentUpdate.PrcGeneralsToSave = modified;
		}
		if (deleted && deleted.some(() => true)) {
			parentUpdate.PrcGeneralsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: ContractComplete): IPrcGeneralsEntity[] {
		if (parentUpdate && parentUpdate.PrcGeneralsToSave) {
			return parentUpdate.PrcGeneralsToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: IConHeaderEntity, entity: IPrcGeneralsEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}

	protected override provideCreatePayload(): PrcCreateContext {
		const headerContext = this.getHeaderContext();
		return {
			MainItemId: headerContext.prcHeaderFk,
			PrcConfigFk: headerContext.prcConfigFk,
			StructureFk: headerContext.structureFk,
			ProjectFk: headerContext.projectFk,
		};
	}
}
