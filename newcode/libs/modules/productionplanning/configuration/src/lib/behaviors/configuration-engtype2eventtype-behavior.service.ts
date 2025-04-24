/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IEngType2PpsEventTypeEntity } from '../model/entities/eng-type-2pps-event-type-entity.interface';


@Injectable({
	providedIn: 'root'
})
export class ConfigurationEngtype2eventtypeBehavior implements IEntityContainerBehavior<IGridContainerLink<IEngType2PpsEventTypeEntity>, IEngType2PpsEventTypeEntity> {

}