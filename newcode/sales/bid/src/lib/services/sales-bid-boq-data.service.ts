/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { BoqCompositeDataService } from '@libs/boq/main';
import { IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IBidBoqCompositeEntity, IBidHeaderEntity } from '@libs/sales/interfaces';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';

//TODO-BOQ-Incomplete
@Injectable({providedIn: 'root'})

/**
 * Sales bid boq data service
 */
export class SalesBidBoqDataService extends BoqCompositeDataService<IBidBoqCompositeEntity, IBidBoqCompositeEntity, IBidHeaderEntity, BidHeaderComplete> {
	public constructor(private parentService: SalesBidBidsDataService) {
		const options: IDataServiceOptions<IBidBoqCompositeEntity> = {
			apiUrl: 'sales/bid/boq',
			roleInfo: <IDataServiceRoleOptions<IBidBoqCompositeEntity>>{
				role: ServiceRole.Node,
				itemName: 'BilBoqComposite',
				parent: parentService,
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
		};
		super(options);
	}
	protected override provideLoadPayload(): object {
		const selection = this.parentService.getSelectedEntity()!;
		return { bidId: selection.Id };
	}
	public override isParentFn(parentKey: IBidHeaderEntity, entity: IBidBoqCompositeEntity): boolean {
		return entity.BidBoq?.BidHeaderFk === parentKey.Id;
	}
	public override createUpdateEntity(modifiedOrdBoq: IBidBoqCompositeEntity): IBidBoqCompositeEntity {
		return modifiedOrdBoq;
	}
	public override registerNodeModificationsToParentUpdate(complete: BidHeaderComplete, modified: IBidBoqCompositeEntity[], deleted: IBidBoqCompositeEntity[]) {
		if (modified.length > 0) {
			complete.BidBoqCompositeToSave = modified;
		}
		if (deleted.length > 0) {
			complete.BidBoqCompositeToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: BidHeaderComplete): IBidBoqCompositeEntity[] {
		return complete.BidBoqCompositeToSave || [];
	}
}