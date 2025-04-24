/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ISearchPayload, ISearchResult} from '@libs/platform/common';
import { get } from 'lodash';
import { PlatformAuthService } from '@libs/platform/authentication';
import { IMtwoPowerbiEntity, MtwoPowerbiComplete } from '@libs/mtwo/interfaces';

export const MTWO_CONTROL_TOWER_USER_DATA_TOKEN = new InjectionToken<MtwoControlTowerUserDataService>('mtwoControlTowerUserDataToken');

@Injectable({
	providedIn: 'root'
})

export class MtwoControlTowerUserDataService extends DataServiceFlatRoot<IMtwoPowerbiEntity, MtwoPowerbiComplete> {
	private authService = inject(PlatformAuthService);
	public username: string ='';
	public constructor() {
		const options: IDataServiceOptions<IMtwoPowerbiEntity> = {
			apiUrl: 'mtwo/controltower/powerbi',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true,
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
		// Fetch user data to get username for further filters.
		this.authService.getUserData().subscribe((userData) => {
			this.username = userData?.sub;
		});
	}
	
	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		payload.furtherFilters = [{Token: 'Description', Value: this.username}];
		return payload;
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IMtwoPowerbiEntity> {
		const filterResult = get(loaded, 'FilterResult')!;
		return {
			FilterResult: filterResult,
			dtos: loaded as IMtwoPowerbiEntity[],
		};
	}
}





		
			





