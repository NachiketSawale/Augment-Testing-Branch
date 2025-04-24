/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IClerkRoleSlotEntity } from '../model/entities/clerk-role-slot-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationClerkRoleSlotBehavior implements IEntityContainerBehavior<IGridContainerLink<IClerkRoleSlotEntity>, IClerkRoleSlotEntity> {

}