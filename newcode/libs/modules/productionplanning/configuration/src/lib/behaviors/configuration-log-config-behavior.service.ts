/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { IPpsLogConfigEntity } from '../model/entities/pps-log-config-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationLogConfigBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsLogConfigEntity>, IPpsLogConfigEntity> {

}