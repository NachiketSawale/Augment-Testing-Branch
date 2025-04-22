/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IProcurementCommonEventsEntity, ProcurementCommonEventsDataService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

/**
 * events service in requisition
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionEventDataService extends ProcurementCommonEventsDataService<IProcurementCommonEventsEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	/**
	 * The constructor
	 */
	public constructor() {
		const parentService = inject(ProcurementRequisitionHeaderDataService);
		super(parentService);
	}

	protected getPackageFk(parent: IReqHeaderEntity): number {
		if (parent?.PackageFk) {
			return parent.PackageFk;
		}
		throw new Error('Should have selected parent entity');
	}

	protected isReadonly(): boolean {
		return true;
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IProcurementCommonEventsEntity): boolean {
		return entity.PrcPackageFk === parentKey.PackageFk;
	}
}
