/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { CloudTranslationResourceComplete } from '../../resource/model/cloud-translation-resource-complete.class';
import { IResourceEntity } from '../../resource/model/entities/resource-entity.interface';
import { CloudTranslationResourceDataService } from '../../resource/services/cloud-translation-resource-data.service';
import { ITranslationEntity } from '../model/entities/translation-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class CloudTranslationTranslationDataService extends DataServiceFlatLeaf<ITranslationEntity, IResourceEntity, CloudTranslationResourceComplete> {
	public constructor(private readonly parent: CloudTranslationResourceDataService) {
		const options: IDataServiceOptions<ITranslationEntity> = {
			apiUrl: 'cloud/translation/translation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listTranslation',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createTranslation',
			},
			roleInfo: <IDataServiceChildRoleOptions<ITranslationEntity, IResourceEntity, CloudTranslationResourceComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Translations',
				parent: parent,
			},
		};

		super(options);
	}

	protected override onLoadSucceeded(loaded: object): ITranslationEntity[] {
		return loaded as ITranslationEntity[];
	}

	protected override provideLoadPayload(): object {
		const selectedResource = this.getSelectedParent();
		if (selectedResource) {
			return { SuperEntityId: selectedResource.Id, filter: '' };
		} else {
			throw new Error('There should be a selected parent resource to load the corresponding translation ');
		}
	}
}
