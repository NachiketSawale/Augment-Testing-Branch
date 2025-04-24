import { PPSEventComplete } from '../pps-event-complete.class';
import { CompleteIdentification } from '@libs/platform/common';
import { IPPSEventEntity } from '../pps-event-entity.interface';

export interface IPpsEventParentEntity {
	LgmJobFk: number;
	Id: number;
}

export interface IPpsEventParentComplete<T extends object> extends CompleteIdentification<T> {
	EventsToSave: PPSEventComplete[] | null;
	EventsToDelete: IPPSEventEntity[] | null;
}
