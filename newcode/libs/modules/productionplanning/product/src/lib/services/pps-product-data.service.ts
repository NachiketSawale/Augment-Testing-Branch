/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { get } from 'lodash';
import { Injectable } from '@angular/core';
import { ISearchResult } from '@libs/platform/common';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';

import { PpsProductComplete } from '../model/productionplanning-product-complete.class';
import { IPpsProductEntity } from '../model/entities/product-entity.interface';
import { IPpsEventParentService } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root',
})
export class PpsProductDataService extends DataServiceFlatRoot<IPpsProductEntity, PpsProductComplete> implements IPpsEventParentService {
	public constructor() {
		const options: IDataServiceOptions<IPpsProductEntity> = {
			apiUrl: 'productionplanning/common/product',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IPpsProductEntity>>{
				role: ServiceRole.Root,
				itemName: 'Products',
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsProductEntity | null): PpsProductComplete {
		const complete = new PpsProductComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Products = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsProductComplete): IPpsProductEntity[] {
		if (complete.Products === null) {
			complete.Products = [];
		}
		return complete.Products;
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IPpsProductEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: [],
			},
			dtos: get(loaded, 'Main')! as IPpsProductEntity[],
		};
	}

	public readonly ForeignKeyForEvent: string = 'ProductFk';
}
