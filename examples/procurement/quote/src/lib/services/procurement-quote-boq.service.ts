
import { Injectable } from '@angular/core';
import { BoqCompositeDataService, IBoqCompositeCompleteEntity } from '@libs/boq/main';
import { CompleteIdentification } from '@libs/platform/common';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from '../services/quote-header-data.service';

// Todo-BOQ: Create separate file for this complete entity probably in the procurement common module. Has to be discussed first. Same interface is also created in other prc modules like contract. Can be replaced with common one.
export interface IPrcBoqExtendedComplete extends CompleteIdentification<IPrcBoqExtendedEntity>, IBoqCompositeCompleteEntity {
	MainItemId: number;
	PrcBoqExtended: IPrcBoqExtendedEntity
}

/** Prc Quote boq list data service */
@Injectable({providedIn: 'root'})
export class ProcurementQuoteBoqDataService extends BoqCompositeDataService<IPrcBoqExtendedEntity, IPrcBoqExtendedComplete, IQuoteHeaderEntity, QuoteHeaderEntityComplete> {
	public constructor(private readonly parentService: ProcurementQuoteHeaderDataService) {
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
		return { prcHeaderFk: 1031667 /* this.parentService.getSelectedEntity()?.PrcHeaderFk */ , exchangeRate:1, filterBackups: false }; // TODO-BOQ: exchangeRate? TODO-PRC- this.parentService.getSelectedEntity()?.PrcHeaderFk always returns 0, need to check with PRC team.
	}

	public override isParentFn(qteHeader: IQuoteHeaderEntity, prcBoqExtended: IPrcBoqExtendedEntity): boolean {
		return true;  //qteHeader.Id === prcBoqExtended.PrcBoq?.PrcHeaderFk; // TODO-BOQ: What else to compare?
	}

	public override registerNodeModificationsToParentUpdate(complete: QuoteHeaderEntityComplete, modified: IPrcBoqExtendedComplete[], deleted: IPrcBoqExtendedEntity[]) {
		//
	}

}

