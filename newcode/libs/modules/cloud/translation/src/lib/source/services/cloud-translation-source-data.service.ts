/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { CloudTranslationResourceComplete } from '../../resource/model/cloud-translation-resource-complete.class';
import { IResourceEntity } from '../../resource/model/entities/resource-entity.interface';
import { CloudTranslationResourceDataService } from '../../resource/services/cloud-translation-resource-data.service';

import { ISourceEntity } from '../model/entities/source-entity.interface';

/**
 * Cloud Translation Source Data Service
 */
@Injectable({
	providedIn: 'root',
})
export class CloudTranslationSourceDataService extends DataServiceFlatLeaf<ISourceEntity, IResourceEntity, CloudTranslationResourceComplete> {
	public constructor(private readonly parent: CloudTranslationResourceDataService) {
		const options: IDataServiceOptions<ISourceEntity> = {
			apiUrl: 'cloud/translation/source',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listSource',
				usePost: true,
			},

			roleInfo: <IDataServiceChildRoleOptions<ISourceEntity, IResourceEntity, CloudTranslationResourceComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'cloudTranslationSourceDataService',
				parent: parent,
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false,
			},
		};

		super(options);
	}

	protected override onLoadSucceeded(loaded: object): ISourceEntity[] {
		return loaded as ISourceEntity[];
	}

	protected override provideLoadPayload(): object {
		const selectedResource = this.getSelectedParent();
		if (selectedResource) {
			return { filter: '?mainItemId=' + selectedResource.Id };
		} else {
			throw new Error('There should be a selected parent resource to load the corresponding source');
		}
	}
}
