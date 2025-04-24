/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IPpsCommonBizPartnerEntity} from '../model/entities/pps-common-biz-partner-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsCommonBizPartnerGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsCommonBizPartnerEntity>, IPpsCommonBizPartnerEntity> {

}