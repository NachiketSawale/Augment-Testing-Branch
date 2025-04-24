/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsPhaseRequirementEntityGenerated } from './pps-phase-requirement-entity-generated.interface';

export interface IPpsPhaseRequirementEntity extends IPpsPhaseRequirementEntityGenerated {

	RequirementGoods?: number | null;
	RequirementResult?: number | null;
	RequirementResultStatus?: number | null;

}