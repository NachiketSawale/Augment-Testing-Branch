/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { CloudTranslationResourceComplete } from '../model/cloud-translation-resource-complete.class';
import { IResourceEntity } from '../model/entities/resource-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class CloudTranslationResourceDataService extends DataServiceFlatRoot<IResourceEntity, CloudTranslationResourceComplete> {
	public constructor() {
		const options: IDataServiceOptions<IResourceEntity> = {
			apiUrl: 'cloud/translation/resource',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true,
			},

			roleInfo: <IDataServiceRoleOptions<IResourceEntity>>{
				role: ServiceRole.Root,
				itemName: 'Resource',
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: IResourceEntity | null): CloudTranslationResourceComplete {
		const complete = new CloudTranslationResourceComplete();
		if (modified !== null) {
			complete.Id = modified.Id as number;
			complete.Datas = [modified];
		}

		return complete;
	}
}
