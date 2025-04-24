/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IControltemplateUnitEntity } from '../model/models';

export const CONTROLLING_CONTROLLINGUNITTEMPLATE_UNIT_BEHAVIOR_TOKEN = new InjectionToken<ControllingControllingunittemplateUnitBehavior>('controllingControllingunittemplateUnitBehavior');

@Injectable({
	providedIn: 'root'
})
export class ControllingControllingunittemplateUnitBehavior implements IEntityContainerBehavior<IGridContainerLink<IControltemplateUnitEntity>, IControltemplateUnitEntity> {

}