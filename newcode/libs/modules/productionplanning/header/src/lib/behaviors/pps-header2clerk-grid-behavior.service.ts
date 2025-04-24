/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import {IPpsHeader2ClerkEntity} from '../model/entities/pps-header2clerk-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsHeader2ClerkGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsHeader2ClerkEntity>, IPpsHeader2ClerkEntity> {

}