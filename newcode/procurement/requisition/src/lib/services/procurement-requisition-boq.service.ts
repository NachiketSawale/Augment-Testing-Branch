
import { Injectable } from '@angular/core';
import { BoqCompositeDataService, IBoqCompositeCompleteEntity } from '@libs/boq/main';
import { CompleteIdentification } from '@libs/platform/common';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { ProcurementRequisitionHeaderDataService } from './requisition-header-data.service';
import { IReqHeaderEntity } from '../model/entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../model/entities/requisition-complete-entity.class';

// Todo-BOQ: Create separate file for this complete entity probably in the procurement common module. Has to be discussed first. Same interface is also created in other prc modules like contract. Can be replaced with common one.
export interface IPrcBoqExtendedComplete extends CompleteIdentification<IPrcBoqExtendedEntity>, IBoqCompositeCompleteEntity {
	MainItemId: number;
	PrcBoqExtended: IPrcBoqExtendedEntity
}

/** Prc Requisition boq list data service */
@Injectable({providedIn: 'root'})
export class ProcurementRequisitionBoqDataService extends BoqCompositeDataService<IPrcBoqExtendedEntity, IPrcBoqExtendedComplete, IReqHeaderEntity, ReqHeaderCompleteEntity> {
	public constructor(private readonly parentService: ProcurementRequisitionHeaderDataService) {
		const options: IDataServiceOptions<IPrcBoqExtendedEntity> = {
			apiUrl: 'procurement/common/boq',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IPrcBoqExtendedEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrcBoqExtended',
				parent: parentService,
			},
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		return { prcHeaderFk: this.parentService.getSelectedEntity()?.PrcHeaderFk , exchangeRate:1, filterBackups: false }; // TODO-BOQ: exchangeRate?
	}

	public override isParentFn(reqHeader: IReqHeaderEntity, prcBoqExtended: IPrcBoqExtendedEntity): boolean {
		return true;  //reqHeader.Id === prcBoqExtended.PrcBoq?.PrcHeaderFk; // TODO-BOQ: What else to compare?
	}

}

