import { CompleteIdentification } from '@libs/platform/common';
import { IEventTypeEntity } from './entities/event-type-entity.interface';
import { IEventType2ResTypeEntity } from './entities/event-type-2res-type-entity.interface';
import { IEngType2PpsEventTypeEntity } from './entities/eng-type-2pps-event-type-entity.interface';

export class EventTypeComplete implements CompleteIdentification<IEventTypeEntity> {

	public EventType!: IEventTypeEntity | null;

	public EventType2ResTypeToSave?: IEventType2ResTypeEntity[];

	public EventType2ResTypeToDelete?: IEventType2ResTypeEntity[];

	public EngType2PpsEventTypeToSave?: IEngType2PpsEventTypeEntity[];

	public EngType2PpsEventTypeToDelete?: IEngType2PpsEventTypeEntity[];
}
