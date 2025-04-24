/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEventTypeSlotEntity } from './entities/event-type-slot-entity.interface';

import { CompleteIdentification } from '@libs/platform/common';

export class EventTypeSlotComplete implements CompleteIdentification<IEventTypeSlotEntity> {

	/*
	 * EventTypeSlot
	 */
	public EventTypeSlot!: IEventTypeSlotEntity | null;
}
