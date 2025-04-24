/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import {
	DataServiceFlatRoot,
	ServiceRole,
	IDataServiceOptions,
	IDataServiceEndPointOptions,
	IDataServiceRoleOptions
} from '@libs/platform/data-access';

import { IPpsProductTemplateEntity } from '../model/models';
import { PpsProductTemplateComplete } from '@libs/productionplanning/shared';

@Injectable({
	providedIn: 'root'
})

export class PpsProductTemplateDataService extends DataServiceFlatRoot<IPpsProductTemplateEntity, PpsProductTemplateComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsProductTemplateEntity> = {
			apiUrl: 'productionplanning/producttemplate/productdescription',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPpsProductTemplateEntity>>{
				role: ServiceRole.Root,
				itemName: 'ProductDescriptions',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsProductTemplateEntity | null): PpsProductTemplateComplete {
		const complete = new PpsProductTemplateComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ProductDescriptions = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsProductTemplateComplete): IPpsProductTemplateEntity[] {
		if (complete.ProductDescriptions === null) {
			return [];
		}
		return complete.ProductDescriptions;
	}

}
