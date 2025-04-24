/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { IPpsPhaseEntity } from '../../../model/process-configuration/pps-phase-entity.interface';


@Injectable({
	providedIn: 'root'
})
export class PpsPhaseGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsPhaseEntity>, IPpsPhaseEntity> {

}