/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { PPSItemComplete } from '../model/entities/pps-item-complete.class';
import { IPPSItemEntity } from '../model/models';
import { IPpsEventParentService } from '@libs/productionplanning/shared';

export const PPS_ITEM_DATA_TOKEN = new InjectionToken<PpsItemDataService>('ppsItemDataToken');

@Injectable({
	providedIn: 'root',
})
export class PpsItemDataService extends DataServiceHierarchicalRoot<IPPSItemEntity, PPSItemComplete> implements IPpsEventParentService {
	public constructor() {
		const options: IDataServiceOptions<IPPSItemEntity> = {
			apiUrl: 'productionplanning/item',
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createitem',
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IPPSItemEntity>>{
				role: ServiceRole.Root,
				itemName: 'PPSItem',
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPPSItemEntity | null): PPSItemComplete {
		const complete = new PPSItemComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PPSItem = [modified];
		}

		return complete;
	}

	public override parentOf(element: IPPSItemEntity): IPPSItemEntity | null {
		return null;
	}

	public override childrenOf(element: IPPSItemEntity): IPPSItemEntity[] {
		return element.ChildItems ?? [];
	}

	public readonly ForeignKeyForEvent: string = 'ItemFk';

	public override getModificationsFromUpdate(complete: PPSItemComplete): IPPSItemEntity[] {
		if (complete.PPSItem === null) {
			complete.PPSItem = [];
		}
		return complete.PPSItem;
	}
}
