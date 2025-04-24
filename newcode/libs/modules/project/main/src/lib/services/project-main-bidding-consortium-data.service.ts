/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ProjectMainTenderResultDataService } from './project-main-tender-result-data.service';
import { IBiddingConsortiumEntity, ITenderResultComplete, ITenderResultEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainBiddingConsortiumDataService extends DataServiceFlatLeaf<IBiddingConsortiumEntity, ITenderResultEntity, ITenderResultComplete >{

	public constructor(private projectMainTenderResultDataService: ProjectMainTenderResultDataService) {
		const options: IDataServiceOptions<IBiddingConsortiumEntity>  = {
			apiUrl: 'project/main/biddingconsortium',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1: ident.pKey1!
					};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = projectMainTenderResultDataService.getSelection()[0];
					return {
						PKey1: selection.Id,
						PKey2: selection.ProjectFk
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IBiddingConsortiumEntity, ITenderResultEntity, ITenderResultComplete >>{
				role: ServiceRole.Leaf,
				itemName: 'BiddingConsortiums',
				parent: projectMainTenderResultDataService,
			},
		};

		super(options);
	}

	public override canCreate(): boolean {
		const selection = this.projectMainTenderResultDataService.getSelection()[0];
		return selection ? selection.IsBiddingConsortium : false;
	}

}








