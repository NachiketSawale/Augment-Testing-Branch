/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IPrcMilestoneEntity, ProcurementCommonMileStoneDataService } from '@libs/procurement/common';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

/**
 * MileStone service in Requisition
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionMileStoneDataService extends ProcurementCommonMileStoneDataService<IPrcMilestoneEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(protected override readonly parentService: ProcurementRequisitionHeaderDataService) {
		super(parentService);
	}

	protected getMainItemId(parent: IReqHeaderEntity) {
		return parent.PrcHeaderFk;
	}

	protected getProjectId(parent: IReqHeaderEntity) {
		return parent.ProjectFk!;
	}

	protected getModuleName(): string {
		return ProcurementModule.Requisition.toLowerCase();
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcMilestoneEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
