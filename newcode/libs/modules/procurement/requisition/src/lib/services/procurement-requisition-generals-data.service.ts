/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcGeneralsEntity, PrcCreateContext, ProcurementCommonGeneralsDataService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Requisition Generals data service
 */
export class ProcurementRequisitionGeneralsDataService extends ProcurementCommonGeneralsDataService<IPrcGeneralsEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {

	public constructor(protected contractDataService: ProcurementRequisitionHeaderDataService) {
		super(contractDataService, {});
	}

	public override getHeaderContext() {
		return this.contractDataService.getHeaderContext();
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: ReqHeaderCompleteEntity, modified: IPrcGeneralsEntity[], deleted: IPrcGeneralsEntity[]): void {
		if (modified?.some(() => true)) {
			parentUpdate.PrcGeneralsToSave = modified;
		}
		if (deleted?.some(() => true)) {
			parentUpdate.PrcGeneralsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: ReqHeaderCompleteEntity): IPrcGeneralsEntity[] {
		if (parentUpdate?.PrcGeneralsToSave) {
			return parentUpdate.PrcGeneralsToSave;
		}
		return [];
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcGeneralsEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}

	protected override provideCreatePayload(): PrcCreateContext {
		const headerContext = this.getHeaderContext();
		return {
			MainItemId: headerContext.prcHeaderFk,
			PrcConfigFk: headerContext.prcConfigFk,
			StructureFk: headerContext.structureFk,
			ProjectFk: headerContext.projectFk
		};
	}

}