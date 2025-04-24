/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPpsUpstreamItemTemplateEntity } from '../model/entities/pps-upstream-item-template-entity.interface';
import { PpsUpstreamItemTemplateComplete } from '../model/pps-upstream-item-template-complete.class';


@Injectable({
	providedIn: 'root'
})

export class ConfigurationUpstreamItemTemplateDataService extends DataServiceFlatRoot<IPpsUpstreamItemTemplateEntity, PpsUpstreamItemTemplateComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsUpstreamItemTemplateEntity> = {
			apiUrl: 'productionplanning/configuration/ppsupstreamitemtemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPpsUpstreamItemTemplateEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsUpstreamItemTemplate',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsUpstreamItemTemplateEntity | null): PpsUpstreamItemTemplateComplete {
		const complete = new PpsUpstreamItemTemplateComplete();
		if (modified !== null) {
			complete.PpsUpstreamItemTemplate = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsUpstreamItemTemplateComplete): IPpsUpstreamItemTemplateEntity[] {
		if (complete.PpsUpstreamItemTemplate) {
			return complete.PpsUpstreamItemTemplate;
		}
		return [];
	}
}












