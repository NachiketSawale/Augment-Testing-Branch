/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IActivityEntity, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainHeaderDataService } from './businesspartner-data.service';
import { ActivityDataBaseService } from '@libs/businesspartner/shared';

@Injectable({
	providedIn: 'root',
})
export class ActivityDataService extends ActivityDataBaseService<IActivityEntity, IBusinessPartnerEntity> {
	public constructor(businesspartnerMainHeaderDataService: BusinesspartnerMainHeaderDataService) {
		super(businesspartnerMainHeaderDataService);
	}

	public override isParentFn(parentKey: IBusinessPartnerEntity, entity: IActivityEntity): boolean {
		return entity.BusinessPartnerFk === parentKey.Id;
	}
}
