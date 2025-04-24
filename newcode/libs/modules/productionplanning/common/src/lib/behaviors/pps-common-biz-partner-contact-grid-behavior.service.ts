/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IPpsCommonBizPartnerContactEntity} from '../model/entities/pps-common-biz-partner-contact-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsCommonBizPartnerContactGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsCommonBizPartnerContactEntity>, IPpsCommonBizPartnerContactEntity> {

}