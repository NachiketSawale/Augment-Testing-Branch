/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IPpsPhaseEntity} from './pps-phase-entity.interface';
import { IPpsPhaseRequirementEntity} from './pps-phase-requirement-entity.interface';

export class PpsPhaseComplete implements CompleteIdentification<IPpsPhaseEntity> {

	public MainItemId: number = 0;
	public Phase: IPpsPhaseEntity | null = null;

	public PhaseRequirementToSave: IPpsPhaseRequirementEntity[] | null = [];
	public PhaseRequirementToDelete: IPpsPhaseRequirementEntity[] | null = [];
}
