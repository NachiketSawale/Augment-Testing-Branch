/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { ProductionplanningProductionsetComplete } from '../model/productionplanning-productionset-complete.class';
import { IProductionsetEntity } from '../model/models';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';
import { IPpsEventParentService } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root',
})
export class ProductionplanningProductionsetDataService extends DataServiceFlatRoot<IProductionsetEntity, ProductionplanningProductionsetComplete> implements IPpsEventParentService {
	public constructor() {
		const options: IDataServiceOptions<IProductionsetEntity> = {
			apiUrl: 'productionplanning/productionset/productionset',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<IProductionsetEntity>>{
				role: ServiceRole.Root,
				itemName: 'Productionset',
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IProductionsetEntity | null): ProductionplanningProductionsetComplete {
		const complete = new ProductionplanningProductionsetComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ProductionplanningProductionsetComplete): IProductionsetEntity[] {
		if (complete.Productionset === null) {
			complete.Productionset = [];
		}
		return complete.Productionset;
	}

	protected override onLoadByFilterSucceeded(loaded: IProductionsetEntity): ISearchResult<IProductionsetEntity> {
		const fr = get(loaded, 'FilterResult')!;

		return {
			FilterResult: fr,
			dtos: get(loaded, 'Main')! as IProductionsetEntity[],
		};
	}

	public readonly ForeignKeyForEvent: string = 'ProductionSetFk';
}
