/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IControltemplateGroupEntity } from '../model/models';

export const CONTROLLING_CONTROLLINGUNITTEMPLATE_GROUP_BEHAVIOR_TOKEN = new InjectionToken<ControllingControllingunittemplateGroupBehavior>('controllingControllingunittemplateGroupBehavior');

@Injectable({
	providedIn: 'root'
})
export class ControllingControllingunittemplateGroupBehavior implements IEntityContainerBehavior<IGridContainerLink<IControltemplateGroupEntity>, IControltemplateGroupEntity> {

}