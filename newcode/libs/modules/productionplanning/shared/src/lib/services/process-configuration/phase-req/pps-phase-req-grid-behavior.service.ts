/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {IEntityContainerBehavior, IGridContainerLink} from '@libs/ui/business-base';
import { IPpsPhaseRequirementEntity } from '../../../model/process-configuration/pps-phase-requirement-entity.interface';


@Injectable({
	providedIn: 'root'
})
export class PpsPhaseRequirementGridBehavior implements IEntityContainerBehavior<IGridContainerLink<IPpsPhaseRequirementEntity>, IPpsPhaseRequirementEntity> {

}