/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';

/**
 * Business partner header behavior
 */
@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerMainHeaderGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IBusinessPartnerEntity>, IBusinessPartnerEntity> {

	public constructor() {
	}

	public onCreate(containerLink: IGridContainerLink<IBusinessPartnerEntity>) {
	}
}