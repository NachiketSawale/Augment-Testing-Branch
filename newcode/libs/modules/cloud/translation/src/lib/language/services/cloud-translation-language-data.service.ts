/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';

import { ILanguageEntity } from '../model/entities/language-entity.interface';
import { IResourceEntity } from '../../resource/model/entities/resource-entity.interface';
import { CloudTranslationResourceComplete } from '../../resource/model/cloud-translation-resource-complete.class';
import { CloudTranslationResourceDataService } from '../../resource/services/cloud-translation-resource-data.service';


@Injectable({
	providedIn: 'root'
})


export class CloudTranslationLanguageDataService extends DataServiceFlatLeaf<ILanguageEntity,IResourceEntity, CloudTranslationResourceComplete >{

	public constructor(cloudTranslationResourceDataService:CloudTranslationResourceDataService) {
		const options: IDataServiceOptions<ILanguageEntity>  = {
			apiUrl: 'cloud/translation/language',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listLanguage',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createLanguage'
			},
			roleInfo: <IDataServiceChildRoleOptions<ILanguageEntity,IResourceEntity, CloudTranslationResourceComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Languages',
				parent: cloudTranslationResourceDataService,
			},		

		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const selection = this.getSelectedParent();

		if (selection) {
			return {  filter:'?mainItemId=' + selection.Id};
		}
		return { filter: '' };
	}

	protected override onLoadSucceeded(loaded: object): ILanguageEntity[] {
		return loaded as ILanguageEntity[];
	}
	
}



