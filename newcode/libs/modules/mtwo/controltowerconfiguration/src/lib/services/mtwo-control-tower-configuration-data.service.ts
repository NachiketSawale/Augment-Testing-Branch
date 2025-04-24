/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IMtwoPowerbiEntity, MtwoPowerbiComplete } from '@libs/mtwo/interfaces';
import { ISearchPayload, ISearchResult } from '@libs/platform/common';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';

@Injectable({
	providedIn: 'root'
})

/**
 * MTWO control tower configuration data service
 */
export class MtwoControlTowerConfigurationDataService extends DataServiceFlatRoot<IMtwoPowerbiEntity, MtwoPowerbiComplete> {

	public constructor() {
		const options: IDataServiceOptions<IMtwoPowerbiEntity> = {
			apiUrl: 'mtwo/controltower/powerbi',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IMtwoPowerbiEntity>>{
				role: ServiceRole.Root,
				itemName: 'MtoPowerbi',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IMtwoPowerbiEntity | null): MtwoPowerbiComplete {
		const complete = new MtwoPowerbiComplete();
		//TODO: need to implement
		return complete;
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload) : object{
		return { };
	}
	
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IMtwoPowerbiEntity> {
		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: loaded as IMtwoPowerbiEntity[]
		};
	}

}





		
			





