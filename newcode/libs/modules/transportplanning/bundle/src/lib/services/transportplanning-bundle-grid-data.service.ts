/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, IEntityList, ServiceRole } from '@libs/platform/data-access';
import { TransportplanningBundleGridComplete } from '../model/transportplanning-bundle-grid-complete.class';
import { IBundleEntity } from '../model/entities/bundle-entity.interface';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';
import { IPpsEventParentService } from '@libs/productionplanning/shared';

export const TRANSPORTPLANNING_BUNDLE_GRID_DATA_TOKEN = new InjectionToken<TransportplanningBundleGridDataService>('transportplanningBundleGridDataToken');

@Injectable({
	providedIn: 'root',
})
export class TransportplanningBundleGridDataService extends DataServiceFlatRoot<IBundleEntity, TransportplanningBundleGridComplete> implements IPpsEventParentService {
	public constructor() {
		const options: IDataServiceOptions<IBundleEntity> = {
			apiUrl: 'transportplanning/bundle/bundle',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletebundles',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
			},
			roleInfo: <IDataServiceRoleOptions<IBundleEntity>>{
				role: ServiceRole.Root,
				itemName: 'Bundles',
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IBundleEntity | null): TransportplanningBundleGridComplete {
		const complete = new TransportplanningBundleGridComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Bundles = [modified];
		}

		return complete;
	}

	protected takeOverUpdatedFromComplete(complete: TransportplanningBundleGridComplete, entityList: IEntityList<IBundleEntity>) {
		if (complete && complete.Bundles && complete.Bundles.length > 0) {
			entityList.updateEntities(complete.Bundles);
		}
	}

	public override getModificationsFromUpdate(complete: TransportplanningBundleGridComplete): IBundleEntity[] {
		if (complete.Bundles === null) {
			complete.Bundles = [];
		}

		return complete.Bundles;
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IBundleEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [],
			},
			dtos: get(loaded, 'Main')! as IBundleEntity[],
		};
	}

	public readonly ForeignKeyForEvent: string = 'TrsProductBundleFk';
}
