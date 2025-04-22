import { inject, Injectable } from '@angular/core';
import { IProcurementCommonOverviewEntity, ProcurementCommonOverviewDataHelperService, ProcurementCommonOverviewDataService, ProcurementOverviewSearchlevel } from '@libs/procurement/common';
import { CompleteIdentification } from '@libs/platform/common';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';

@Injectable({
	providedIn: 'root',
})
export class RequisitionOverviewDataService extends ProcurementCommonOverviewDataService<IProcurementCommonOverviewEntity, CompleteIdentification<IProcurementCommonOverviewEntity>, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor() {
		const parentService = inject(ProcurementRequisitionHeaderDataService);
		const moduleInfoEntities = new ProcurementCommonOverviewDataHelperService();
		super(parentService, {
			moduleName: ProcurementModule.Requisition.toLowerCase(),
			entityInfo: moduleInfoEntities.getRequisitionOverviewContainerList(),
			searchLevel: ProcurementOverviewSearchlevel.RootContainer,
		});
	}
}
