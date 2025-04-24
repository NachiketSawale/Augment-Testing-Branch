/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSEventEntity } from './pps-event-entity.interface';

import { CompleteIdentification, IEntityBase } from '@libs/platform/common';

export class PPSEventComplete implements CompleteIdentification<IPPSEventEntity> {
	public MainItemId: number = 0;
	public Event?: IPPSEventEntity;
	public Events?: IPPSEventEntity[];
	public CostGroupToSave?: IEntityBase[];
	public CostGroupToDelete?: IEntityBase[];
}
