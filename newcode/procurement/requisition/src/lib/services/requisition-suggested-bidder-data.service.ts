import { ProcurementCommonSuggestBiddersDataService } from '@libs/procurement/common';
import { IPrcSuggestedBidderEntity } from '@libs/procurement/interfaces';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { Injectable } from '@angular/core';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class RequisitionSuggestedBidderDataService extends ProcurementCommonSuggestBiddersDataService<IPrcSuggestedBidderEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	protected internalModuleName: ProcurementInternalModule;

	public constructor(private readonly reqHeaderDataService: ProcurementRequisitionHeaderDataService) {
		super(reqHeaderDataService);
		this.internalModuleName = ProcurementInternalModule.Requisition;
		reqHeaderDataService.RootDataCreated$.subscribe((resp) => {});
	}

	protected override getMainItemId(parent: IReqHeaderEntity): number {
		const reqHeaderEntity = this.reqHeaderDataService.getSelectedEntity();
		if (reqHeaderEntity) {
			return reqHeaderEntity.PrcHeaderFk;
		} else {
			return 0;
		}
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcSuggestedBidderEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}

}
