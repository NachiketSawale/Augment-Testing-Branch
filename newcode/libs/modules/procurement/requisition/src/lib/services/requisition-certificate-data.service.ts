/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementCommonCertificateDataService } from '@libs/procurement/common';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { RequisitionTotalDataService } from './requisition-total-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementRequisitionCertificateDataService extends ProcurementCommonCertificateDataService<IPrcCertificateEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(
		protected dataService: ProcurementRequisitionHeaderDataService,
		protected reqTotalDataService: RequisitionTotalDataService,
	) {
		super(dataService, {}, reqTotalDataService);
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcCertificateEntity): boolean {
		return entity.PrcHeaderFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		if (this.getSelectedParent()) {
			const reqHeaderFk = this.getSelectedParent()?.Id;
			return { MainItemId: reqHeaderFk, ProjectId: this.getSelectedParent()?.ProjectFk };
		}
		throw new Error('Should have selected parent entity');
	}
}
