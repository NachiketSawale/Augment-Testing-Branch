/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IControltemplateEntity } from '../model/entities/controltemplate-entity.interface';

export const CONTROLLING_CONTROLLINGUNITTEMPLATE_BEHAVIOR_TOKEN = new InjectionToken<ControllingControllingunittemplateBehavior>('controllingControllingunittemplateBehavior');

@Injectable({
	providedIn: 'root'
})
export class ControllingControllingunittemplateBehavior implements IEntityContainerBehavior<IGridContainerLink<IControltemplateEntity>, IControltemplateEntity> {

}