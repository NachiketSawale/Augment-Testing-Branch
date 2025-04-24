import { IPpsPhaseEntity } from './pps-phase-entity.interface';
import { PpsPhaseComplete } from './pps-phase-complete.class';
export interface IPpsEntityWithPhaseToSaveToDelete {
	PhaseToSave: PpsPhaseComplete[],
	PhaseToDelete: IPpsPhaseEntity[]
}