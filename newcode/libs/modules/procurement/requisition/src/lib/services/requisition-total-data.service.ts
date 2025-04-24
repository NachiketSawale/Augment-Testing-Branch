import { Injectable } from '@angular/core';
import {ProcurementCommonTotalDataService } from '@libs/procurement/common';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { IPrcCommonTotalEntity } from '@libs/procurement/interfaces';

@Injectable({
	providedIn: 'root',
})
export class RequisitionTotalDataService extends ProcurementCommonTotalDataService<IPrcCommonTotalEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	private readonly reqHeaderDataService: ProcurementRequisitionHeaderDataService;

	public constructor(reqHeaderDataService: ProcurementRequisitionHeaderDataService) {
		super(reqHeaderDataService, { apiUrl: 'procurement/requisition/total' });
		this.reqHeaderDataService = reqHeaderDataService;
		reqHeaderDataService.RootDataCreated$.subscribe((resp) => {
			if (resp.PrcTotalsDto) {
				this.createdTotals = resp.PrcTotalsDto;
			}
		});
	}

	public getExchangeRate(): number {
		return this.parentService.getSelectedEntity()!.ExchangeRate;
	}

	protected internalModuleName: ProcurementInternalModule = ProcurementInternalModule.Requisition;

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcCommonTotalEntity): boolean {
		return entity.HeaderFk === parentKey.Id;
	}

}
