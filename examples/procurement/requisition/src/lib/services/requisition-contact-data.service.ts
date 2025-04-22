import { IPrcContactEntity, ProcurementCommonContactDataService } from '@libs/procurement/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { inject, Injectable } from '@angular/core';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { IReqItemEntity } from '../model/entities/req-item-entity.interface';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class RequisitionContactDataService extends ProcurementCommonContactDataService<IPrcContactEntity, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		const headerDataService = inject(ProcurementRequisitionHeaderDataService);
		super(headerDataService, {});
	}

	public getSelectedParentEntity() {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem?.BusinessPartnerFk) {
			return {
				BusinessPartnerFk: parentItem.BusinessPartnerFk,
				BusinessPartner2Fk: -1,
			};
		}
		return {
			BusinessPartnerFk: -1,
			BusinessPartner2Fk: -1,
		};
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				MainItemId: parentSelection.Id,
				ProjectId: parentSelection.ProjectFk,
				moduleName: ProcurementInternalModule.Requisition,
			};
		}

		return {
			MainItemId: -1,
			ProjectId: -1,
			moduleName: ProcurementInternalModule.Requisition,
		};
	}

	protected override onLoadSucceeded(loaded: object): IReqItemEntity[] {
		if (loaded) {
			return get(loaded, 'contact', []);
		}
		return [];
	}

	public override isParentFn(parentKey: IReqHeaderEntity, entity: IPrcContactEntity): boolean {
		return entity.PrcHeaderFk === parentKey.PrcHeaderFk;
	}
}
